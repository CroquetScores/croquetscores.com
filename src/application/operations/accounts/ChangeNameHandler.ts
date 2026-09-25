import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { ChangeName } from "./ChangeName.js";

/**
 * Changing what the account the reader is signed in to is called.
 *
 * Nothing is emailed: what an account is called says nothing about who can
 * reach it. Whether the account can be renamed at all — confirmed, and not
 * forgotten — is the account's to say, and it says so by refusing.
 */
export class ChangeNameHandler extends CommandHandler<ChangeName, AccountId> {
  readonly handles: RequestType<ChangeName> = ChangeName;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: ChangeName): Promise<AccountId> {
    const id = AccountId.from(command.account);
    const account = await this.accounts.load(id);
    if (account === undefined) {
      throw new Error(`The account ${id.value} has no events.`);
    }
    account.changeName(PersonName.from(command.name), command.requestedAt);
    await this.accounts.save(account);
    return account.id;
  }
}
