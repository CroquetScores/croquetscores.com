import { Refused } from "../../domain/common/Refused.js";

/**
 * The sports the world rankings keep a list of players for, association
 * croquet's first, which is the order they are imported in. Said once, here,
 * and everything that names one is typed by it.
 *
 * Not worked out from the domain's Sport.hasWorldRankings, which says which
 * sports have world rankings. This says which have a list the site can read:
 * a file on the rankings' site, a layout to read it by, and a table to keep it
 * in. The two are the same today. A sport given world rankings without a list
 * is refused here, rather than asked for a list nobody has written a way to
 * read.
 */
export const worldRankingSports = ["ac", "gc"] as const;

/** One of the sports the world rankings keep a list of players for. */
export type WorldRankingSport = (typeof worldRankingSports)[number];

/**
 * Each sport as what is written for whoever runs the site names it: a log,
 * or what the import says as it goes. Not a reader's words, which are the
 * catalogues'.
 */
export const worldRankingSportNames: Readonly<
  Record<WorldRankingSport, string>
> = { ac: "association croquet", gc: "golf croquet" };

/** Whether `code` is one of the sports with a list of players. */
export const isWorldRankingSport = (code: string): code is WorldRankingSport =>
  (worldRankingSports as readonly string[]).includes(code);

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
