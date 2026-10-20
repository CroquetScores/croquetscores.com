import type { BrokenRule } from "../../domain/common/validation/Validator.js";
import { ValidationError } from "../../domain/common/validation/ValidationError.js";

/**
 * The rule `making` breaks, as the field `field`, or nothing when it breaks
 * none. A value is asked about by being made, which is the only way each
 * offers, and throws naming the first rule it breaks. So a field is told one
 * rule at a time, and a reader is told what is wrong with each of the things
 * they typed at once, which is what a list of rules is for.
 *
 * A value object that ever wanted to report two faults in one field would have
 * to offer its rules, and this would ask them.
 */
export const brokenBy = (
  field: string,
  making: () => unknown,
): BrokenRule[] => {
  try {
    making();
    return [];
  } catch (failure) {
    // Named as a validation error of some code: the class is generic, and
    // narrowing by instanceof alone leaves its code as anything at all.
    if (failure instanceof ValidationError) {
      const named = failure as ValidationError<string>;
      return [{ code: named.code, fields: [field] }];
    }
    throw failure;
  }
};
