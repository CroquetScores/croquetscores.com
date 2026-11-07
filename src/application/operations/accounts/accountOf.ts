import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";

/**
 * The account `id`, which something else has already shown to be there: a
 * session names it, or a read model found it. Having no events is then a
 * broken database or a request that raced a deletion, not something to tell
 * whoever asked, so it is thrown as a plain error rather than refused with a
 * code a page would show.
 */
export const accountOf = async (
  accounts: AggregateRepository<Account, AccountId>,
  id: AccountId,
): Promise<Account> => {
  const account = await accounts.load(id);
  if (account === undefined) {
    throw new Error(`The account ${id.value} has no events.`);
  }
  return account;
};
