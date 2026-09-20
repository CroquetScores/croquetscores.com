import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { RegisterAccount } from "./RegisterAccount.js";

// The address is asked about what the command carries by being made from it,
// which is the only way it offers: it throws naming the first rule broken. So
// the command hears one rule for the field. A value object that ever wanted to
// report two faults in one field would have to offer its rules, and this would
// ask them.
const ruleBrokenBy = (
  make: () => unknown,
  field: string,
): BrokenRule | undefined => {
  try {
    make();
    return undefined;
  } catch (failure) {
    // Named as a validation error of some code: the class is generic, and
    // narrowing by instanceof alone leaves its code as anything at all.
    if (failure instanceof ValidationError) {
      const named = failure as ValidationError<string>;
      return { code: named.code, fields: [field] };
    }
    throw failure;
  }
};

/**
 * Registering's rules, which are the email address's own and nothing more:
 * an address is all that registering asks for.
 */
export class RegisterAccountValidator extends CommandValidator<RegisterAccount> {
  readonly validates: RequestType<RegisterAccount> = RegisterAccount;

  validate(command: RegisterAccount): readonly BrokenRule[] {
    const broken = ruleBrokenBy(
      () => EmailAddress.from(command.emailAddress),
      "emailAddress",
    );
    return broken === undefined ? [] : [broken];
  }
}
