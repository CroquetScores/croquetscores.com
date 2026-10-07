// What a link to confirm forgetting an account is worth, to the reader who
// followed it, asked once and answered the same way wherever it is asked: by
// the page the link opens before it shows the button, and by forgetting before
// it forgets anything.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { Links } from "../../services/Links.js";

/**
 * What a link to confirm forgetting is worth. One refusal for every way it can
 * be worth nothing, because there is nothing to be had for any of them: a new
 * link is asked for from the account, not traded for an old one. And one for
 * a link that works for the site's last administrator, who is told what would
 * let them be forgotten.
 */
export type ForgettingLinkWorth =
  "Link.Works" | "Link.NoLongerWorks" | "ForgetAccount.LastAdministrator";

export type ForgettingLinkJudged =
  | { readonly worth: "Link.Works"; readonly account: Account }
  | { readonly worth: "Link.NoLongerWorks" }
  | { readonly worth: "ForgetAccount.LastAdministrator" };

const noLongerWorks = {
  worth: "Link.NoLongerWorks",
} as const satisfies ForgettingLinkJudged;

/**
 * What `link` is worth at `at` to the reader signed in to `reader`, where
 * `administrators` are the accounts holding the Administrator role.
 *
 * A link works only for the account it was sent for, and only for a reader
 * signed in to that account: followed signed in as somebody else, it forgets
 * nothing, since whoever asks has to be able to read the account's email as
 * well as be signed in to it. A link for an account already forgotten is spent,
 * which is what makes it work once.
 *
 * The last administrator is not forgotten, since forgetting takes every role
 * an account holds and only an administrator can make another
 * (ForgetAccount.feature). Who they are is read from `administrators` rather
 * than from the account, so that forgetting can ask it of the rows it holds.
 */
export const worthOfForgettingLink = async (
  links: Links,
  accounts: AggregateRepository<Account, AccountId>,
  link: string,
  reader: AccountId,
  at: ReadOnlyDate,
  administrators: readonly AccountId[],
): Promise<ForgettingLinkJudged> => {
  const carried = links.read(link);
  if (carried === undefined) return noLongerWorks;
  if (carried.purpose !== "confirm-forgetting") return noLongerWorks;
  if (!carried.account.equals(reader)) return noLongerWorks;
  if (carried.worksUntil.toDate() < at.toDate()) return noLongerWorks;

  const account = await accounts.load(carried.account);
  if (account === undefined) return noLongerWorks;
  if (account.forgotten) return noLongerWorks;
  if (administrators.length === 1 && administrators[0]?.equals(account.id)) {
    return { worth: "ForgetAccount.LastAdministrator" };
  }
  return { worth: "Link.Works", account };
};
