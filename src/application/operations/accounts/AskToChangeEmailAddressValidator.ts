import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
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
    return brokenBy("emailAddress", () =>
      EmailAddress.from(command.emailAddress),
    );
  }
}
