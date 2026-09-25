import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { AskToChangeEmailAddress } from "./AskToChangeEmailAddress.js";

/**
 * What an asking to move must carry, asked on the way in: an address the rules
 * registering asks allow, since it is an address an account will be at.
 * Whether it is the account's own already needs the account, and is the
 * handler's.
 */
export class AskToChangeEmailAddressValidator extends CommandValidator<AskToChangeEmailAddress> {
  readonly validates: RequestType<AskToChangeEmailAddress> =
    AskToChangeEmailAddress;

  validate(command: AskToChangeEmailAddress): readonly BrokenRule[] {
    try {
      EmailAddress.from(command.emailAddress);
      return [];
    } catch (failure) {
      if (!(failure instanceof ValidationError)) throw failure;
      const named = failure as ValidationError<string>;
      return [{ code: named.code, fields: ["emailAddress"] }];
    }
  }
}
