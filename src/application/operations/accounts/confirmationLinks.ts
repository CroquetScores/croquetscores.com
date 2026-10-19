// What a link to confirm an email address is worth, asked once and answered the
// same way wherever it is asked.
//
// Two things ask it. Confirming asks before it changes anything, because a link
// that no longer works leaves nothing to have typed into. The page the link
// opens asks before it shows the form, because a reader whose link has expired
// is owed that on arrival rather than after filling in a name and a password
// that were never going to be kept. They are the same question, so the order
// the answers come in is written down once here rather than twice.
//
// That order is the substance of it. A link is only ever called expired once it
// is known to be one of ours, unaltered, and for an account that could still be
// confirmed — because an expired link is not the end of it: it still shows which
// account it was sent for and can be traded for a new one, and offering that
// trade for an account that is forgotten, or already confirmed, would be
// offering something that cannot be had.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { Links } from "../../services/Links.js";

/**
 * What a confirmation link is worth. Named by the codes confirming is refused
 * with, and one more for a link that would confirm, because the page that
 * shows the answer shows the same page for each however it came by it.
 */
export type ConfirmationLinkWorth =
  | "Link.Works"
  | "Link.Expired"
  | "Link.NoLongerWorks"
  | "Account.AlreadyConfirmed";

/**
 * What a link is worth, and the account it names when that account is one a
 * confirmation could still be kept against — so that whoever asked does not
 * load it a second time to use it.
 */
export type ConfirmationLinkJudged =
  | { readonly worth: "Link.Works"; readonly account: Account }
  | { readonly worth: Exclude<ConfirmationLinkWorth, "Link.Works"> };

/**
 * How long a link to confirm an address works, in hours. Confirming says why.
 * Said here, where the link is judged, as setting a new password's is.
 */
export const CONFIRMATION_LINK_WORKS_FOR_HOURS = 24;

const noLongerWorks = {
  worth: "Link.NoLongerWorks",
} as const satisfies ConfirmationLinkJudged;

/**
 * What `link` is worth at `at`, to whoever followed it.
 *
 * Reading the link comes first, because what it is worth needs the account it
 * names and there is no account to read until the link has been read. A link
 * the site made for something else — setting a new password, forgetting an
 * account — is worth nothing here rather than followed: what it is for is
 * signed with the rest exactly so that one cannot stand in for another.
 */
export const worthOfConfirmationLink = async (
  links: Links,
  accounts: AggregateRepository<Account, AccountId>,
  link: string,
  at: ReadOnlyDate,
): Promise<ConfirmationLinkJudged> => {
  const carried = links.read(link);
  if (carried === undefined) return noLongerWorks;
  if (carried.purpose !== "confirm-email-address") return noLongerWorks;

  const account = await accounts.load(carried.account);
  // An account the link names and the store has never heard of is a link
  // nobody here made for anything that exists.
  if (account === undefined) return noLongerWorks;
  if (account.forgotten) return noLongerWorks;

  // Asked here rather than of the account, because the account says nothing
  // about it: confirming a confirmed account records nothing and refuses
  // nothing. Without this a second submission would be answered as though it
  // had confirmed the address, under a name and a password thrown away.
  if (account.confirmed) return { worth: "Account.AlreadyConfirmed" };

  if (carried.worksUntil.toDate() < at.toDate()) {
    return { worth: "Link.Expired" };
  }

  return { worth: "Link.Works", account };
};
