// The games of a competition as an app is told of them, worked out of what the
// read models keep of them (`competitionGames.ts`): who won and lost each, as
// the tournament knows them, whether it counts for nothing, a knockout's round,
// and a test's matches. Worked out when they are asked for, since a game's round
// depends on the games played before it.
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { GameKept, GamesKept, WhoPlayed } from "./competitionGames.js";
import { matchesOfKept } from "./knockoutPlayOfKept.js";
import type {
  GameForApps,
  GamesOfCompetition,
  MatchForApps,
} from "./GamesForApps.js";

// The round each game that counts was played in, the first being 1, as a
// knockout's draw says it.
const roundsOf = (kept: GamesKept): ReadonlyMap<string, number> => {
  const rounds = new Map<string, number>();
  for (const match of matchesOfKept(kept)) {
    for (const game of match.games) rounds.set(game.id.value, match.round + 1);
  }
  return rounds;
};

/**
 * The games of a competition of the kind `kind`, which last changed at
 * `changedAt`: a game that has no change held is as changed as the competition,
 * which is never earlier than it truly was.
 */
export const gamesToTell = (
  kind: "block" | "swiss" | "knockout" | "test",
  kept: GamesKept,
  changedAt: ReadOnlyDate,
): GamesOfCompetition => {
  // A gap is never told as if it were a player: it means the read models are
  // not whole, as when they have not been made again after a migration.
  const whoIs = (id: string): WhoPlayed => {
    const who = kept.who.get(id);
    if (who === undefined) {
      throw new Error(
        `A game of the competition names a player it lacks: ${id}`,
      );
    }
    return who;
  };
  const withdrawnPlayers = new Set(
    kept.entries.filter((each) => each.withdrawn).map((each) => each.id),
  );
  const rounds =
    kind === "knockout" ? roundsOf(kept) : new Map<string, number>();
  const told = (game: GameKept): GameForApps => ({
    id: game.id,
    winner: {
      playerId: whoIs(game.winner).playerId,
      name: whoIs(game.winner).name,
      score: game.winnerScore,
    },
    loser: {
      playerId: whoIs(game.loser).playerId,
      name: whoIs(game.loser).name,
      score: game.loserScore,
    },
    drawn: game.drawn,
    // What counts for nothing is still told, and told as withdrawn: a game
    // withdrawn itself, and in a block or a Swiss a withdrawn player's. A
    // knockout's and a test's cannot be withdrawn.
    withdrawn:
      (kind === "block" || kind === "swiss") &&
      (game.withdrawn ||
        withdrawnPlayers.has(game.winner) ||
        withdrawnPlayers.has(game.loser)),
    round: rounds.get(game.id),
    changedAt: game.changedAt ?? changedAt,
  });
  const inUse = kept.games.filter((game) => !game.archived);

  if (kind !== "test") return { games: inUse.map(told) };

  // The matches of a test, in the order the first game of each was added, each
  // between the two players who play it, the first team's on the first side.
  const matches = new Map<
    string,
    { players: [WhoPlayed, WhoPlayed]; games: GameForApps[] }
  >();
  for (const game of inUse) {
    const one = whoIs(game.winner);
    const other = whoIs(game.loser);
    const players: [WhoPlayed, WhoPlayed] =
      one.team === kept.firstTeam ? [one, other] : [other, one];
    const key = `${players[0].playerId} ${players[1].playerId}`;
    const match = matches.get(key) ?? { players, games: [] };
    match.games.push(told(game));
    matches.set(key, match);
  }
  return {
    matches: [...matches.values()].map((match): MatchForApps => ({
      players: [
        { playerId: match.players[0].playerId, name: match.players[0].name },
        { playerId: match.players[1].playerId, name: match.players[1].name },
      ],
      games: match.games,
    })),
  };
};
