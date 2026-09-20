import type { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/**
 * A record of what the site has written to an account, kept so that the
 * account is not buried in email.
 *
 * It is not the queue. The queue forgets an email once it is sent, and this
 * has to remember it afterwards, because the limit is on what was sent rather
 * than on what is still waiting. Nor is it a read model: nothing an account
 * records says an email was written, and nothing should — an email written to
 * an address by somebody who is not its owner is not a fact about the person,
 * and the account's stream would grow with every stranger who typed it.
 *
 * Registering counts what it has written here, and so do signing in and the
 * new confirmation link page, because all of them fill the same inbox.
 */
export interface EmailsWritten {
  /** That `kind` was written to `account` at `at`. */
  record(account: AccountId, kind: string, at: ReadOnlyDate): Promise<void>;

  /** How many emails `account` has been written since `since`. */
  countSince(account: AccountId, since: ReadOnlyDate): Promise<number>;
}
