import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { SetNewPassword } from "./SetNewPassword.js";

/**
 * What setting a new password must carry: a password that breaks none of its
 * own rules, typed the same twice.
 *
 * The same rules confirming asks, because it is the same password. Nothing
 * about the link is asked here: whether one works needs the account it names,
 * which a validator cannot read.
 */
export class SetNewPasswordValidator extends CommandValidator<SetNewPassword> {
  readonly validates: RequestType<SetNewPassword> = SetNewPassword;

  validate(command: SetNewPassword): readonly BrokenRule[] {
    const broken = brokenBy("password", () => Password.from(command.password));
    if (broken.length > 0) return broken;

    // Asked only once the password itself is sound: told both that it is too
    // short and that it was typed differently, a reader has two messages about
    // one piece of typing, and the second is not the one to act on.
    if (command.password.trim() !== command.passwordConfirmation.trim()) {
      broken.push({
        code: "Password.ConfirmationDiffers",
        fields: ["passwordConfirmation"],
      });
    }
    return broken;
  }
}
