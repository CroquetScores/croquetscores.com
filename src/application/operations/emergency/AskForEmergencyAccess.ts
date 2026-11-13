import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason asking can be refused where it is made. */
export type AskForEmergencyAccessRefusedCode =
  "Command.RequestedByMissing" | "AskForEmergencyAccess.NotText";

/**
 * Asking the people who hold the site's passwords to hand them over: what
 * somebody who has come to take the site over says of who they are and why.
 *
 * It names the account that asks, so that the people asked are told who is
 * asking, and nobody without one can send it. Not being signed in is refused
 * here with the code the command's own rules use for it, rather than left for
 * the handler to find an account missing: a command that cannot say who asked
 * is a mistake in what made it.
 */
export class AskForEmergencyAccess extends Command<void> {
  constructor(
    /** What was said, as it was typed. */
    readonly message: string,
    // The host of the website it was asked on, which says what the email
    // calls the site.
    readonly website: string,
    requestedAt: ReadOnlyDate,
    requestedBy: AccountId | undefined,
  ) {
    super(requestedAt, requestedBy);
    if (typeof message !== "string") {
      throw new ValidationError<AskForEmergencyAccessRefusedCode>(
        "AskForEmergencyAccess.NotText",
      );
    }
    if (requestedBy === undefined) {
      throw new ValidationError<AskForEmergencyAccessRefusedCode>(
        "Command.RequestedByMissing",
      );
    }
  }
}
