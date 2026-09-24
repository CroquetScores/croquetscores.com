import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { AccountProfile, type Profile } from "./AccountProfile.js";

/**
 * An account's profile, as the account has it now. A forgotten account has
 * nothing left to show, and one never confirmed has no name yet and cannot be
 * signed in to, so each is answered with nothing, as an account the store has
 * never heard of is.
 */
export class AccountProfileHandler extends QueryHandler<
  AccountProfile,
  Profile | undefined
> {
  readonly handles: RequestType<AccountProfile> = AccountProfile;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: AccountProfile): Promise<Profile | undefined> {
    const account = await this.accounts.load(AccountId.from(query.account));
    if (account === undefined || account.forgotten) return undefined;
    const name = account.name;
    if (!account.confirmed || name === undefined) return undefined;
    return {
      name: name.toString(),
      emailAddress: account.emailAddress.toString(),
    };
  }
}
