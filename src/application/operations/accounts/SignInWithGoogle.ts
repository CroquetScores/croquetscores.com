import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Signing in with Google: what Google said about the reader, answered with the
 * account signed in to.
 *
 * What it carries has been checked to be Google's by whatever took it from
 * Google; nothing here could tell. `name` is nothing where Google gave none,
 * which is refused only where a name is needed.
 *
 * It carries no request id, for the reason signing in with a password does
 * not: signing in again is a second signing in. Linking and making an account
 * are safe to ask twice, since the second finds the Google account linked.
 */
export class SignInWithGoogle extends Command<AccountId> {
  constructor(
    readonly subject: string,
    readonly emailAddress: string,
    readonly emailAddressVerified: boolean,
    readonly name: string | undefined,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
