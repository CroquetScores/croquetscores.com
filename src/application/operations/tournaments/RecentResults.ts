import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import {
  type FilterChosen,
  isChosen,
  type TournamentPlayed,
} from "./tournamentsOfWebsite.js";

/** Every reason asking for the recent results can be refused where it is asked. */
export type RecentResultsRefusedCode =
  "RecentResults.NotText" | "RecentResults.AtNotAMoment";

/**
 * The tournaments of the website being read that have had a game added in the
 * seven days before `at`, the moment the reader asked, narrowed by what the
 * reader `chose`. For anybody, so it names nobody.
 */
export class RecentResults extends Query<readonly TournamentPlayed[]> {
  constructor(
    readonly website: string,
    readonly at: ReadOnlyDate,
    readonly chose: FilterChosen = {},
  ) {
    super();
    if (typeof website !== "string" || !isChosen(chose)) {
      throw new ValidationError<RecentResultsRefusedCode>(
        "RecentResults.NotText",
      );
    }
    if (!(at instanceof ReadOnlyDate)) {
      throw new ValidationError<RecentResultsRefusedCode>(
        "RecentResults.AtNotAMoment",
      );
    }
  }
}
