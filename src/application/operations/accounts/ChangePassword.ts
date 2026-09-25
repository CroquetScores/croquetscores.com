import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason a change of password can be refused where it is made. */
export type ChangePasswordRefusedCode = "ChangePassword.NotText";

/**
 * Changing a password with the one the account has now: the account the
 * reader is signed in to, the password it has now, the new one typed twice,
 * and the language to tell its address in.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nothing anybody asks with can change another account's password.
 */
export class ChangePassword extends Command<AccountId> {
  constructor(
    readonly account: string,
    readonly currentPassword: string,
    readonly password: string,
    readonly passwordConfirmation: string,
    readonly language: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    for (const given of [
      account,
      currentPassword,
      password,
      passwordConfirmation,
      language,
    ]) {
      if (typeof given !== "string") {
        throw new ValidationError<ChangePasswordRefusedCode>(
          "ChangePassword.NotText",
        );
      }
    }
  }

  /**
   * It runs its own, as setting a new password does, because its handler has
   * to ask Have I Been Pwned about the new password partway through, and a
   * transaction held open across that request holds a connection with it.
   */
  readonly runsItsOwnTransactions = true;
}
