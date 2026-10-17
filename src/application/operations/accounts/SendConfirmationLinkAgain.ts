import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason asking can be refused where it is made. */
export type SendConfirmationLinkAgainRefusedCode =
  | "SendConfirmationLinkAgain.RequestIdMissing"
  | "SendConfirmationLinkAgain.NotText";

/**
 * Asking for the link that confirms an account's email address to be sent
 * again: which account, and the language to write to it in.
 *
 * It names the account rather than an address, and the link goes to the
 * address the account holds, so that nothing anybody asks with can send the
 * link anywhere else. Whoever may ask is the web layer's to see to: they hold
 * a link the site made for that account, which is what says the account is
 * theirs to ask about.
 *
 * It carries a request id, as registering does, so that an asking sent twice
 * because its answer was lost sends one email rather than two.
 */
export class SendConfirmationLinkAgain extends Command<void> {
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
      throw new ValidationError<SendConfirmationLinkAgainRefusedCode>(
        "SendConfirmationLinkAgain.RequestIdMissing",
      );
    }
    for (const given of [account, language]) {
      if (typeof given !== "string") {
        throw new ValidationError<SendConfirmationLinkAgainRefusedCode>(
          "SendConfirmationLinkAgain.NotText",
        );
      }
    }
  }
}
