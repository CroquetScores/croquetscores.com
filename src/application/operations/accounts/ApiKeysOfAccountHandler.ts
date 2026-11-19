import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { ApiKeysOfAccount, type ApiKeyShown } from "./ApiKeysOfAccount.js";

/**
 * An account's keys as the account has them now. A forgotten account has none,
 * and one the store has never heard of is answered alike, with nothing.
 */
export class ApiKeysOfAccountHandler extends QueryHandler<
  ApiKeysOfAccount,
  readonly ApiKeyShown[]
> {
  readonly handles: RequestType<ApiKeysOfAccount> = ApiKeysOfAccount;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(query: ApiKeysOfAccount): Promise<readonly ApiKeyShown[]> {
    const account = await this.accounts.load(AccountId.from(query.account));
    if (account === undefined || account.forgotten) return [];
    return account.apiKeys.map((key) => ({
      id: key.id,
      label: key.label,
      mayRead: key.scope.mayRead,
      mayWrite: key.scope.mayWrite,
      tournament: key.tournament,
      perMinute: key.limits.perMinute,
      perDay: key.limits.perDay,
      madeAt: key.madeAt.toISOString(),
      revoked: key.revoked,
    }));
  }
}
