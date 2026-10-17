import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason an asking can be refused where it is made. */
export type AskToSetPasswordRefusedCode =
  "AskToSetPassword.RequestIdMissing" | "AskToSetPassword.NotText";

/**
 * Asking for a link to set a password on an account that has none: the
 * account the reader is signed in to, and the language to write to it in.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nothing anybody asks with can have another account's owner sent the link.
 * The link goes to the account's own address, and setting the password with it
 * is setting a new password (`SetNewPassword`).
 *
 * It carries a request id, as asking for a way back in does, so that an
 * asking sent twice because its answer was lost sends one email rather than
 * two.
 */
export class AskToSetPassword extends Command<void> {
  constructor(
    readonly requestId: string,
    readonly account: string,
    readonly language: string,
    // The host of the website the request was for, which an email written
    // about it is addressed from.
    readonly website: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    if (typeof requestId !== "string" || requestId.trim() === "") {
      throw new ValidationError<AskToSetPasswordRefusedCode>(
        "AskToSetPassword.RequestIdMissing",
      );
    }
    for (const given of [account, language]) {
      if (typeof given !== "string") {
        throw new ValidationError<AskToSetPasswordRefusedCode>(
          "AskToSetPassword.NotText",
        );
      }
    }
  }
}
