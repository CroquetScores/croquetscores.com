import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason forgetting can be refused where it is made. */
export type ForgetAccountRefusedCode = "ForgetAccount.NotText";

/**
 * Forgetting an account: the link its owner was emailed, and the account the
 * reader following it is signed in to.
 *
 * The second of two askings, since forgetting cannot be undone. It answers
 * with the account forgotten, so that whoever asked can end every session it
 * has.
 */
export class ForgetAccount extends Command<AccountId> {
  constructor(
    readonly link: string,
    readonly reader: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    for (const given of [link, reader]) {
      if (typeof given !== "string") {
        throw new ValidationError<ForgetAccountRefusedCode>(
          "ForgetAccount.NotText",
        );
      }
    }
  }
}
