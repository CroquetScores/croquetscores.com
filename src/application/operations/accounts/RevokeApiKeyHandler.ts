import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { ApiKeyId } from "../../../domain/aggregates/accounts/ApiKeyId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { accountOf } from "./accountOf.js";
import { RevokeApiKey } from "./RevokeApiKey.js";

/**
 * Revoking a key of the account the reader is signed in to. A key the account
 * did not make is refused by the account as not found, whoever did make it, so
 * that asking cannot tell which keys another account has.
 */
export class RevokeApiKeyHandler extends CommandHandler<
  RevokeApiKey,
  AccountId
> {
  readonly handles: RequestType<RevokeApiKey> = RevokeApiKey;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RevokeApiKey): Promise<AccountId> {
    const account = await accountOf(
      this.accounts,
      AccountId.from(command.account),
    );
    account.revokeApiKey(ApiKeyId.from(command.keyId), command.requestedAt);
    await this.accounts.save(account);
    return account.id;
  }
}
