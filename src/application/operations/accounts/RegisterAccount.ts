import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason a registration can be refused where it is made. */
export type RegisterAccountRefusedCode = "RegisterAccount.RequestIdMissing";

/**
 * Asking for an account: a name, an email address, a password typed twice, and
 * the language to write to the address in.
 *
 * It carries a request id, which is whoever asked's to keep across a retry. An
 * answer lost on its way back leaves nobody able to say whether the account
 * was made, and the same id sent again says "this is that request, not another
 * one". Registering needs it because it mints a new account id each time it is
 * sent, so the event store cannot catch the retry the way it catches a second
 * change to something already there (TODO.md says more).
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
    readonly name: string,
    readonly emailAddress: string,
    readonly password: string,
    readonly passwordConfirmation: string,
    readonly language: string,
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
