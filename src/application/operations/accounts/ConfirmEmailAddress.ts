import { Command } from "../../common/Command.js";
import { PasswordHash } from "../../common/SetsPassword.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason a confirmation can be refused where it is made. */
export type ConfirmEmailAddressRefusedCode =
  "ConfirmEmailAddress.RequestIdMissing" | "ConfirmEmailAddress.NotText";

/**
 * Confirming an account's email address: what the link carries, and the name
 * and password whoever reads mail at the address is giving it.
 *
 * Asked for by nobody signed in. Whoever has the link has shown they can read
 * mail at the address, and that is the whole of what they are asked to show.
 *
 * It carries a request id, as registering does, so that a confirmation sent
 * twice because its answer was lost confirms once and is answered as the first
 * was. That is not the same as a second submission with its own id, which
 * finds the address confirmed and is refused.
 *
 * Every field is required to be text where the command is made. A field the
 * edge was to read and did not find arrives as nothing whatever the types say,
 * and a link given twice arrives as both of them; left for the rules, that
 * nothing would be asked to trim itself and the site would answer with its own
 * code breaking rather than with the page that says the link no longer works.
 * A field left blank is text, and is the rules' to refuse.
 */
export class ConfirmEmailAddress extends Command<void> {
  constructor(
    readonly requestId: string,
    readonly link: string,
    readonly name: string,
    readonly password: string,
    readonly passwordConfirmation: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    if (typeof requestId !== "string" || requestId.trim() === "") {
      throw new ValidationError<ConfirmEmailAddressRefusedCode>(
        "ConfirmEmailAddress.RequestIdMissing",
      );
    }
    // An id that is not there and one that is blank are the same missing id,
    // so both are refused above. The rest say only that they are not text,
    // since what is wrong with each is the rules' to say once there is text.
    for (const given of [link, name, password, passwordConfirmation]) {
      if (typeof given !== "string") {
        throw new ValidationError<ConfirmEmailAddressRefusedCode>(
          "ConfirmEmailAddress.NotText",
        );
      }
    }
  }

  /**
   * Which of its fields holds the password it sets, so that the two behaviours
   * standing in front of the transaction — the one asking whether it has been
   * breached, and the one hashing it — know which field to read, and which to
   * name when the asking refuses it. Saying so is the command's because only
   * the command knows what it is doing with the password it carries.
   */
  get passwordField(): string {
    return "password";
  }

  /** Where the hash of that password is put, in front of the transaction. */
  readonly passwordHash = new PasswordHash();
}
