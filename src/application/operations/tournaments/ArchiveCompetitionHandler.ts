import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Games } from "../../services/Games.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";
import { ArchiveCompetition } from "./ArchiveCompetition.js";

/**
 * Archiving one of a tournament's competitions, of whatever kind. A block, a
 * knockout or a Swiss is archived with its games, so they are not asked about;
 * a test is not archived once it has been played, so the games say what has
 * been played in one, which the tournament does not know.
 */
export class ArchiveCompetitionHandler extends CommandHandler<
  ArchiveCompetition,
  void
> {
  readonly handles: RequestType<ArchiveCompetition> = ArchiveCompetition;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly games: Games,
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
    const isATest = tournament.competitions.some(
      ({ reference, shape }) =>
        reference.id.equals(competition) && shape.kind === "test",
    );
    tournament.archiveCompetition(
      competition,
      by,
      command.requestedAt,
      isATest
        ? await this.games.playedIn(tournament.id, competition)
        : undefined,
    );
    await this.tournaments.save(tournament);
  }
}
