import type { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/**
 * What the site wants of the place sessions are kept.
 *
 * A session is an id a browser holds and an account it belongs to. Whoever
 * keeps them keeps no id: an id is what a browser sends back, and a table of
 * them would be a table of ways in. What is kept is enough to recognise an id
 * that is sent back, and useless to anybody who takes it.
 *
 * Nothing here is a command of the application's, because a session is not
 * something an account records: it is how a browser is recognised between one
 * page and the next, and is the web layer's to hold. The interface lives here
 * because the web layer may not name what a database looks like.
 */
export interface Sessions {
  /** A new session for `account`, answered with the id its browser is to hold. */
  start(account: AccountId, at: ReadOnlyDate): Promise<string>;

  /**
   * The account `id` signs in to, or nothing when it names no session, or one
   * that has not been used for as long as a session lasts. Using a session
   * starts its life again, which is written at most once an hour, so that
   * reading a page does not become a write.
   */
  readerOf(id: string, at: ReadOnlyDate): Promise<AccountId | undefined>;

  /** Ends the session `id` names, if any. Ending one ends no other. */
  end(id: string): Promise<void>;

  /** Ends every session `account` has, on every browser it is signed in on. */
  endEveryOneFor(account: AccountId): Promise<void>;
}
