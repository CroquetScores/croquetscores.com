import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import {
  type FilterChosen,
  isChosen,
  type TournamentOfWebsite,
} from "./tournamentsOfWebsite.js";

/** Every reason asking for a year's tournaments can be refused where it is asked. */
export type TournamentsInYearRefusedCode =
  "TournamentsInYear.NotText" | "TournamentsInYear.YearNotWhole";

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
  }
}
