import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Query } from "../../common/Query.js";
import type { WorldRankingSport } from "../../services/WorldRankingLists.js";
import type { KeptWorldRankingPlayerGame } from "../../services/WorldRankingPlayers.js";

/** Every reason asking an app's list of a world ranking player's games can be refused where it is asked. */
export type WorldRankingPlayerGamesForAppsRefusedCode =
  | "WorldRankingPlayerGamesForApps.PageNotWhole"
  | "WorldRankingPlayerGamesForApps.PageOutOfRange"
  | "WorldRankingPlayerGamesForApps.PageSizeNotWhole"
  | "WorldRankingPlayerGamesForApps.PageSizeOutOfRange"
  | "WorldRankingPlayerGamesForApps.PlayerNotFound";

/** The most games an answer holds, whatever was asked for. */
export const mostGamesInAPage = 100;

/** One page of the games, and what an app needs to ask for the next. */
export interface WorldRankingPlayerGamesForAppsPage {
  readonly games: readonly KeptWorldRankingPlayerGame[];
  /** How many there are in all, on every page. */
  readonly total: number;
  readonly page: number;
  /** What the page was held to: no more than was asked for, and no more than `mostGamesInAPage`. */
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
 * The games of the world ranking player of `sport` the site gave `playerId`,
 * those that changed after `changedSince` where one is given, a page of
 * `pageSize` at a time, for an app. For anybody, so it names nobody.
 * A page size over `mostGamesInAPage` is answered as that size and not
 * refused, as the list of the players is.
 */
export class WorldRankingPlayerGamesForApps extends Query<WorldRankingPlayerGamesForAppsPage> {
  constructor(
    readonly sport: WorldRankingSport,
    readonly playerId: string,
    readonly changedSince: ReadOnlyDate | undefined,
    readonly page: number,
    readonly pageSize: number,
  ) {
    super();
    if (!Number.isSafeInteger(page)) {
      throw new ValidationError<WorldRankingPlayerGamesForAppsRefusedCode>(
        "WorldRankingPlayerGamesForApps.PageNotWhole",
      );
    }
    if (page < 1) {
      throw new ValidationError<WorldRankingPlayerGamesForAppsRefusedCode>(
        "WorldRankingPlayerGamesForApps.PageOutOfRange",
      );
    }
    if (!Number.isSafeInteger(pageSize)) {
      throw new ValidationError<WorldRankingPlayerGamesForAppsRefusedCode>(
        "WorldRankingPlayerGamesForApps.PageSizeNotWhole",
      );
    }
    if (pageSize < 1) {
      throw new ValidationError<WorldRankingPlayerGamesForAppsRefusedCode>(
        "WorldRankingPlayerGamesForApps.PageSizeOutOfRange",
      );
    }
  }
}
