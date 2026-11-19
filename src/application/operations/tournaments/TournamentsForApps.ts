import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Query } from "../../common/Query.js";
import type { TournamentChanged } from "./tournamentsOfWebsite.js";

/** Every reason asking an app's list of tournaments can be refused where it is asked. */
export type TournamentsForAppsRefusedCode =
  | "TournamentsForApps.NotText"
  | "TournamentsForApps.YearNotWhole"
  | "TournamentsForApps.YearOutOfRange"
  | "TournamentsForApps.PageNotWhole"
  | "TournamentsForApps.PageOutOfRange"
  | "TournamentsForApps.PageSizeNotWhole"
  | "TournamentsForApps.PageSizeOutOfRange";

/** The most tournaments an answer holds, whatever was asked for. */
export const mostInAPage = 100;

// The years a tournament's address holds (TournamentsInYear.ts says why).
const EARLIEST_YEAR = 1000;
const LATEST_YEAR = 9999;

/** One page of a year's tournaments, and what an app needs to ask for the next. */
export interface TournamentsForAppsPage {
  readonly tournaments: readonly TournamentChanged[];
  /** How many there are in all, on every page. */
  readonly total: number;
  readonly page: number;
  /** What the page was held to: no more than was asked for, and no more than `mostInAPage`. */
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
 * The tournaments of the website being read that start in `year`, of `sport`
 * where one is given, and changed after `changedSince` where that is, a page
 * of `pageSize` at a time, for an app. For anybody, so it names nobody.
 *
 * A tournament has changed when anything was last kept of it, or of any of its
 * competitions. A page is held to `mostInAPage`, and a size over it is
 * answered as that size and not refused, so that an app that asks for more
 * than it may is still answered with what it may have.
 */
export class TournamentsForApps extends Query<TournamentsForAppsPage> {
  constructor(
    readonly website: string,
    readonly year: number,
    readonly sport: string | undefined,
    readonly changedSince: ReadOnlyDate | undefined,
    readonly page: number,
    readonly pageSize: number,
  ) {
    super();
    if (
      typeof website !== "string" ||
      (sport !== undefined && typeof sport !== "string")
    ) {
      throw new ValidationError<TournamentsForAppsRefusedCode>(
        "TournamentsForApps.NotText",
      );
    }
    if (!Number.isSafeInteger(year)) {
      throw new ValidationError<TournamentsForAppsRefusedCode>(
        "TournamentsForApps.YearNotWhole",
      );
    }
    if (year < EARLIEST_YEAR || year > LATEST_YEAR) {
      throw new ValidationError<TournamentsForAppsRefusedCode>(
        "TournamentsForApps.YearOutOfRange",
      );
    }
    if (!Number.isSafeInteger(page)) {
      throw new ValidationError<TournamentsForAppsRefusedCode>(
        "TournamentsForApps.PageNotWhole",
      );
    }
    if (page < 1) {
      throw new ValidationError<TournamentsForAppsRefusedCode>(
        "TournamentsForApps.PageOutOfRange",
      );
    }
    if (!Number.isSafeInteger(pageSize)) {
      throw new ValidationError<TournamentsForAppsRefusedCode>(
        "TournamentsForApps.PageSizeNotWhole",
      );
    }
    if (pageSize < 1) {
      throw new ValidationError<TournamentsForAppsRefusedCode>(
        "TournamentsForApps.PageSizeOutOfRange",
      );
    }
  }
}
