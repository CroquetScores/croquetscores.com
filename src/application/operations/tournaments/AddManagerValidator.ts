import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { brokenBy } from "./tournamentOperations.js";
import { AddManager } from "./AddManager.js";

/**
 * What making somebody one must carry, asked on the way in: an email
 * address, taken as one is wherever one is typed.
 */
export class AddManagerValidator extends CommandValidator<AddManager> {
  readonly validates: RequestType<AddManager> = AddManager;

  validate(command: AddManager): readonly BrokenRule[] {
    return brokenBy("emailAddress", () =>
      EmailAddress.from(command.emailAddress),
    );
  }
}
