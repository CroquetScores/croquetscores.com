import type { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/**
 * Whom an email was written to: an account, an email address that has none,
 * or the site's administrator about one of the services the site needs.
 *
 * All are counted, because all fill somebody's inbox. An address with no
 * account is named by the keyed hash the accounts read model finds an address
 * by, so that nothing here holds an address anybody could read. The
 * administrator is counted for each service on its own, so that being told
 * about one outage does not keep them from being told about another.
 */
export type WrittenTo =
  | { readonly account: AccountId }
  | { readonly emailAddressHash: string }
  | { readonly administratorAbout: string };

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
 * Registering counts what it has written here, and so do the new confirmation
 * link page and the page a reader asks for a way back in from, because all of
 * them fill the same inbox.
 */
export interface EmailsWritten {
  /** That `kind` was written to `whom` at `at`. */
  record(whom: WrittenTo, kind: string, at: ReadOnlyDate): Promise<void>;

  /**
   * How many emails `whom` has been written since `since`, counted with them
   * held: whoever else counts for the same one waits until the work this count
   * was made in is kept or given up.
   *
   * Counting and recording are two steps, and a limit is only kept if nothing
   * comes between them. Requests arriving at once would otherwise each count
   * before any had recorded, each find the account under its limit, and each
   * write to it. Held by the account and nothing wider, so that writing to one
   * account never waits on another.
   */
  countSince(whom: WrittenTo, since: ReadOnlyDate): Promise<number>;
}
