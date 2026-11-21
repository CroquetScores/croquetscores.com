import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../../domain/common/Website.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for the tournaments whose year changed can be refused where it is asked. */
export type TournamentsArchivedRefusedCode =
  | "TournamentsArchived.NotText"
  | "TournamentsArchived.PageNotWhole"
  | "TournamentsArchived.PageOutOfRange"
  | "TournamentsArchived.PageSizeNotWhole"
  | "TournamentsArchived.PageSizeOutOfRange";

/** A tournament that has been archived, and when. */
export interface TournamentArchived {
  readonly tournamentId: string;
  /** When it was archived, the last time it was. */
  readonly archivedAt: ReadOnlyDate;
}

/** The tournaments of a website that are archived, as the read model keeps them. */
export interface ArchivedTournaments {
  /**
   * Those on `website` that are archived, after `since` where that is given,
   * the first archived first.
   */
  archivedSince(
    website: Website,
    since: ReadOnlyDate | undefined,
  ): Promise<readonly TournamentArchived[]>;
}

/** One page of the tournaments whose year changed, and what an app needs to ask for the next. */
export interface TournamentsArchivedPage {
  readonly tournaments: readonly TournamentArchived[];
  /** How many there are in all, on every page. */
  readonly total: number;
  readonly page: number;
  /** What the page was held to: no more than was asked for, and no more than the most a page holds. */
  readonly pageSize: number;
  /** The page after this one, or nothing where this is the last. */
  readonly next: number | undefined;
  /**
   * When the latest of all of them was archived, on every page, so that every
   * page says the same of whether the list has changed. Nothing where there
   * are none.
   */
  readonly changedAt: ReadOnlyDate | undefined;
}

/**
 * The tournaments of the website being read that are archived, and were
 * archived after `archivedSince` where that is given, a page of `pageSize` at a
 * time, for an app. For anybody, so it names nobody. A size over the most a
 * page holds is answered as that size and not refused, as the list of a year's
 * is.
 */
export class TournamentsArchived extends Query<TournamentsArchivedPage> {
  constructor(
    readonly website: string,
    readonly archivedSince: ReadOnlyDate | undefined,
    readonly page: number,
    readonly pageSize: number,
  ) {
    super();
    if (typeof website !== "string") {
      throw new ValidationError<TournamentsArchivedRefusedCode>(
        "TournamentsArchived.NotText",
      );
    }
    if (!Number.isSafeInteger(page)) {
      throw new ValidationError<TournamentsArchivedRefusedCode>(
        "TournamentsArchived.PageNotWhole",
      );
    }
    if (page < 1) {
      throw new ValidationError<TournamentsArchivedRefusedCode>(
        "TournamentsArchived.PageOutOfRange",
      );
    }
    if (!Number.isSafeInteger(pageSize)) {
      throw new ValidationError<TournamentsArchivedRefusedCode>(
        "TournamentsArchived.PageSizeNotWhole",
      );
    }
    if (pageSize < 1) {
      throw new ValidationError<TournamentsArchivedRefusedCode>(
        "TournamentsArchived.PageSizeOutOfRange",
      );
    }
  }
}
