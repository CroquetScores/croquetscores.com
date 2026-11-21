import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../../domain/common/Website.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for the tournaments whose year changed can be refused where it is asked. */
export type TournamentsChangedYearRefusedCode =
  | "TournamentsChangedYear.NotText"
  | "TournamentsChangedYear.PageNotWhole"
  | "TournamentsChangedYear.PageOutOfRange"
  | "TournamentsChangedYear.PageSizeNotWhole"
  | "TournamentsChangedYear.PageSizeOutOfRange";

/** A tournament that has come into another year than the one it was in. */
export interface TournamentYearChanged {
  readonly tournamentId: string;
  /** The year it was in before it came into the one it is in now. */
  readonly previousYear: number;
  /** The year it is in now. */
  readonly newYear: number;
  /** When it came into the year it is in now. */
  readonly changedAt: ReadOnlyDate;
}

/**
 * The tournaments of a website as the read model keeps their years. None of
 * them archived, as an archived tournament is in no year's list.
 */
export interface TournamentYearChanges {
  /**
   * Those on `website` that have come into another year than the one they were
   * in, after `since` where that is given, the first to come into it first.
   */
  changedYear(
    website: Website,
    since: ReadOnlyDate | undefined,
  ): Promise<readonly TournamentYearChanged[]>;
}

/** One page of the tournaments whose year changed, and what an app needs to ask for the next. */
export interface TournamentsChangedYearPage {
  readonly tournaments: readonly TournamentYearChanged[];
  /** How many there are in all, on every page. */
  readonly total: number;
  readonly page: number;
  /** What the page was held to: no more than was asked for, and no more than the most a page holds. */
  readonly pageSize: number;
  /** The page after this one, or nothing where this is the last. */
  readonly next: number | undefined;
  /**
   * When the latest of all of them changed year, on every page, so that every
   * page says the same of whether the list has changed. Nothing where there
   * are none.
   */
  readonly changedAt: ReadOnlyDate | undefined;
}

/**
 * The tournaments of the website being read that have come into another year
 * than the one they were in, after `changedSince` where that is given, a page of `pageSize` at a time, for an
 * app. For anybody, so it names nobody. A size over the most a page holds is
 * answered as that size and not refused, as the list of a year's is.
 */
export class TournamentsChangedYear extends Query<TournamentsChangedYearPage> {
  constructor(
    readonly website: string,
    readonly changedSince: ReadOnlyDate | undefined,
    readonly page: number,
    readonly pageSize: number,
  ) {
    super();
    if (typeof website !== "string") {
      throw new ValidationError<TournamentsChangedYearRefusedCode>(
        "TournamentsChangedYear.NotText",
      );
    }
    if (!Number.isSafeInteger(page)) {
      throw new ValidationError<TournamentsChangedYearRefusedCode>(
        "TournamentsChangedYear.PageNotWhole",
      );
    }
    if (page < 1) {
      throw new ValidationError<TournamentsChangedYearRefusedCode>(
        "TournamentsChangedYear.PageOutOfRange",
      );
    }
    if (!Number.isSafeInteger(pageSize)) {
      throw new ValidationError<TournamentsChangedYearRefusedCode>(
        "TournamentsChangedYear.PageSizeNotWhole",
      );
    }
    if (pageSize < 1) {
      throw new ValidationError<TournamentsChangedYearRefusedCode>(
        "TournamentsChangedYear.PageSizeOutOfRange",
      );
    }
  }
}
