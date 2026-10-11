import type { Game } from "./Game.js";

/** One match between two players: the games it was played in, and whether it is decided. */
export interface MatchBetween {
  readonly games: readonly Game[];
  /**
   * Whether it is decided: it has all the games it is the best of, or one of
   * the two has won more than the other can catch up with in the games left.
   */
  readonly decided: boolean;
}

/**
 * The matches of the best of `bestOf` that `games` were played in, which are
 * the games between two players that count, in the order they were added. A
 * match is the games from the one that follows a decided match to the one
 * that decides it, so where two players meet in more than one match (a block
 * played in rounds), the last of them may not be decided, and the others are.
 *
 * Which of the two won a match, and so on, is for whatever asks.
 */
export const matchesBetween = (
  games: readonly Game[],
  bestOf: number,
): MatchBetween[] => {
  const matches: MatchBetween[] = [];
  let current: Game[] = [];
  for (const game of games) {
    current.push(game);
    if (isDecided(current, bestOf)) {
      matches.push({ games: current, decided: true });
      current = [];
    }
  }
  if (current.length > 0) matches.push({ games: current, decided: false });
  return matches;
};

const isDecided = (match: readonly Game[], bestOf: number): boolean => {
  const first = match[0];
  if (first === undefined) return false;
  // A drawn game is played, but won by neither.
  const won = (winner: Game["winner"]): number =>
    match.filter((each) => !each.drawn && each.winner.equals(winner)).length;
  const left = bestOf - match.length;
  const ahead = won(first.winner);
  const behind = won(first.loser);
  return left <= 0 || ahead > behind + left || behind > ahead + left;
};
