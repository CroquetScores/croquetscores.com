// What the operations on accounts ask of where accounts are found by their
// email address, each as the one thing it is. An operation takes the ones it
// needs and no more, so that a fake of it, or the read model behind it, is
// asked for only what that operation uses. Written once, since the same
// question had been written out in six places and could have come to be
// answered differently in any of them.
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";

/** Finding the account at an address. */
export interface FindsAccountByAddress {
  /** The account at `address`, or nothing where no account is found there. */
  find(address: EmailAddress): Promise<AccountId | undefined>;
}

/** Holding an account, so that requests for it at once take turns. */
export interface HoldsAccount {
  /**
   * Holds `account` until the request is done, so that requests for it at
   * once take turns rather than each reading it before any has changed it.
   */
  hold(account: AccountId): Promise<void>;
}

/** Reserving an address for an account. */
export interface ReservesAddress {
  /**
   * Reserves `address` for `account`, and says who holds it afterwards: the
   * account given when this registration reserved it, and whoever already held
   * it when it did not. Always somebody.
   *
   * Reserving rather than looking and then writing, because between a look
   * that found nothing and the writing that followed it another registration
   * can have taken the address, and then both would make an account for it.
   */
  reserve(address: EmailAddress, account: AccountId): Promise<AccountId>;
}
