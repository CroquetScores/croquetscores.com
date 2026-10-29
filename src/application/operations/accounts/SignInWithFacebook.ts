import { Command } from "../../common/Command.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Signing in with Facebook: what Facebook said about the reader, answered with
 * the account signed in to.
 *
 * What it carries has been had from Facebook by whatever took it there;
 * nothing here could tell. `emailAddress` is nothing where Facebook gave none,
 * which is refused only where the account is not yet linked and the address is
 * what it would be found or made by. Facebook does not say whether it has
 * verified the address, as Google does, so the command carries no word of it.
 *
 * It carries no request id, for the reason signing in with a password does
 * not: signing in again is a second signing in. Linking and making an account
 * are safe to ask twice, since the second finds the Facebook account linked.
 */
export class SignInWithFacebook extends Command<AccountId> {
  constructor(
    readonly facebookId: string,
    readonly emailAddress: string | undefined,
    readonly name: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
