import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason signing in can be refused where it is made. */
export type SignInRefusedCode = "SignIn.NotText";

/**
 * Signing in: an email address and a password, by nobody signed in, answered
 * with the account signed in to.
 *
 * It is a command rather than a query because signing in is recorded on the
 * account, and because an account whose password is still the old site's has
 * its hash made again today's way the first time it signs in — the first
 * moment the password is to hand.
 *
 * It has no rules of its own, and no validator. A password too short for the
 * site's rules is still somebody's guess at somebody's password, and answering
 * "that is not long enough" rather than "that did not work" would say which
 * guesses are worth making. So everything that is not the right password is
 * refused the one way, by the handler.
 *
 * It carries no request id. Nothing it does is a thing that could happen twice
 * by being asked twice: signing in again records a second signing in, which is
 * what a second signing in is.
 */
export class SignIn extends Command<AccountId> {
  constructor(
    readonly emailAddress: string,
    readonly password: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    for (const given of [emailAddress, password]) {
      if (typeof given !== "string") {
        throw new ValidationError<SignInRefusedCode>("SignIn.NotText");
      }
    }
  }
}
