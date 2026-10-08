// Finding the account somebody is to be given something by their email
// address: a role (AddRole.feature), or a part in a tournament as a manager
// (AddManager.feature) or a scorer (AddScorer.feature). Written once, so that
// the three cannot come to disagree about which accounts can be given
// anything.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";

/** What giving somebody something asks of where accounts are found. */
export interface AccountsByAddress {
  /** The account at `address`, or nothing where no account is found there. */
  find(address: EmailAddress): Promise<AccountId | undefined>;
}

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
 */
export const accountThatCanBeGiven = async (
  accounts: AggregateRepository<Account, AccountId>,
  accountsByAddress: AccountsByAddress,
  emailAddress: string,
): Promise<Account | undefined> => {
  const found = await accountsByAddress.find(EmailAddress.from(emailAddress));
  const account = found === undefined ? undefined : await accounts.load(found);
  return account === undefined || !account.confirmed || account.forgotten
    ? undefined
    : account;
};
