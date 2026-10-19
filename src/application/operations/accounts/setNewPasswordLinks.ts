// What a link to set a new password is worth, asked once and answered the same
// way wherever it is asked.
//
// Two things ask it. Setting a password asks before it changes anything. The
// page the link opens asks before it shows the form, because a reader whose
// link has expired, or has already been used, is owed that on arrival rather
// than after choosing a password that was never going to be kept.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { Links } from "../../services/Links.js";
import { AN_HOUR } from "../../common/moments.js";

/**
 * What a link to set a new password is worth. Named by the codes setting one
 * is refused with, and one more for the link that would work.
 */
export type SetNewPasswordLinkWorth =
  "Link.Works" | "Link.Expired" | "Link.NoLongerWorks";

/**
 * What the link is written down as once a setting has spent it: the part the
 * site signed, and nothing around it. The page that shows the form and the
 * submission it sends carry the same link in different addresses — the
 * submission's has the request id beside it — and both must name one link.
 */
export const spent = (link: string): string =>
  `set-new-password:${/[?&]link=([^&]*)/.exec(link)?.[1] ?? link}`;

/**
 * How long a link to set a new password works, in hours. Said here, where it
 * is judged, because when a link was made is worked out from it: the link
 * carries when it stops working and nothing else.
 */
export const SET_NEW_PASSWORD_LINK_HOURS = 1;

export type SetNewPasswordLinkJudged =
  | { readonly worth: "Link.Works"; readonly account: Account }
  | { readonly worth: Exclude<SetNewPasswordLinkWorth, "Link.Works"> };

const noLongerWorks = {
  worth: "Link.NoLongerWorks",
} as const satisfies SetNewPasswordLinkJudged;

/**
 * What `link` is worth at `at`.
 *
 * A link that has been used is worth nothing rather than expired, because
 * there is nothing to be had for it: whether it has been used is asked of what
 * writes down the requests already carried out, which is where a setting that
 * was kept wrote it. So is one made before the password was last set, and one
 * made before the account last moved to another address.
 */
export const worthOfSetNewPasswordLink = async (
  links: Links,
  accounts: AggregateRepository<Account, AccountId>,
  handled: HandledRequests,
  link: string,
  at: ReadOnlyDate,
): Promise<SetNewPasswordLinkJudged> => {
  const carried = links.read(link);
  if (carried === undefined) return noLongerWorks;
  // A link the site made for something else — confirming an address, forgetting
  // an account — is worth nothing here rather than followed: what it is for is
  // signed with the rest exactly so that one cannot stand in for another.
  if (carried.purpose !== "set-new-password") return noLongerWorks;

  const account = await accounts.load(carried.account);
  if (account === undefined) return noLongerWorks;
  if (account.forgotten) return noLongerWorks;
  // An account nobody has confirmed has no password to replace, and giving it
  // one here would hand it to whoever asked.
  if (!account.confirmed) return noLongerWorks;
  if (await handled.wasHandled(spent(link))) return noLongerWorks;
  // Spent, too, by a password set with any other link after it was made: a
  // reader who has used one has chosen their password, and the others still in
  // their inbox would each be a way to change it again. Strictly after, because
  // an account can be confirmed in the moment a link is asked for, and that
  // link has not been spent by anything.
  const madeAt =
    carried.worksUntil.toDate().getTime() -
    SET_NEW_PASSWORD_LINK_HOURS * AN_HOUR;
  const setAt = account.passwordSetAt;
  if (setAt !== undefined && madeAt < setAt.toDate().getTime()) {
    return noLongerWorks;
  }
  // And by the account moving to another address after it was made: the link
  // went to the address it moved from, which a reader may have moved away from
  // because it is no longer theirs. Strictly after, for the same reason.
  const movedAt = account.movedAt;
  if (movedAt !== undefined && madeAt < movedAt.toDate().getTime()) {
    return noLongerWorks;
  }

  if (carried.worksUntil.toDate() < at.toDate()) {
    return { worth: "Link.Expired" };
  }
  return { worth: "Link.Works", account };
};
