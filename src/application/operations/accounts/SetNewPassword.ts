import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason setting a password can be refused where it is made. */
export type SetNewPasswordRefusedCode =
  "SetNewPassword.RequestIdMissing" | "SetNewPassword.NotText";

/**
 * Setting a new password: what the link carries, and the password twice.
 *
 * Asked for by nobody signed in. Whoever has the link has shown they can read
 * mail at the address, and that is the whole of what they are asked to show.
 *
 * It answers with the account the password was set on, so that whoever asked
 * can end every session that account has: a reader may be setting a password
 * because somebody else got in.
 */
export class SetNewPassword extends Command<AccountId> {
  constructor(
    readonly requestId: string,
    readonly link: string,
    readonly password: string,
    readonly passwordConfirmation: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    if (typeof requestId !== "string" || requestId.trim() === "") {
      throw new ValidationError<SetNewPasswordRefusedCode>(
        "SetNewPassword.RequestIdMissing",
      );
    }
    for (const given of [link, password, passwordConfirmation]) {
      if (typeof given !== "string") {
        throw new ValidationError<SetNewPasswordRefusedCode>(
          "SetNewPassword.NotText",
        );
      }
    }
  }
}
