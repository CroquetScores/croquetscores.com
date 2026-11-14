import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import { administratorAsking } from "../accounts/roleOperations.js";
import { DeleteTournament } from "./DeleteTournament.js";
import {
  TournamentOperationRefused,
  askedBy,
  tournamentFor,
} from "./tournamentOperations.js";

/**
 * Deleting a test tournament: emailing each of its managers what the
 * administrator wrote, and archiving it where that is asked
 * (DeleteTournament.feature).
 *
 * The emails are queued in the transaction that keeps the archiving, so that
 * they go if and only if it is kept. They are in English whatever language the
 * manager reads the site in: they are the administrator's own words, and the
 * administrator writes English (`writtenInEnglishOnly.ts`).
 */
export class DeleteTournamentHandler extends CommandHandler<
  DeleteTournament,
  void
> {
  readonly handles: RequestType<DeleteTournament> = DeleteTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly queue: EmailQueue,
  ) {
    super();
  }

  async handle(command: DeleteTournament): Promise<void> {
    // Asked before anything else is looked at, so that a reader who is not an
    // administrator is told nothing of which tournaments there are.
    await administratorAsking(this.accounts, command.account);
    const message = command.message.trim();
    if (message === "") {
      throw new TournamentOperationRefused(
        "DeleteTournament.MessageMissing",
        "Nothing was said to the managers.",
      );
    }
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "DeleteTournament",
    );

    if (command.archive) {
      // Asked as the account is known to the tournament, which is as an
      // administrator, who may archive any tournament.
      const by = await askedBy(this.accounts, command.account);
      tournament.archive(by, command.requestedAt);
      await this.tournaments.save(tournament);
    }

    for (const manager of tournament.managers) {
      const account = await this.accounts.load(manager);
      // A forgotten account has no address to write to, and nobody to read it.
      if (account === undefined || account.forgotten) continue;
      await this.queue.queue({
        kind: "Email.TournamentDeleted",
        to: account.emailAddress.toString(),
        account: manager,
        language: "en",
        website: tournament.website.host,
        fill: { tournament: tournament.name.toString(), message },
        queuedAt: command.requestedAt,
      });
    }
  }
}
