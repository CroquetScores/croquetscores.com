import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { ArchiveCompetition } from "./ArchiveCompetition.js";

/**
 * Archiving one of a tournament's competitions, of whatever kind. Whether it
 * has games is not asked, since one that has is archived with them.
 */
export class ArchiveCompetitionHandler extends CommandHandler<
  ArchiveCompetition,
  void
> {
  readonly handles: RequestType<ArchiveCompetition> = ArchiveCompetition;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: ArchiveCompetition): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "ArchiveCompetition",
    );
    const competition = CompetitionId.from(command.competition);
    tournament.archiveCompetition(competition, by, command.requestedAt);
    await this.tournaments.save(tournament);
  }
}
