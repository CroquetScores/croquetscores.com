import { Refused } from "../../domain/common/Refused.js";

/** The two sports the world rankings keep a list of players for. */
export type WorldRankingSport = "ac" | "gc";

/** Every way reading a list can be refused. */
export type WorldRankingListsErrorCode =
  "WorldRankingLists.Unreachable" | "WorldRankingLists.Unreadable";

/**
 * A list that was not read. Named by a code, because the code is the
 * contract: the import says it to the administrator who asked, and leaves the
 * sport's players as they were whichever it is.
 */
export class ListRefused extends Refused<WorldRankingListsErrorCode> {}

/**
 * What the application wants of the place the world rankings keep the players
 * they know (WorldRankingWebsite.feature).
 *
 * A list is read whole or not at all: a list read in part would let go of
 * every player it did not reach.
 */
export interface WorldRankingLists {
  /**
   * The full name of every player on `sport`'s list, each name once. Throws
   * {@link ListRefused} where the list could not be asked for, or where any
   * of it could not be read.
   */
  playersOf(sport: WorldRankingSport): Promise<readonly string[]>;
}
