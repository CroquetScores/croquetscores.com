import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import {
  type FilterChosen,
  isChosen,
  type TournamentOfWebsite,
} from "./tournamentsOfWebsite.js";

/** Every reason asking for a page of tournaments can be refused where it is asked. */
export type TournamentsInDaysRefusedCode =
  "TournamentsInDays.NotText" | "TournamentsInDays.NoSuchPage";

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
 * `firstDay` to `lastDay`, narrowed by what the reader `chose`. For anybody,
 * so it names nobody.
 */
export class TournamentsInDays extends Query<TournamentsPage> {
  constructor(
    readonly website: string,
    readonly firstDay: string,
    readonly lastDay: string,
    readonly page: number = 1,
    readonly chose: FilterChosen = {},
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof firstDay !== "string" ||
      typeof lastDay !== "string" ||
      !isChosen(chose)
    ) {
      throw new ValidationError<TournamentsInDaysRefusedCode>(
        "TournamentsInDays.NotText",
      );
    }
    if (!Number.isSafeInteger(page) || page < 1) {
      throw new ValidationError<TournamentsInDaysRefusedCode>(
        "TournamentsInDays.NoSuchPage",
      );
    }
  }
}
