import type { Game } from "../../../domain/aggregates/tournaments/competitions/Game.js";

/** How a match between two players stands. */
export interface OutcomeOfMatch {
  /** Whether it is over: beyond the other's reach, or every game played. */
  readonly decided: boolean;
  /** Who won it where decided, and nothing where undecided or level. */
  readonly winner: string | undefined;
}

/**
 * How the match of the best of `bestOf` that `played` are the games of
 * stands between the players `one` and `other`. It is decided once one of
 * them is beyond the other's reach or every game of it has been played, as the
 * competition decides it before it refuses another game of it, and it is won
 * by whoever has won more of it. A drawn game is played but won by neither, so
 * a decided match can be level, and is shared.
 *
 * Said once for the page of a test and for the teams' standings, which both
 * hold that two players meet in one match, so that the two cannot come to
 * decide a match differently.
 */
export const outcomeOfMatch = (
  played: readonly Game[],
  one: string,
  other: string,
  bestOf: number,
): OutcomeOfMatch => {
  const won = (player: string): number =>
    played.filter((game) => !game.drawn && game.winner.value === player).length;
  const left = bestOf - played.length;
  const [oneWon, otherWon] = [won(one), won(other)];
  const decided = left <= 0 || Math.abs(oneWon - otherWon) > left;
  return {
    decided,
    winner:
      !decided || oneWon === otherWon
        ? undefined
        : oneWon > otherWon
          ? one
          : other,
  };
};
