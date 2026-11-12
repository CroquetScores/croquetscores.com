import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import { notableLevelOf } from "./notableTournament.js";
import { RemoveNotableStatus } from "./RemoveNotableStatus.js";
import {
  askedBy,
  detailsFrom,
  takenFor,
  tournamentFor,
  type TournamentAddresses,
} from "./tournamentOperations.js";

/**
 * Taking away a tournament's national or international status, and emailing
 * each of its managers why. The tournament is changed as an update would
 * change it, with everything else said again as it is, so that nothing but the
 * status is different afterwards.
 *
 * The emails are queued in the transaction that keeps the change, so that they
 * go if and only if it is kept. They are in English whatever language the
 * manager reads the site in: they are the administrator's own words, and the
 * administrator writes English (`writtenInEnglishOnly.ts`).
 */
export class RemoveNotableStatusHandler extends CommandHandler<
  RemoveNotableStatus,
  void
> {
  readonly handles: RequestType<RemoveNotableStatus> = RemoveNotableStatus;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly addresses: TournamentAddresses,
    private readonly queue: EmailQueue,
  ) {
    super();
  }

  async handle(command: RemoveNotableStatus): Promise<void> {
    // Asked before the tournament is looked for, so that a reader who is not
    // an administrator is told nothing of which tournaments there are.
    await administratorAsking(this.accounts, command.account);
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "RemoveNotableStatus",
    );
    const level = notableLevelOf(tournament);
    // Neither: nothing to take away, and nobody to tell it of.
    if (level === undefined) return;

    const details = detailsFrom({
      name: tournament.name.toString(),
      starts: tournament.starts.toISOString(),
      finishes: tournament.finishes.toISOString(),
      format: tournament.format.name,
      sport: tournament.sport.code,
      country: tournament.country.code,
      region: tournament.region?.code,
      subtitle: tournament.subtitle?.markdown,
      levelTestsDrawn: tournament.levelTestsDrawn,
      national: false,
      international: false,
    });
    tournament.update(
      details,
      await takenFor(this.addresses, details, tournament.id),
      by,
      command.requestedAt,
    );
    await this.tournaments.save(tournament);

    for (const manager of tournament.managers) {
      const account = await this.accounts.load(manager);
      // A forgotten account has no address to write to, and nobody to read it.
      if (account === undefined || account.forgotten) continue;
      await this.queue.queue({
        kind:
          level === "international"
            ? "Email.InternationalStatusRemoved"
            : "Email.NationalStatusRemoved",
        to: account.emailAddress.toString(),
        account: manager,
        language: "en",
        website: tournament.website.host,
        fill: {
          tournament: tournament.name.toString(),
          address: tournament.address.toString(),
        },
        queuedAt: command.requestedAt,
      });
    }
  }
}
