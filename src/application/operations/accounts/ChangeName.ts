import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason a change of name can be refused where it is made. */
export type ChangeNameRefusedCode = "ChangeName.NotText";

/**
 * Changing what an account is called: the account the reader is signed in to,
 * and the name they typed.
 *
 * It names the account the reader is signed in to, never one they chose, so
 * nothing anybody asks with can rename another account.
 */
export class ChangeName extends Command<AccountId> {
  constructor(
    readonly account: string,
    readonly name: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    for (const given of [account, name]) {
      if (typeof given !== "string") {
        throw new ValidationError<ChangeNameRefusedCode>("ChangeName.NotText");
      }
    }
  }
}
