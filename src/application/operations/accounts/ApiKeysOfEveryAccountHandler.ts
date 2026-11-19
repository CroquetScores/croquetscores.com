import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { FindsApiKeys } from "./apiKeyOperations.js";
import {
  ApiKeysOfEveryAccount,
  type ApiKeyOfAnAccount,
} from "./ApiKeysOfEveryAccount.js";
import { administratorAsking } from "./roleOperations.js";

/**
 * Every key that works, found in the read model, which holds nothing else, and
 * described from its own account's stream, since a key's label and its
 * owner's name are personal and are kept sealed there. Whether the account
 * asking is an administrator is asked first, as it is for changing a key's
 * limits.
 */
export class ApiKeysOfEveryAccountHandler extends QueryHandler<
  ApiKeysOfEveryAccount,
  readonly ApiKeyOfAnAccount[]
> {
  readonly handles: RequestType<ApiKeysOfEveryAccount> = ApiKeysOfEveryAccount;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly keys: FindsApiKeys,
  ) {
    super();
  }

  async handle(
    query: ApiKeysOfEveryAccount,
  ): Promise<readonly ApiKeyOfAnAccount[]> {
    await administratorAsking(this.accounts, query.account);
    const found: ApiKeyOfAnAccount[] = [];
    const loaded = new Map<string, Account | undefined>();
    for (const { account: id, keyId } of await this.keys.all()) {
      if (!loaded.has(id.value)) {
        loaded.set(
          id.value,
          await this.accounts.load(AccountId.from(id.value)),
        );
      }
      const account = loaded.get(id.value);
      const key = account?.apiKeys.find((each) => each.id === keyId);
      // The read model is kept as events are projected, so it can be a moment
      // behind the account: a key it still holds that the account has since
      // revoked, or an account forgotten, is left out rather than shown.
      if (
        account === undefined ||
        account.forgotten ||
        key === undefined ||
        key.revoked
      ) {
        continue;
      }
      found.push({
        id: key.id,
        owner: account.name?.toString() ?? "",
        label: key.label,
        mayRead: key.scope.mayRead,
        mayWrite: key.scope.mayWrite,
        perMinute: key.limits.perMinute,
        perDay: key.limits.perDay,
        madeAt: key.madeAt.toISOString(),
      });
    }
    return found.sort((one, other) => one.madeAt.localeCompare(other.madeAt));
  }
}
