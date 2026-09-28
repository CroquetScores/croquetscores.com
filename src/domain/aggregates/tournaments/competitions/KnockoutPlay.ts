import type { KnockoutDraw } from "../value-objects/KnockoutDraw.js";
import type { CompetitionPlayer } from "./CompetitionPlayer.js";
import type { Game } from "./Game.js";
import type { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";

// How a knockout has been played so far, worked out afresh from its draw, its
// players in the competition's order and the games that count, rather than
// kept, so that archiving or restoring a game is only ever the game changing.

/**
 * One side of a match: a player; nobody, where a place is empty or nobody
 * came through to it; or somebody not yet known, where the match before it is
 * not yet decided.
 */
export type Side =
  | { readonly is: "player"; readonly player: CompetitionPlayer }
  | { readonly is: "nobody" }
  | { readonly is: "not yet known" };

/** A match in one round of a knockout. */
export interface Match {
  /** The round it is in, the first being 0. */
  readonly round: number;
  readonly sides: readonly [Side, Side];
  /** The games that count between its two players, in the order added. */
  readonly games: readonly Game[];
  /** Whoever goes through: a player, nobody, or not yet known. */
  readonly winner: Side;
  /** Whether a player won it by playing, rather than by a bye or a walkover. */
  readonly wonByPlaying: boolean;
}

const nobody: Side = { is: "nobody" };
const notYetKnown: Side = { is: "not yet known" };

const between = (
  game: Game,
  one: CompetitionPlayerId,
  other: CompetitionPlayerId,
): boolean =>
  (game.winner.equals(one) && game.loser.equals(other)) ||
  (game.winner.equals(other) && game.loser.equals(one));

const decided = (
  round: number,
  sides: readonly [Side, Side],
  games: readonly Game[],
  bestOf: number,
): Match => {
  const [one, other] = sides;
  const match = (winner: Side, wonByPlaying: boolean, played: Game[] = []) => ({
    round,
    sides,
    games: played,
    winner,
    wonByPlaying,
  });
  if (one.is === "not yet known" || other.is === "not yet known") {
    return match(notYetKnown, false);
  }
  // A place with nobody in it is a bye, and two are nobody going through.
  if (one.is === "nobody") return match(other, false);
  if (other.is === "nobody") return match(one, false);

  const played = games.filter((game) =>
    between(game, one.player.id, other.player.id),
  );
  // More than half of the round's best-of wins the match.
  const needed = Math.floor(bestOf / 2) + 1;
  for (const side of [one, other]) {
    const won = played.filter((game) =>
      game.winner.equals(side.player.id),
    ).length;
    if (won >= needed) return match(side, true, played);
  }
  // A withdrawn player loses every match of theirs not already decided.
  if (one.player.withdrawn && other.player.withdrawn) {
    return match(nobody, false, played);
  }
  if (one.player.withdrawn) return match(other, false, played);
  if (other.player.withdrawn) return match(one, false, played);
  return match(notYetKnown, false, played);
};

/**
 * Every match of a knockout with `draw`, round by round, given its `players`
 * in the competition's order, withdrawn ones among them, and the `games` that
 * count. The players fill the draw's places in order, the first meeting the
 * second, the third the fourth, and the winners of two matches drawn next to
 * each other meet in the next round.
 */
export const knockoutPlay = (
  draw: KnockoutDraw,
  players: readonly CompetitionPlayer[],
  games: readonly Game[],
): readonly Match[] => {
  let entrants: Side[] = Array.from({ length: draw.places }, (_, place) => {
    const player = players[place];
    return player === undefined ? nobody : { is: "player", player };
  });
  const matches: Match[] = [];
  draw.rounds.forEach((bestOf, round) => {
    const next: Side[] = [];
    for (let place = 0; place < entrants.length; place += 2) {
      const match = decided(
        round,
        [entrants[place] ?? nobody, entrants[place + 1] ?? nobody],
        games,
        bestOf.games,
      );
      matches.push(match);
      next.push(match.winner);
    }
    entrants = next;
  });
  return matches;
};

/** Whether `side` is the player `id`. */
export const isPlayer = (side: Side, id: CompetitionPlayerId): boolean =>
  side.is === "player" && side.player.id.equals(id);
