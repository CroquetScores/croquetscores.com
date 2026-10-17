import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason an asking can be refused where it is made. */
export type ResetPasswordRefusedCode =
  "ResetPassword.RequestIdMissing" | "ResetPassword.NotText";

/**
 * Asking for a way back in to an account: an email address, and the language
 * to write to it in.
 *
 * Asked for by nobody signed in, and answered with nothing: which addresses
 * have accounts must not be found out by asking, so what differs is only what
 * is sent to the address, which only its owner reads.
 *
 * It carries a request id, as registering does, so that an asking sent twice
 * because its answer was lost sends one email rather than two.
 */
export class ResetPassword extends Command<void> {
  constructor(
    readonly requestId: string,
    readonly emailAddress: string,
    readonly language: string,
    // The host of the website the request was for, which an email written
    // about it is addressed from.
    readonly website: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    if (typeof requestId !== "string" || requestId.trim() === "") {
      throw new ValidationError<ResetPasswordRefusedCode>(
        "ResetPassword.RequestIdMissing",
      );
    }
    for (const given of [emailAddress, language]) {
      if (typeof given !== "string") {
        throw new ValidationError<ResetPasswordRefusedCode>(
          "ResetPassword.NotText",
        );
      }
    }
  }
}
