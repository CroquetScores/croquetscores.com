import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { ResetPassword } from "./ResetPassword.js";

/**
 * What an asking must carry: an address that is one.
 *
 * Asking the address's rules says nothing about who has an account, since
 * every address ever typed is asked the same, and an address that is not one
 * cannot be emailed at all — so whoever typed it is owed the chance to fix it
 * rather than a page that says an email is on its way to nowhere.
 */
export class ResetPasswordValidator extends CommandValidator<ResetPassword> {
  readonly validates: RequestType<ResetPassword> = ResetPassword;

  validate(command: ResetPassword): readonly BrokenRule[] {
    return brokenBy("emailAddress", () =>
      EmailAddress.from(command.emailAddress),
    );
  }
}
