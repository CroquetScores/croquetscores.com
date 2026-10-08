// Finding the account somebody is to be given something by their email
// address: a role (AddRole.feature), or a part in a tournament as a manager
// (AddManager.feature) or a scorer (AddScorer.feature). Written once, so that
// the three cannot come to disagree about which accounts can be given
// anything.
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { FindsConfirmedAccountByAddress } from "./accountsByAddress.js";

/**
 * The account at `emailAddress`, as it was typed, where it can be given
 * something: one found there, confirmed, and not forgotten.
 *
 * Nothing where there is no such account, whatever the reason: none found,
 * one not yet confirmed, or one forgotten. The three are answered alike so
 * that whoever asks learns no more about somebody else's address than that it
 * cannot be given what they asked, and each caller refuses that with a code
 * of its own. Throws where the address breaks an email address's rules, as
 * one typed anywhere does.
 *
 * Asked of where accounts are found by their address rather than of the
 * account, which would replay every event it has to say whether it is
 * confirmed, a sign-in among them for every time its owner signed in. A caller
 * that changes the account loads it by the id this gives.
 */
export const accountThatCanBeGiven = (
  accountsByAddress: FindsConfirmedAccountByAddress,
  emailAddress: string,
): Promise<AccountId | undefined> =>
  accountsByAddress.findConfirmed(EmailAddress.from(emailAddress));
