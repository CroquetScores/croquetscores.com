import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
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
    try {
      PersonName.from(command.name);
      return [];
    } catch (failure) {
      // Named as a validation error of some code: the class is generic, and
      // narrowing by instanceof alone leaves its code as anything at all.
      if (failure instanceof ValidationError) {
        const named = failure as ValidationError<string>;
        return [{ code: named.code, fields: ["name"] }];
      }
      throw failure;
    }
  }
}
