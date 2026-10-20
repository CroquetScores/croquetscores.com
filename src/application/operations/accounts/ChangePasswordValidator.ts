import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { ChangePassword } from "./ChangePassword.js";

/**
 * What a change of password must carry, asked on the way in: a new password
 * the rules setting one asks allow, since it is the same password, typed the
 * same twice.
 *
 * Nothing about the password the account has now is asked here: whether it is
 * the account's needs the account, which a validator cannot read, so that is
 * the handler's. Neither is whether the new one has been breached, which the
 * handler asks once the one the account has now has matched.
 */
export class ChangePasswordValidator extends CommandValidator<ChangePassword> {
  readonly validates: RequestType<ChangePassword> = ChangePassword;

  validate(command: ChangePassword): readonly BrokenRule[] {
    const password = brokenBy("password", () =>
      Password.from(command.password),
    );
    if (password.length > 0) return password;

    // Asked only once the password itself is sound, for the reason setting a
    // new password gives: two messages about one piece of typing, and the
    // second not the one to act on.
    if (command.password.trim() !== command.passwordConfirmation.trim()) {
      return [
        {
          code: "Password.ConfirmationDiffers",
          fields: ["passwordConfirmation"],
        },
      ];
    }
    return [];
  }
}
