import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Confirming an account's email address, asked for with what the link the
 * account was emailed carries, and by nobody signed in: whoever has the link
 * has shown they can read mail at the address, which is the whole of what
 * confirming is to show.
 *
 * It carries no request id. A registration mints a new account each time it is
 * sent and needs one; this confirms an account already there, and the second
 * of two is refused by the account itself having nothing left to record.
 */
export class ConfirmEmailAddress extends Command<void> {
  constructor(
    readonly link: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
