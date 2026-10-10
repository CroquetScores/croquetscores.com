// What a block's or a test's matches are the best of, from what the old site
// kept (ImportBlocks.feature, ImportTeamMatches.feature). Written once, so
// that the two cannot come to read the old sites differently.
import { BestOf } from "../domain/aggregates/tournaments/value-objects/BestOf.js";
import type { Game } from "./ravendb-models/Competition.js";

/**
 * The best of `kept`, the old site's number, but the best of 1 where it kept
 * 0: no match can be the best of none, and a competition kept so played its
 * matches as single games.
 */
export const bestOfImported = (kept: number): BestOf =>
  BestOf.from(kept === 0 ? 1 : kept);

/**
 * The best of `kept`, the old site's number, but where it kept less than 1,
 * which no match can be the best of, the best of what `games` say: the most
 * games any two players played, made odd by one more where it is even, as a
 * knockout's rounds are worked out (ImportKnockouts.ts), or 1 where none
 * played more than one game or none played at all.
 */
export const bestOfWorkedOut = (
  kept: number,
  games: readonly Game[],
): BestOf => {
  if (kept >= 1) return BestOf.from(kept);
  const between = new Map<string, number>();
  for (const game of games) {
    const pair = [game.Winner.PlayerId, game.Loser.PlayerId]
      .sort((one, other) => one - other)
      .join(" ");
    between.set(pair, (between.get(pair) ?? 0) + 1);
  }
  const most = Math.max(1, ...between.values());
  return BestOf.from(most % 2 === 0 ? most + 1 : most);
};
