import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { brokenBy } from "../tournaments/tournamentOperations.js";
import { AddRole } from "./AddRole.js";

/**
 * What giving somebody a role must carry, asked on the way in: an email
 * address, taken as one is wherever one is typed.
 */
export class AddRoleValidator extends CommandValidator<AddRole> {
  readonly validates: RequestType<AddRole> = AddRole;

  validate(command: AddRole): readonly BrokenRule[] {
    return brokenBy("emailAddress", () =>
      EmailAddress.from(command.emailAddress),
    );
  }
}
