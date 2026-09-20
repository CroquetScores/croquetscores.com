import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason confirming can be refused where it is asked for. */
export type ConfirmEmailAddressRefusedCode = "ConfirmEmailAddress.NotText";

/**
 * Confirming an account's email address, asked for with what the link the
 * account was emailed carries, and by nobody signed in: whoever has the link
 * has shown they can read mail at the address, which is the whole of what
 * confirming is to show.
 *
 * It carries no request id. A registration mints a new account each time it is
 * sent and needs one; this confirms an account already there, and a link
 * followed a second time is refused as already confirmed rather than
 * confirming twice. Two followed at the same moment are another matter, and
 * TODO.md says what.
 *
 * The link is checked for being text at all, for the reason the command's
 * moment is checked for being one: it is made from what the edge read out of
 * the query, and a parameter the edge was to find and did not arrives as
 * nothing whatever the types say — while one given twice arrives as a list of
 * both, since there is no saying which was meant. Left to the reading of the
 * link, that nothing is asked to search itself for a query before any of this
 * is reached, and the site answers with its own code breaking rather than
 * with the link refused. Text that is no link of ours is text, and is the
 * reading's to refuse.
 *
 * Nobody signed in asks for it, so it names nobody.
 */
export class ConfirmEmailAddress extends Command<void> {
  constructor(
    readonly link: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    if (typeof link !== "string") {
      throw new ValidationError<ConfirmEmailAddressRefusedCode>(
        "ConfirmEmailAddress.NotText",
      );
    }
  }
}
