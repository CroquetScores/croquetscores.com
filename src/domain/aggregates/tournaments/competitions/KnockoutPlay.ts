import type { KnockoutDraw } from "../value-objects/KnockoutDraw.js";
import type { CompetitionPlayer } from "./CompetitionPlayer.js";
import type { Game } from "./Game.js";
import type { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";

// How a knockout has been played so far, worked out afresh from its draw, its
// players in the competition's order, the order its players withdrew in and
// the games that count, rather than kept, so that archiving or restoring a
// game is only ever the game changing.

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
  playedOn: (id: CompetitionPlayerId) => boolean,
  withdrewAt: (id: CompetitionPlayerId) => number,
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
  // A place with nobody in it is a bye, and two are nobody going through. A
  // withdrawn player loses a bye they had not used when they withdrew, and
  // goes through one they had, so that the games they played after it count.
  const byeTo = (side: Side): Side =>
    side.is === "player" && side.player.withdrawn && !playedOn(side.player.id)
      ? nobody
      : side;
  if (one.is === "nobody") return match(byeTo(other), false);
  if (other.is === "nobody") return match(byeTo(one), false);

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
  // A withdrawn player loses every match of theirs not already decided. Of
  // two, the one who withdrew first lost it then, so the other had won it by
  // the time they withdrew too.
  if (one.player.withdrawn && other.player.withdrawn) {
    const later =
      withdrewAt(one.player.id) > withdrewAt(other.player.id) ? one : other;
    return match(later, false, played);
  }
  if (one.player.withdrawn) return match(other, false, played);
  if (other.player.withdrawn) return match(one, false, played);
  return match(notYetKnown, false, played);
};

/**
 * Every match of a knockout with `draw`, round by round, given its `players`
 * in the competition's order, withdrawn ones among them, those withdrawn as
 * `withdrawals` in the order they withdrew, and the `games` that count. The players fill the draw's places in order, the first meeting the
 * second, the third the fourth, and the winners of two matches drawn next to
 * each other meet in the next round.
 */
export const knockoutPlay = (
  draw: KnockoutDraw,
  players: readonly CompetitionPlayer[],
  withdrawals: readonly CompetitionPlayerId[],
  games: readonly Game[],
): readonly Match[] => {
  let entrants: Side[] = Array.from({ length: draw.places }, (_, place) => {
    const player = players[place];
    return player === undefined ? nobody : { is: "player", player };
  });
  const matches: Match[] = [];
  // A game of a player's not counted in a match so far is of a later round,
  // since the rounds are worked out in order and a player is in one match of
  // each.
  const playedOn = (id: CompetitionPlayerId): boolean =>
    games.some(
      (game) =>
        (game.winner.equals(id) || game.loser.equals(id)) &&
        !matches.some((match) => match.games.includes(game)),
    );
  const withdrewAt = (id: CompetitionPlayerId): number =>
    withdrawals.findIndex((withdrawn) => withdrawn.equals(id));
  draw.rounds.forEach((bestOf, round) => {
    const next: Side[] = [];
    for (let place = 0; place < entrants.length; place += 2) {
      const match = decided(
        round,
        [entrants[place] ?? nobody, entrants[place + 1] ?? nobody],
        games,
        bestOf.games,
        playedOn,
        withdrewAt,
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

/**
 * Who the player `id` is drawn to play now, in `play`: the other player of
 * their match not yet decided. Nobody where they are waiting on a bye or on a
 * match still to be decided, or are out.
 */
export const drawnAgainst = (
  play: readonly Match[],
  id: CompetitionPlayerId,
): CompetitionPlayer | undefined => {
  const theirs = play.find(
    (match) =>
      match.winner.is === "not yet known" &&
      match.sides.some((side) => isPlayer(side, id)),
  );
  const other = theirs?.sides.find((side) => !isPlayer(side, id));
  return other?.is === "player" ? other.player : undefined;
};
