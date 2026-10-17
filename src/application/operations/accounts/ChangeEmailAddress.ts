import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason a move can be refused where it is made. */
export type ChangeEmailAddressRefusedCode = "ChangeEmailAddress.NotText";

/**
 * Moving an account to the address its link was sent to: the link that was
 * followed, and the account the reader is signed in to, which has to be the
 * one the link was sent for.
 */
export class ChangeEmailAddress extends Command<AccountId> {
  constructor(
    readonly link: string,
    readonly reader: string,
    readonly language: string,
    // The host of the website the request was for, which an email written
    // about it is addressed from.
    readonly website: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    for (const given of [link, reader, language]) {
      if (typeof given !== "string") {
        throw new ValidationError<ChangeEmailAddressRefusedCode>(
          "ChangeEmailAddress.NotText",
        );
      }
    }
  }
}
