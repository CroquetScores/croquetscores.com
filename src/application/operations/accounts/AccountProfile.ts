import { Query } from "../../common/Query.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason asking for a profile can be refused where it is asked. */
export type AccountProfileRefusedCode = "AccountProfile.NotText";

/**
 * What an account is called, the email address it is reached at, whether it
 * has a password — one made by signing in with Google has none, and nothing
 * that asks for the password it has now is offered to it — and whether it
 * holds the Administrator role, without which the administrator's pages are
 * not found.
 */
export interface Profile {
  readonly name: string;
  readonly emailAddress: string;
  readonly hasPassword: boolean;
  readonly isAdministrator: boolean;
}

/**
 * What the account the reader is signed in to is called, and where it is
 * reached: nothing, where there is nothing to show.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nothing anybody asks with can read another account's name or address.
 */
export class AccountProfile extends Query<Profile | undefined> {
  constructor(readonly account: string) {
    super();
    if (typeof account !== "string") {
      throw new ValidationError<AccountProfileRefusedCode>(
        "AccountProfile.NotText",
      );
    }
  }
}
