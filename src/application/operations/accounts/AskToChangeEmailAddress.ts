import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason an asking to move can be refused where it is made. */
export type AskToChangeEmailAddressRefusedCode =
  "AskToChangeEmailAddress.NotText";

/**
 * Asking to move an account to another email address: the account the reader
 * is signed in to, the address to move it to, the password it has now, and the
 * language to write to the new address in.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nothing anybody asks with can move another account.
 */
export class AskToChangeEmailAddress extends Command<void> {
  constructor(
    readonly account: string,
    readonly emailAddress: string,
    readonly password: string,
    readonly language: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    for (const given of [account, emailAddress, password, language]) {
      if (typeof given !== "string") {
        throw new ValidationError<AskToChangeEmailAddressRefusedCode>(
          "AskToChangeEmailAddress.NotText",
        );
      }
    }
  }
}
