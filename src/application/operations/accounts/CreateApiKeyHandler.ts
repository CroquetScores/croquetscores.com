import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { ApiKeyId } from "../../../domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyLabel } from "../../../domain/aggregates/accounts/value-objects/ApiKeyLabel.js";
import { ApiKeyLimits } from "../../../domain/aggregates/accounts/value-objects/ApiKeyLimits.js";
import { ApiKeyScope } from "../../../domain/aggregates/accounts/value-objects/ApiKeyScope.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { ApiKeys } from "../../services/ApiKeys.js";
import { accountOf } from "./accountOf.js";
import { type CreatedApiKey, CreateApiKey } from "./CreateApiKey.js";

/**
 * Making a key for the account the reader is signed in to.
 *
 * Only the hash goes into the account's events. The key is in what is
 * answered and nowhere else, so a key lost is made again and never found.
 * Whether the account can be given one at all, confirmed and not forgotten, is
 * the account's to say, and it says so by refusing. Nothing is emailed: the
 * reader is looking at the answer.
 */
export class CreateApiKeyHandler extends CommandHandler<
  CreateApiKey,
  CreatedApiKey
> {
  readonly handles: RequestType<CreateApiKey> = CreateApiKey;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly keys: ApiKeys,
  ) {
    super();
  }

  async handle(command: CreateApiKey): Promise<CreatedApiKey> {
    const account = await accountOf(
      this.accounts,
      AccountId.from(command.account),
    );
    const id = ApiKeyId.create();
    const made = this.keys.make();
    account.createApiKey(
      id,
      made.hash,
      ApiKeyLabel.from(command.label),
      ApiKeyScope.from(command.scope),
      command.tournament,
      ApiKeyLimits.usual(),
      command.requestedAt,
    );
    await this.accounts.save(account);
    return { id: id.value, key: made.key };
  }
}
