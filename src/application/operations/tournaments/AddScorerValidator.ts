import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddScorer } from "./AddScorer.js";

/**
 * What making somebody one must carry, asked on the way in: an email
 * address, taken as one is wherever one is typed.
 */
export class AddScorerValidator extends CommandValidator<AddScorer> {
  readonly validates: RequestType<AddScorer> = AddScorer;

  validate(command: AddScorer): readonly BrokenRule[] {
    return brokenBy("emailAddress", () =>
      EmailAddress.from(command.emailAddress),
    );
  }
}
