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

/** Whether `code` is one of the sports with a list of players. */
export const isWorldRankingSport = (code: string): code is WorldRankingSport =>
  (worldRankingSports as readonly string[]).includes(code);

/** Every way reading a list can be refused. */
export type WorldRankingListsErrorCode =
  | "WorldRankingLists.Unreachable"
  | "WorldRankingLists.Unreadable"
  | "WorldRankingLists.DuplicateNames"
  | "WorldRankingLists.DuplicateNumbers"
  | "WorldRankingLists.NameTaken";

/**
 * A list that was not read. Named by a code, because the code is the
 * contract: the import says it to the administrator who asked, and leaves the
 * sport's players as they were whichever it is.
 */
export class ListRefused extends Refused<WorldRankingListsErrorCode> {}

/** A full name the list gives to more than one player, and their numbers. */
export interface DuplicateName {
  readonly name: string;
  readonly worldRankingIds: readonly number[];
}

/**
 * A list that gives one full name to two players, kept
 * apart from {@link ListRefused} so that what is told to the administrator
 * can say which names and which numbers.
 */
export class DuplicateNamesRefused extends ListRefused {
  constructor(
    message: string,
    readonly duplicates: readonly DuplicateName[],
  ) {
    super("WorldRankingLists.DuplicateNames", message);
  }
}

/**
 * A list that gives a name to a player when the site keeps it for another
 * number, kept apart for the same reason as
 * {@link DuplicateNamesRefused}.
 */
export class NameTakenRefused extends ListRefused {
  constructor(
    message: string,
    readonly names: readonly string[],
  ) {
    super("WorldRankingLists.NameTaken", message);
  }
}

/**
 * A player as the rankings list them, in either sport's list: the number the
 * rankings keep them by, which does not change when their name does, and
 * their full name. A golf croquet player has the country they are from too,
 * since players of one name are told apart by it.
 */
export interface ListedPlayer {
  readonly worldRankingId: number;
  readonly name: string;
  readonly country?: string | undefined;
}

/**
 * What the application wants of the place the world rankings keep the players
 * they know (WorldRankingWebsite.feature).
 *
 * A list is read whole or not at all: a list read in part would archive or
 * let go of every player it did not reach.
 */
export interface WorldRankingLists {
  /**
   * Every player on association croquet's list, each world ranking number
   * once. Throws {@link ListRefused} where the list could not be asked for,
   * or where any of it could not be read.
   */
  associationCroquetPlayers(): Promise<readonly ListedPlayer[]>;

  /**
   * Every player on golf croquet's list, each with their country, each world
   * ranking number once and each full name and country once. Throws
   * {@link ListRefused} as above, and a list that gives one name and country
   * to two players is refused as association croquet's is.
   */
  golfCroquetPlayers(): Promise<readonly ListedPlayer[]>;
}
