import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import {
  type FilterChosen,
  isChosen,
  type TournamentOfWebsite,
} from "./tournamentsOfWebsite.js";

/** Every reason asking for a page of tournaments can be refused where it is asked. */
export type TournamentsInDaysRefusedCode =
  | "TournamentsInDays.NotText"
  | "TournamentsInDays.NoSuchPage"
  | "TournamentsInDays.NoSuchSorting"
  | "TournamentsInDays.NoSuchLanguage";

/** What the list can be sorted by, and which way. */
export interface TournamentsSorting {
  readonly column: "date" | "name";
  readonly order: "up" | "down";
}

/** How many tournaments a page holds. */
export const TOURNAMENTS_TO_A_PAGE = 100;

/** One page of the tournaments in the days asked for. */
export interface TournamentsPage {
  readonly tournaments: readonly TournamentOfWebsite[];
  /** How many tournaments there are in all, over every page. */
  readonly total: number;
  /** The number of the last page, which is 1 where there are none. */
  readonly lastPage: number;
}

/**
 * Page `page` of the tournaments of the website being read starting from
 * `firstDay` to `lastDay`, or every one where neither is given, narrowed by
 * what the reader `chose`. One day alone is the filter's to refuse
 * (`TournamentFilter.feature`). For anybody, so it names nobody.
 */
export class TournamentsInDays extends Query<TournamentsPage> {
  constructor(
    readonly website: string,
    readonly firstDay: string | undefined,
    readonly lastDay: string | undefined,
    readonly page: number = 1,
    readonly chose: FilterChosen = {},
    readonly sorting?: TournamentsSorting,
    /** The language names are ordered in, as a language tag such as "sv". */
    readonly language: string = "en",
  ) {
    super();
    if (
      typeof website !== "string" ||
      (firstDay !== undefined && typeof firstDay !== "string") ||
      (lastDay !== undefined && typeof lastDay !== "string") ||
      !isChosen(chose)
    ) {
      throw new ValidationError<TournamentsInDaysRefusedCode>(
        "TournamentsInDays.NotText",
      );
    }
    if (
      sorting !== undefined &&
      (!["date", "name"].includes(sorting.column) ||
        !["up", "down"].includes(sorting.order))
    ) {
      throw new ValidationError<TournamentsInDaysRefusedCode>(
        "TournamentsInDays.NoSuchSorting",
      );
    }
    // Asked of the language itself, which throws on a tag that is not one,
    // rather than a pattern of ours that would have to know every tag.
    try {
      Intl.getCanonicalLocales(language);
    } catch {
      throw new ValidationError<TournamentsInDaysRefusedCode>(
        "TournamentsInDays.NoSuchLanguage",
      );
    }
    if (!Number.isSafeInteger(page) || page < 1) {
      throw new ValidationError<TournamentsInDaysRefusedCode>(
        "TournamentsInDays.NoSuchPage",
      );
    }
  }
}
