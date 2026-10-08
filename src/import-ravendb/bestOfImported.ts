// What a block's or a test's matches are the best of, from what the old site
// kept (ImportBlocks.feature, ImportTeamMatches.feature). Written once, so
// that the two cannot come to read the old sites differently.
import { BestOf } from "../domain/aggregates/tournaments/value-objects/BestOf.js";

/**
 * The best of `kept`, the old site's number, but the best of 1 where it kept
 * 0: no match can be the best of none, and a competition kept so played its
 * matches as single games.
 */
export const bestOfImported = (kept: number): BestOf =>
  BestOf.from(kept === 0 ? 1 : kept);
