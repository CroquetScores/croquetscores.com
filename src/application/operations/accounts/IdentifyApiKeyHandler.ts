import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { ApiKeys } from "../../services/ApiKeys.js";
import type { FindsApiKeys } from "./apiKeyOperations.js";
import { type ApiKeyIdentified, IdentifyApiKey } from "./IdentifyApiKey.js";

/**
 * Who a key belongs to, found by the hash of it. The read model finds the
 * account, and the account is asked again as it is now, so that a key revoked,
 * or an account forgotten, since the read model was written is not let in by
 * a lag in it.
 */
export class IdentifyApiKeyHandler extends QueryHandler<
  IdentifyApiKey,
  ApiKeyIdentified | undefined
> {
  readonly handles: RequestType<IdentifyApiKey> = IdentifyApiKey;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly found: FindsApiKeys,
    private readonly keys: ApiKeys,
  ) {
    super();
  }

  async handle(query: IdentifyApiKey): Promise<ApiKeyIdentified | undefined> {
    const hash = this.keys.hash(query.key);
    const found = await this.found.findByHash(hash);
    if (found === undefined) return undefined;
    const account = await this.accounts.load(found.account);
    if (account === undefined || account.forgotten || !account.confirmed) {
      return undefined;
    }
    const key = account.apiKeys.find((each) => each.id === found.keyId);
    if (key === undefined || key.revoked || key.keyHash !== hash) {
      return undefined;
    }
    return {
      account: account.id.value,
      keyId: key.id,
      mayRead: key.scope.mayRead,
      mayWrite: key.scope.mayWrite,
      tournament: key.tournament,
      perMinute: key.limits.perMinute,
      perDay: key.limits.perDay,
    };
  }
}
