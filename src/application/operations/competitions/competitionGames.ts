import type { Competition } from "../../../domain/aggregates/tournaments/competitions/Competition.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { TeamPlayerId } from "../../../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type {
  TestPlayed,
  Tournament,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { Games } from "../../services/Games.js";
import type { Competitions } from "./competitionOperations.js";

/**
 * What has been played in `competition`, a test: a match is started once its
 * two players have a game in use, and its games are those between them. An
 * archived game counts for nothing, so it starts no match and adds to none.
 */
const playedInTest = (competition: Competition | undefined): TestPlayed => {
  const matches = new Map<string, number>();
  for (const game of competition?.games ?? []) {
    if (game.archived) continue;
    // The same two players whichever of them won.
    const pair = [game.winner.value, game.loser.value].sort().join(" ");
    matches.set(pair, (matches.get(pair) ?? 0) + 1);
  }
  return {
    matchesStarted: matches.size,
    mostGamesBetweenTwo: Math.max(0, ...matches.values()),
  };
};

/**
 * The application's games: the ones its tournaments' competitions keep,
 * archived competitions among them, tests among them. Only the games in use
 * count: an archived game counts for nothing. A knockout's draw is fixed once
 * it has a game in use, so a change to the draw of one that has one moves a
 * player who has played.
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
  // A test names its players by their ids in their teams, so a game of
  // theirs is found by that id alone.
  const teamPlayersWhoHavePlayed = async (
    tournament: TournamentId,
  ): Promise<ReadonlySet<string>> => {
    const played = new Set<string>();
    for (const competition of await competitionsOf(tournament)) {
      for (const game of competition.games) {
        if (game.archived) continue;
        played.add(game.winner.value);
        played.add(game.loser.value);
      }
    }
    return played;
  };
  return {
    hasPlayed: async (tournament: TournamentId, player: TournamentPlayerId) =>
      (await competitionsOf(tournament)).some((competition) =>
        competition.players.some(
          (each) =>
            each.tournamentPlayerId.equals(player) &&
            competition.hasGamesInUse(each.id),
        ),
      ),
    movesAPlayerWhoHasPlayed: async (
      _tournament: TournamentId,
      competition: CompetitionId,
    ) =>
      (await competitions.load(competition))?.games.some(
        (game) => !game.archived,
      ) ?? false,
    teamPlayerHasPlayed: async (
      tournament: TournamentId,
      player: TeamPlayerId,
    ) => (await teamPlayersWhoHavePlayed(tournament)).has(player.value),
    teamPlayersWhoHavePlayed,
    playedIn: async (_tournament: TournamentId, test: CompetitionId) =>
      playedInTest(await competitions.load(test)),
  };
};
