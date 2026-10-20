import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { RegisterAccount } from "./RegisterAccount.js";

/**
 * Registering's rules, which are the email address's own and nothing more:
 * an address is all that registering asks for.
 */
export class RegisterAccountValidator extends CommandValidator<RegisterAccount> {
  readonly validates: RequestType<RegisterAccount> = RegisterAccount;

  validate(command: RegisterAccount): readonly BrokenRule[] {
    return brokenBy("emailAddress", () =>
      EmailAddress.from(command.emailAddress),
    );
  }
}
