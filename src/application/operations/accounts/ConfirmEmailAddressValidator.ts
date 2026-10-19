import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
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

/**
 * What a confirmation must carry, asked on the way in.
 *
 * Nothing about the link is asked here, and nothing about the account: whether
 * a link works needs the account it names, which a validator cannot read, so
 * that is the handler's. Neither is whether the password has been breached,
 * which is a request over the network and which a validator answers without
 * waiting: the handler asks it, once the link is known to be good and with no
 * transaction held open across it (`ConfirmEmailAddress.feature`).
 *
 * `Password.Breached` is named beside the rules this asks all the same,
 * because to whoever typed the password it is one more thing wrong with what
 * they typed, and it comes back the same way.
 */
export class ConfirmEmailAddressValidator extends CommandValidator<ConfirmEmailAddress> {
  readonly validates: RequestType<ConfirmEmailAddress> = ConfirmEmailAddress;

  validate(command: ConfirmEmailAddress): readonly BrokenRule[] {
    const password = brokenBy("password", () =>
      Password.from(command.password),
    );
    const broken = [
      ...brokenBy("name", () => PersonName.from(command.name)),
      ...password,
    ];

    // The confirmation is only asked about once the password itself is sound.
    // Told both that their password is too short and that they typed it
    // differently the second time, a reader has two messages about one piece
    // of typing, and the second is not the one to act on. Compared as the
    // password will be kept, which is trimmed: a confirmation differing only
    // by the spaces around it is the same password typed twice.
    if (
      password.length === 0 &&
      command.password.trim() !== command.passwordConfirmation.trim()
    ) {
      broken.push({
        code: "Password.ConfirmationDiffers",
        fields: ["passwordConfirmation"],
      });
    }

    return broken;
  }
}
