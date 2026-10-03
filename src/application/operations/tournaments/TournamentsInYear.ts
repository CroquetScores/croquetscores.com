import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import {
  type FilterChosen,
  isChosen,
  type TournamentOfWebsite,
} from "./tournamentsOfWebsite.js";

/** Every reason asking for a year's tournaments can be refused where it is asked. */
export type TournamentsInYearRefusedCode =
  | "TournamentsInYear.NotText"
  | "TournamentsInYear.YearNotWhole"
  | "TournamentsInYear.YearOutOfRange";

// The years a tournament's address holds, four digits with the first not a
// nought (TournamentAddress.ts), which are the only years a tournament can
// start in. Asked here as well as by the year's page, which takes no other
// from its address, since a year outside them is no day Postgres can ask for,
// and asking would fail rather than answer none.
const EARLIEST_YEAR = 1000;
const LATEST_YEAR = 9999;

/**
 * The tournaments of the website being read that start in `year`, narrowed by
 * what the reader `chose`. For anybody, so it names nobody.
 */
export class TournamentsInYear extends Query<readonly TournamentOfWebsite[]> {
  constructor(
    readonly website: string,
    readonly year: number,
    readonly chose: FilterChosen = {},
  ) {
    super();
    if (typeof website !== "string" || !isChosen(chose)) {
      throw new ValidationError<TournamentsInYearRefusedCode>(
        "TournamentsInYear.NotText",
      );
    }
    if (!Number.isSafeInteger(year)) {
      throw new ValidationError<TournamentsInYearRefusedCode>(
        "TournamentsInYear.YearNotWhole",
      );
    }
    if (year < EARLIEST_YEAR || year > LATEST_YEAR) {
      throw new ValidationError<TournamentsInYearRefusedCode>(
        "TournamentsInYear.YearOutOfRange",
      );
    }
  }
}
