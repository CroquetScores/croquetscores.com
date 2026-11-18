import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { ApiKeyId } from "../../../domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyLimits } from "../../../domain/aggregates/accounts/value-objects/ApiKeyLimits.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  ApiKeyOperationRefused,
  type FindsApiKeys,
} from "./apiKeyOperations.js";
import { ChangeApiKeyLimits } from "./ChangeApiKeyLimits.js";
import { administratorAsking } from "./roleOperations.js";

/**
 * Changing the limits of a key as an administrator does. Whether the account
 * asking is one is asked first, so that nobody else learns by asking which
 * keys there are. The key is found wherever it is kept, and one that is not
 * there, or was revoked, is refused as not found.
 */
export class ChangeApiKeyLimitsHandler extends CommandHandler<
  ChangeApiKeyLimits,
  void
> {
  readonly handles: RequestType<ChangeApiKeyLimits> = ChangeApiKeyLimits;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly keys: FindsApiKeys,
  ) {
    super();
  }

  async handle(command: ChangeApiKeyLimits): Promise<void> {
    const by = await administratorAsking(this.accounts, command.account);
    const id = ApiKeyId.from(command.keyId);
    const found = await this.keys.accountOf(id.value);
    const account =
      found === undefined ? undefined : await this.accounts.load(found);
    if (account === undefined) throw noSuchApiKey();
    account.changeApiKeyLimits(
      id,
      ApiKeyLimits.from(command.perMinute, command.perDay),
      by,
      command.requestedAt,
    );
    await this.accounts.save(account);
  }
}

const noSuchApiKey = (): ApiKeyOperationRefused =>
  new ApiKeyOperationRefused(
    "ChangeApiKeyLimits.NoSuchApiKey",
    "There is no such key.",
  );
