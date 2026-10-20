import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason a registration can be refused where it is made. */
export type RegisterAccountRefusedCode = "RegisterAccount.RequestIdMissing";

/**
 * Asking for an account: an email address, and the language to write to it in.
 *
 * No name and no password, on purpose. Whoever registers has not yet shown the
 * address is theirs, and whatever they typed would be kept for whoever does
 * turn out to own it, so both are asked for with confirming, of whoever has
 * the link.
 *
 * It carries a request id, which is whoever asked's to keep across a retry. An
 * answer lost on its way back leaves nobody able to say whether the account
 * was made, and the same id sent again says "this is that request, not another
 * one". Registering needs it because it mints a new account id each time it is
 * sent, so the event store cannot catch the retry the way it catches a second
 * change to something already there.
 *
 * A registration made with no request id is refused here, as a command made
 * without saying when is: sent twice it would register twice, and the first
 * sent with none would be remembered under that nothing, so that every one
 * after it carrying none was answered as already done. By the time a
 * registration exists the edge has an id for it, and one without is a mistake
 * in the code making it.
 *
 * Nobody signed in asks for it, so it names nobody.
 */
export class RegisterAccount extends Command<void> {
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
    if (requestId.trim() === "") {
      throw new ValidationError<RegisterAccountRefusedCode>(
        "RegisterAccount.RequestIdMissing",
      );
    }
  }
}
