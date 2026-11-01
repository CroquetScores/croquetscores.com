import type { CarryForwardCount } from "../../../domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { Competition } from "../../../domain/aggregates/tournaments/competitions/Competition.js";
import type { Game } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import { matchesBetween } from "../../../domain/aggregates/tournaments/competitions/matchesBetween.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type {
  CompetitionShape,
  Tournament,
} from "../../../domain/aggregates/tournaments/Tournament.js";
import { countsForNothingIn } from "../competitions/competitionOperations.js";
import type { PlayerOfBlock } from "./PublicBlockOfTournament.js";
import { type PlacedPlayers, placePlayers } from "./placingsOfBlock.js";

/** A block's standings: its players' totals, and where they are placed. */
export interface StandingsOfBlock {
  /** Every game of it in use, withdrawn ones among them. */
  readonly games: readonly Game[];
  /** Whether a game was played but counts for nothing. */
  readonly countsForNothing: (game: Game) => boolean;
  /** Every player entered in it, in the block's order, with their totals. */
  readonly players: readonly Omit<PlayerOfBlock, "placing">[];
  readonly placed: PlacedPlayers;
}

/**
 * The standings of the block `id` of `tournament`, which `competition` is the
 * games of. Said once here, for the block's own page and for whatever else
 * says who won it, so that the two cannot work out two winners.
 */
export const standingsOfBlock = (
  tournament: Tournament,
  competition: Competition,
  id: CompetitionId,
  shape: Extract<CompetitionShape, { readonly kind: "block" }>,
): StandingsOfBlock => {
  const games = competition.games.filter((game) => !game.archived);
  // What counts for nothing is still shown, and answered as withdrawn, so
  // that the pages strike it through.
  const countsForNothing = countsForNothingIn(competition, tournament, id);
  const counting = games.filter((game) => !countsForNothing(game));
  const bestOf = shape.bestOf.games;
  const matches = decidedMatchesOf(counting, bestOf);
  const address = tournament.address.toString();
  const players = competition.players.flatMap(
    (entered): Omit<PlayerOfBlock, "placing">[] => {
      const player = tournament.players.find((each) =>
        each.id.equals(entered.tournamentPlayerId),
      );
      if (player === undefined) return [];
      const theirs = counting.filter(
        (game) =>
          game.winner.equals(entered.id) || game.loser.equals(entered.id),
      );
      const won = theirs.filter(
        (game) => !game.drawn && game.winner.equals(entered.id),
      );
      const lost = theirs.filter(
        (game) => !game.drawn && game.loser.equals(entered.id),
      );
      // What is not carried forward counts as nothing carried, and so does
      // all of it where the player has withdrawn, as their games do.
      const carried = (count: CarryForwardCount): number =>
        entered.withdrawn ? 0 : (entered.carryForward.of(count) ?? 0);
      const hoops = theirs.reduce((net, game) => {
        const margin = game.winnerScore.points - game.loserScore.points;
        return net + (game.winner.equals(entered.id) ? margin : -margin);
      }, 0);
      return [
        {
          id: entered.id.value,
          name: player.name.toString(),
          representing: player.representing,
          handicap: player.handicap,
          flag: player.flag === undefined ? undefined : String(player.flag),
          address: `${address}/players/${player.slug.toString()}`,
          withdrawn: entered.withdrawn,
          matchesWon:
            matches.filter((match) => match.winner === entered.id.value)
              .length + carried("matchWins"),
          matchesLost:
            matches.filter((match) => match.loser === entered.id.value).length +
            carried("matchLosses"),
          gamesWon: won.length + carried("gameWins"),
          netGames:
            won.length -
            lost.length +
            carried("gameWins") -
            carried("gameLosses"),
          netHoops: hoops + carried("hoopsFor") - carried("hoopsAgainst"),
        },
      ];
    },
  );
  return {
    games,
    countsForNothing,
    players,
    placed: placePlayers(players, matches, shape.tieBreak, bestOf),
  };
};

// The matches among `games` that somebody won, each with its winner and its
// loser. Each pair's games, in the order they were added, are cut into
// matches (matchesBetween.ts), as the competition cuts them, so that two
// players of a block played in rounds, or the best of 1, play a match in each.
// A match is won by whoever wins more than half the games it is the best of:
// so a match not yet decided, or shared in a best of an even number, is won by
// neither.
const decidedMatchesOf = (
  games: readonly Game[],
  bestOf: number,
): { readonly winner: string; readonly loser: string }[] => {
  const byPair = new Map<string, Game[]>();
  for (const game of games) {
    const pair = [game.winner.value, game.loser.value].sort().join(" ");
    byPair.set(pair, [...(byPair.get(pair) ?? []), game]);
  }
  return [...byPair.values()].flatMap((theirs) =>
    matchesBetween(theirs, bestOf).flatMap((match) => {
      const [first] = match.games;
      if (first === undefined) return [];
      const wins = (id: string): number =>
        match.games.filter((each) => !each.drawn && each.winner.value === id)
          .length;
      const [one, other] = [first.winner.value, first.loser.value];
      if (wins(one) * 2 > bestOf) return [{ winner: one, loser: other }];
      if (wins(other) * 2 > bestOf) return [{ winner: other, loser: one }];
      return [];
    }),
  );
};
