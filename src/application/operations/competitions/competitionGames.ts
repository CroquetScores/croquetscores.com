import type { Competition } from "../../../domain/aggregates/tournaments/competitions/Competition.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { Games } from "../../services/Games.js";
import type { Competitions } from "./competitionOperations.js";

/**
 * The application's games: the ones its tournaments' competitions keep,
 * archived competitions and archived games among them, since an archived game
 * can be restored. A knockout's draw is fixed once it has a game, so a change
 * to the draw of one that has a game moves a player who has played.
 */
export const gamesKeptByCompetitions = (
  tournaments: AggregateRepository<Tournament, TournamentId>,
  competitions: Competitions,
): Games => {
  const competitionsOf = async (
    tournament: TournamentId,
  ): Promise<Competition[]> => {
    const found = await tournaments.load(tournament);
    const kept: Competition[] = [];
    for (const { reference } of found?.competitions ?? []) {
      const competition = await competitions.load(reference.id);
      if (competition !== undefined) kept.push(competition);
    }
    return kept;
  };
  return {
    hasPlayed: async (tournament: TournamentId, player: TournamentPlayerId) =>
      (await competitionsOf(tournament)).some((competition) =>
        competition.players.some(
          (each) =>
            each.tournamentPlayerId.equals(player) &&
            competition.hasPlayed(each.id),
        ),
      ),
    movesAPlayerWhoHasPlayed: async (
      _tournament: TournamentId,
      competition: CompetitionId,
    ) => ((await competitions.load(competition))?.games.length ?? 0) > 0,
  };
};
