import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { ArchiveTournament } from "./ArchiveTournament.js";

/**
 * Archiving a tournament. It names the account the reader is signed in to, and the
 * tournament by its id.
 */
export class ArchiveTournamentHandler extends CommandHandler<
  ArchiveTournament,
  void
> {
  readonly handles: RequestType<ArchiveTournament> = ArchiveTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: ArchiveTournament): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ArchiveTournament",
    );
    tournament.archive(by, command.requestedAt);
    await this.tournaments.save(tournament);
  }
}
