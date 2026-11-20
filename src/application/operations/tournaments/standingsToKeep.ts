// The standings of a block and of a Swiss, worked out of plain data: each
// player's entry, the games played, and what the competition is played as. Done
// when the competition changes, so that its pages and the API read what was
// worked out and not the competition (`competitionStandings.ts`). How a block's
// players are placed is `placingsOfBlock.ts`'s, which this feeds.
import {
  Game,
  gamePlayerIdFrom,
} from "../../../domain/aggregates/tournaments/competitions/Game.js";
import { matchesBetween } from "../../../domain/aggregates/tournaments/competitions/matchesBetween.js";
import { GameId } from "../../../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import type { CarryForwardCount } from "../../../domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import { Score } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import type { TieBreak } from "../../../domain/aggregates/tournaments/value-objects/TieBreak.js";
import type { GameKept } from "./competitionGames.js";
import type {
  EntryToStand,
  StandingKept,
  StandingsToKeep,
} from "./competitionStandings.js";
import { type DecidedMatch, placePlayers } from "./placingsOfBlock.js";

// The points of a score as it was typed: the digits it begins with.
export const pointsOf = (typed: string): number =>
  Score.kept(typed, false).points;

// A game that counts, which is one neither archived nor withdrawn, and not one
// of a player who has withdrawn: such a game counts for nothing, on both sides,
// since a player who left partway met some of the others and not the rest
// (`withdrawPlayer.feature`).
const gamesThatCount = (
  games: readonly GameKept[],
  entries: readonly EntryToStand[],
): GameKept[] => {
  const withdrawn = new Set(
    entries.filter((each) => each.withdrawn).map((each) => each.id),
  );
  return games.filter(
    (game) =>
      !game.archived &&
      !game.withdrawn &&
      !withdrawn.has(game.winner) &&
      !withdrawn.has(game.loser),
  );
};

// What is not carried forward counts as nothing carried, and so does all of it
// where the player has withdrawn, as their games do.
const carriedBy =
  (entry: EntryToStand) =>
  (count: CarryForwardCount): number =>
    entry.withdrawn ? 0 : (entry.carried[count] ?? 0);

// The margin by which `id` won the game, or lost it as a negative.
const marginOf = (game: GameKept, id: string): number => {
  const margin = pointsOf(game.winnerScore) - pointsOf(game.loserScore);
  return game.winner === id ? margin : -margin;
};

// A game as the domain says it, which `matchesBetween` cuts matches from. Only
// who played it, and whether nobody won, are what it is cut by.
const domainGameOf = (kept: GameKept): Game =>
  Game.from(
    GameId.from(kept.id),
    {
      winner: gamePlayerIdFrom(kept.winner),
      winnerScore: Score.kept("1", false),
      loser: gamePlayerIdFrom(kept.loser),
      loserScore: Score.kept(kept.drawn ? "1" : "0", false),
    },
    { drawsAllowed: true },
  );

// The matches among `games` that somebody won, each with its winner and its
// loser. Each pair's games, in the order they were added, are cut into matches
// as the competition cuts them, so that two players of a block played in
// rounds, or the best of 1, play a match in each. A match is won by whoever
// wins more than half the games it is the best of: so a match not yet decided,
// or shared in a best of an even number, is won by neither.
const decidedMatchesOf = (
  games: readonly GameKept[],
  bestOf: number,
): DecidedMatch[] => {
  const byPair = new Map<string, Game[]>();
  for (const game of games) {
    const pair = [game.winner, game.loser].sort().join(" ");
    byPair.set(pair, [...(byPair.get(pair) ?? []), domainGameOf(game)]);
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

/**
 * The standings of a block whose `entries`, in its order, played `games`, in the
 * order they were added, as the best of `bestOf` with `tieBreak`. Withdrawn
 * players come last, with no place.
 */
export const standBlock = (
  entries: readonly EntryToStand[],
  games: readonly GameKept[],
  bestOf: number,
  tieBreak: TieBreak,
): StandingsToKeep => {
  const counting = gamesThatCount(games, entries);
  const matches = decidedMatchesOf(counting, bestOf);
  const totals = entries.map((entry) => {
    const carried = carriedBy(entry);
    const theirs = counting.filter(
      (game) => game.winner === entry.id || game.loser === entry.id,
    );
    const won = theirs.filter(
      (game) => !game.drawn && game.winner === entry.id,
    );
    const lost = theirs.filter(
      (game) => !game.drawn && game.loser === entry.id,
    );
    return {
      id: entry.id,
      withdrawn: entry.withdrawn,
      matchesWon:
        matches.filter((match) => match.winner === entry.id).length +
        carried("matchWins"),
      matchesLost:
        matches.filter((match) => match.loser === entry.id).length +
        carried("matchLosses"),
      gamesWon: won.length + carried("gameWins"),
      netGames:
        won.length - lost.length + carried("gameWins") - carried("gameLosses"),
      netHoops:
        theirs.reduce((net, game) => net + marginOf(game, entry.id), 0) +
        carried("hoopsFor") -
        carried("hoopsAgainst"),
    };
  });
  const placed = placePlayers(totals, matches, tieBreak, bestOf);
  const byId = new Map(totals.map((each) => [each.id, each]));
  return {
    levelOnMatchesWon: placed.levelOnMatchesWon,
    standings: placed.ranked.map((id, at): StandingKept => {
      const total = byId.get(id)!;
      const placing = placed.placings.get(id);
      return {
        entryId: id,
        rank: at + 1,
        played: total.matchesWon + total.matchesLost,
        won: total.matchesWon,
        lost: total.matchesLost,
        gamesWon: total.gamesWon,
        netGames: total.netGames,
        netHoops: total.netHoops,
        withdrawn: total.withdrawn,
        place: placing?.place,
        shared: placing?.shared ?? false,
      };
    }),
  };
};

/**
 * The standings of a Swiss whose `entries`, in its order, played `games`: the
 * greater share of the games each has won first, then the more net hoops, and
 * otherwise as they were. A player who has played no game has no share, and
 * comes after every player who has, since nothing yet says where they stand; a
 * player who has withdrawn comes after everybody who has not, with no place.
 * Nobody shares a place in a Swiss: the order is the places.
 */
export const standSwiss = (
  entries: readonly EntryToStand[],
  games: readonly GameKept[],
): StandingsToKeep => {
  const counting = gamesThatCount(games, entries);
  const totals = entries.map((entry) => {
    const carried = carriedBy(entry);
    const theirs = counting.filter(
      (game) => game.winner === entry.id || game.loser === entry.id,
    );
    return {
      id: entry.id,
      withdrawn: entry.withdrawn,
      gamesPlayed: theirs.length + carried("gameWins") + carried("gameLosses"),
      gamesWon:
        theirs.filter((game) => !game.drawn && game.winner === entry.id)
          .length + carried("gameWins"),
      netHoops:
        theirs.reduce((net, game) => net + marginOf(game, entry.id), 0) +
        carried("hoopsFor") -
        carried("hoopsAgainst"),
    };
  });
  const shareOf = (total: (typeof totals)[number]): number =>
    total.gamesWon / total.gamesPlayed;
  const playing = totals.filter(({ withdrawn }) => !withdrawn);
  const ranked = [
    ...playing
      .filter(({ gamesPlayed }) => gamesPlayed > 0)
      .sort(
        (one, other) =>
          shareOf(other) - shareOf(one) || other.netHoops - one.netHoops,
      ),
    ...playing.filter(({ gamesPlayed }) => gamesPlayed === 0),
    ...totals.filter(({ withdrawn }) => withdrawn),
  ];
  let place = 0;
  return {
    levelOnMatchesWon: false,
    standings: ranked.map((total, at): StandingKept => {
      if (!total.withdrawn) place += 1;
      return {
        entryId: total.id,
        rank: at + 1,
        played: total.gamesPlayed,
        won: total.gamesWon,
        lost: undefined,
        gamesWon: undefined,
        netGames: undefined,
        netHoops: total.netHoops,
        withdrawn: total.withdrawn,
        place: total.withdrawn ? undefined : place,
        shared: false,
      };
    }),
  };
};
