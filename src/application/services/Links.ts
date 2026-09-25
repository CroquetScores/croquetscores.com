import type { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/**
 * What a link is for.
 *
 * It is signed with the rest of what the link carries, so that a link the site
 * made for one thing is never taken for another: a link to set a new password
 * is not a link to confirm an address, however it is sent.
 */
export type LinkPurpose =
  | "confirm-email-address"
  | "set-new-password"
  | "confirm-forgetting"
  | "change-email-address";

/** What a link carries, once it is known to have been made here unaltered. */
export interface LinkCarried {
  readonly purpose: LinkPurpose;
  readonly account: AccountId;
  readonly worksUntil: ReadOnlyDate;
  /**
   * Which of the account's askings the link answers, where there can be more
   * than one: moving to another address, say, where each asking is to an
   * address of its own. Signed with the rest, so that a link cannot be made to
   * answer an asking it was not sent for.
   */
  readonly reference?: string;
}

/**
 * What the application wants of the links it emails.
 *
 * A link carries what it is for, which account, and when it stops working, all
 * signed. Signing rather than keeping a table of links sent means there is
 * nothing to look up when one is followed, nothing to clear out once they have
 * expired, and every link sent for an account works until it expires or is
 * used up, whichever email it came in.
 */
export interface Links {
  /**
   * The address to email for `purpose` and `account`, working until `until`.
   * The whole address, since it is what a reader follows, and the site's own
   * host is not something the application knows.
   */
  make(
    purpose: LinkPurpose,
    account: AccountId,
    until: ReadOnlyDate,
    reference?: string,
  ): string;

  /**
   * What `link` carries, or nothing when it was not made here — altered, made
   * up, or signed with another key. Nothing is said about whether it has
   * expired: that is a moment to compare against the one the request was asked
   * for, and reading a link never looks at a clock.
   */
  read(link: string): LinkCarried | undefined;
}
