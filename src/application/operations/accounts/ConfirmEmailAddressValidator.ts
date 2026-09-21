import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { ConfirmEmailAddress } from "./ConfirmEmailAddress.js";

/**
 * Confirming's own rule, beyond the name's and the password's.
 *
 * `Password.ConfirmationDiffers` is spelled as the password's because that is
 * the field a reader is shown it under, though no password is made from a
 * confirmation and the rule is this command's: there is nothing smaller than
 * the command that can see both of them.
 */
export type ConfirmEmailAddressBrokenRule =
  "Password.ConfirmationDiffers" | "Password.Breached";

// Each value object is asked about what the command carries by being made from
// it, which is the only way it offers: it throws naming the first rule broken.
// So the command hears one rule per field, and a reader is told what is wrong
// with each of the things they typed at once, which is what the whole list is
// for.
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
 * What a confirmation must carry, asked on the way in.
 *
 * Nothing about the link is asked here, and nothing about the account. Whether
 * a link works needs the account it names, and whether a password has been
 * breached is a request over the network; a validator answers without waiting
 * and without reading anything, so both are the handler's.
 *
 * `Password.Breached` is named beside the rules this asks all the same,
 * because to whoever typed the password it is one more thing wrong with what
 * they typed, and it comes back the same way.
 */
export class ConfirmEmailAddressValidator extends CommandValidator<ConfirmEmailAddress> {
  readonly validates: RequestType<ConfirmEmailAddress> = ConfirmEmailAddress;

  validate(command: ConfirmEmailAddress): readonly BrokenRule[] {
    const broken: BrokenRule[] = [];
    const add = (rule: BrokenRule | undefined): void => {
      if (rule !== undefined) broken.push(rule);
    };

    add(ruleBrokenBy(() => PersonName.from(command.name), "name"));
    const password = ruleBrokenBy(
      () => Password.from(command.password),
      "password",
    );
    add(password);

    // The confirmation is only asked about once the password itself is sound.
    // Told both that their password is too short and that they typed it
    // differently the second time, a reader has two messages about one piece
    // of typing, and the second is not the one to act on. Compared as the
    // password will be kept, which is trimmed: a confirmation differing only
    // by the spaces around it is the same password typed twice.
    if (
      password === undefined &&
      command.password.trim() !== command.passwordConfirmation.trim()
    ) {
      add({
        code: "Password.ConfirmationDiffers",
        fields: ["passwordConfirmation"],
      });
    }

    return broken;
  }
}
