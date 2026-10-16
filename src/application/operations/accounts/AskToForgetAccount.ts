import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason an asking can be refused where it is made. */
export type AskToForgetAccountRefusedCode = "AskToForgetAccount.NotText";

/**
 * Asking for an account to be forgotten: the account the reader is signed in
 * to, and the language to write to it in.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nothing anybody asks with can have another account's owner sent the link.
 * The link goes to the account's own address, and confirming it is the second
 * asking (`ForgetAccount`).
 */
export class AskToForgetAccount extends Command<void> {
  constructor(
    readonly account: string,
    readonly language: string,
    // The host of the website the request was for, which an email written
    // about it is addressed from.
    readonly website: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    for (const given of [account, language]) {
      if (typeof given !== "string") {
        throw new ValidationError<AskToForgetAccountRefusedCode>(
          "AskToForgetAccount.NotText",
        );
      }
    }
  }
}
