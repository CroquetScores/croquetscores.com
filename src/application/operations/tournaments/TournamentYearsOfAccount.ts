import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for an account's years can be refused where it is asked. */
export type TournamentYearsOfAccountRefusedCode =
  "TournamentYearsOfAccount.NotText";

/**
 * The years the account the reader is signed in to has a tournament starting
 * in on the website being read, the newest first. It names that account and
 * never one the reader chose, as listing the tournaments does.
 */
export class TournamentYearsOfAccount extends Query<readonly number[]> {
  constructor(
    readonly account: string,
    readonly website: string,
  ) {
    super();
    if (typeof account !== "string" || typeof website !== "string") {
      throw new ValidationError<TournamentYearsOfAccountRefusedCode>(
        "TournamentYearsOfAccount.NotText",
      );
    }
  }
}
