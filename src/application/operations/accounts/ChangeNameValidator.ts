import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { ChangeName } from "./ChangeName.js";

/**
 * What a change of name must carry, asked on the way in: a name the rules
 * confirming asks allow, since it is the same name. The name is asked about by
 * being made from what the command carries, which is the only way it offers,
 * and throws naming the first rule it breaks.
 */
export class ChangeNameValidator extends CommandValidator<ChangeName> {
  readonly validates: RequestType<ChangeName> = ChangeName;

  validate(command: ChangeName): readonly BrokenRule[] {
    return brokenBy("name", () => PersonName.from(command.name));
  }
}
