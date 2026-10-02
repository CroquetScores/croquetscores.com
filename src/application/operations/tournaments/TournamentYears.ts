import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for a website's years can be refused where it is asked. */
export type TournamentYearsRefusedCode = "TournamentYears.NotText";

/**
 * The years the website being read has a tournament starting in, the newest
 * first, each once. For anybody, so it names nobody.
 */
export class TournamentYears extends Query<readonly number[]> {
  constructor(readonly website: string) {
    super();
    if (typeof website !== "string") {
      throw new ValidationError<TournamentYearsRefusedCode>(
        "TournamentYears.NotText",
      );
    }
  }
}
