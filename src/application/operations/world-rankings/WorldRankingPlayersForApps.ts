import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Query } from "../../common/Query.js";
import type { KeptAssociationCroquetPlayer } from "../../services/WorldRankingPlayers.js";

/** Every reason asking an app's list of world ranking players can be refused where it is asked. */
export type WorldRankingPlayersForAppsRefusedCode =
  | "WorldRankingPlayersForApps.PageNotWhole"
  | "WorldRankingPlayersForApps.PageOutOfRange"
  | "WorldRankingPlayersForApps.PageSizeNotWhole"
  | "WorldRankingPlayersForApps.PageSizeOutOfRange";

/** The most players an answer holds, whatever was asked for. */
export const mostPlayersInAPage = 100;

/** One page of the players, and what an app needs to ask for the next. */
export interface WorldRankingPlayersForAppsPage {
  readonly players: readonly KeptAssociationCroquetPlayer[];
  /** How many there are in all, on every page. */
  readonly total: number;
  readonly page: number;
  /** What the page was held to: no more than was asked for, and no more than `mostPlayersInAPage`. */
  readonly pageSize: number;
  /** The page after this one, or nothing where this is the last. */
  readonly next: number | undefined;
  /**
   * When the latest of all of them last changed, on every page, so that every
   * page of a list says the same of whether the list has changed. Nothing
   * where there are none.
   */
  readonly changedAt: ReadOnlyDate | undefined;
}

/**
 * The association croquet world ranking players, archived ones too, in the
 * order of their names, those that changed after `changedSince` where one is
 * given, a page of `pageSize` at a time, for an app. For anybody, so it names
 * nobody. A page size over `mostPlayersInAPage` is answered as that size and
 * not refused, as an app's list of tournaments is.
 */
export class WorldRankingPlayersForApps extends Query<WorldRankingPlayersForAppsPage> {
  constructor(
    readonly changedSince: ReadOnlyDate | undefined,
    readonly page: number,
    readonly pageSize: number,
  ) {
    super();
    if (!Number.isSafeInteger(page)) {
      throw new ValidationError<WorldRankingPlayersForAppsRefusedCode>(
        "WorldRankingPlayersForApps.PageNotWhole",
      );
    }
    if (page < 1) {
      throw new ValidationError<WorldRankingPlayersForAppsRefusedCode>(
        "WorldRankingPlayersForApps.PageOutOfRange",
      );
    }
    if (!Number.isSafeInteger(pageSize)) {
      throw new ValidationError<WorldRankingPlayersForAppsRefusedCode>(
        "WorldRankingPlayersForApps.PageSizeNotWhole",
      );
    }
    if (pageSize < 1) {
      throw new ValidationError<WorldRankingPlayersForAppsRefusedCode>(
        "WorldRankingPlayersForApps.PageSizeOutOfRange",
      );
    }
  }
}
