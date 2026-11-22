import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import {
  type FilterChosen,
  isChosen,
  type TournamentOfWebsite,
} from "./tournamentsOfWebsite.js";

/** Every reason asking for the upcoming tournaments can be refused where it is asked. */
export type UpcomingTournamentsRefusedCode =
  "UpcomingTournaments.NotText" | "UpcomingTournaments.AtNotAMoment";

/**
 * The tournaments of the website being read that started in the two days before
 * the day of `at`, the moment the reader asked, and are still being played on
 * it, or start from it to sixty days after it, narrowed by what the reader
 * `chose`. For anybody, so it names nobody.
 */
export class UpcomingTournaments extends Query<readonly TournamentOfWebsite[]> {
  constructor(
    readonly website: string,
    readonly at: ReadOnlyDate,
    readonly chose: FilterChosen = {},
  ) {
    super();
    if (typeof website !== "string" || !isChosen(chose)) {
      throw new ValidationError<UpcomingTournamentsRefusedCode>(
        "UpcomingTournaments.NotText",
      );
    }
    if (!(at instanceof ReadOnlyDate)) {
      throw new ValidationError<UpcomingTournamentsRefusedCode>(
        "UpcomingTournaments.AtNotAMoment",
      );
    }
  }
}
