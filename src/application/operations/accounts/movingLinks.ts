// What a link to confirm moving an account to another address is worth, to the
// reader who followed it, asked once and answered the same way wherever it is
// asked: by the page the link opens before it shows the button, and by moving
// before it moves anything.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { Links } from "../../services/Links.js";

/** How long a link to confirm moving works: as long as one to confirm an address. */
export const MOVING_LINK_WORKS_FOR_MILLISECONDS = 24 * 60 * 60 * 1000;

export type MovingLinkJudged =
  | {
      readonly worth: "Link.Works";
      readonly account: Account;
      readonly emailAddress: EmailAddress;
    }
  | { readonly worth: "Link.NoLongerWorks" };

const noLongerWorks = {
  worth: "Link.NoLongerWorks",
} as const satisfies MovingLinkJudged;

/**
 * What `link` is worth at `at` to the reader signed in to `reader`.
 *
 * One refusal for every way it can be worth nothing, as forgetting's links
 * have, since there is nothing to be had for any of them. A link works only
 * for the account it was sent for, and only for a reader signed in to it; and
 * only for an asking the account still has waiting, which a move made since
 * spends, so that a link works once and no older one works after it.
 */
export const worthOfMovingLink = async (
  links: Links,
  accounts: AggregateRepository<Account, AccountId>,
  link: string,
  reader: AccountId,
  at: ReadOnlyDate,
): Promise<MovingLinkJudged> => {
  const carried = links.read(link);
  if (carried === undefined) return noLongerWorks;
  if (carried.purpose !== "change-email-address") return noLongerWorks;
  if (carried.reference === undefined) return noLongerWorks;
  if (!carried.account.equals(reader)) return noLongerWorks;
  if (carried.worksUntil.toDate() < at.toDate()) return noLongerWorks;

  const account = await accounts.load(carried.account);
  if (account === undefined || account.forgotten) return noLongerWorks;
  const emailAddress = account.moveAskedFor(carried.reference);
  if (emailAddress === undefined) return noLongerWorks;
  return { worth: "Link.Works", account, emailAddress };
};
