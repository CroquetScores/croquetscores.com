import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { ApiKeys } from "../../services/ApiKeys.js";
import type { FindsApiKeys } from "./apiKeyOperations.js";
import { type ApiKeyIdentified, IdentifyApiKey } from "./IdentifyApiKey.js";

/**
 * Who a key belongs to, found by the hash of it, in the read model alone.
 *
 * The account is not asked again as it is now. Projections run in the
 * transaction of the append that changes the account, so the read model is
 * never behind, and a key revoked or an account forgotten has no row in it.
 * Asking the account as well would load every event the account has, a
 * sign-in among them for each time its owner signed in, for every request any
 * app makes, to be told what the row already says.
 */
export class IdentifyApiKeyHandler extends QueryHandler<
  IdentifyApiKey,
  ApiKeyIdentified | undefined
> {
  readonly handles: RequestType<IdentifyApiKey> = IdentifyApiKey;

  constructor(
    private readonly found: FindsApiKeys,
    private readonly keys: ApiKeys,
  ) {
    super();
  }

  async handle(query: IdentifyApiKey): Promise<ApiKeyIdentified | undefined> {
    const key = await this.found.findByHash(this.keys.hash(query.key));
    if (key === undefined) return undefined;
    return {
      account: key.account.value,
      keyId: key.keyId,
      mayRead: key.mayRead,
      mayWrite: key.mayWrite,
      tournament: key.tournament,
      perMinute: key.perMinute,
      perDay: key.perDay,
    };
  }
}
