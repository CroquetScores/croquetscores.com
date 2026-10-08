import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddRole } from "./AddRole.js";
import { accountThatCanBeGiven } from "./accountsThatCanBeGiven.js";
import type { FindsConfirmedAccountByAddress } from "./accountsByAddress.js";
import {
  RoleOperationRefused,
  administratorAsking,
  roleNamed,
} from "./roleOperations.js";

/**
 * Giving somebody a role, named by their email address, as an administrator
 * gives it (AddRole.feature).
 */
export class AddRoleHandler extends CommandHandler<AddRole, void> {
  readonly handles: RequestType<AddRole> = AddRole;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly accountsByAddress: FindsConfirmedAccountByAddress,
  ) {
    super();
  }

  async handle(command: AddRole): Promise<void> {
    const by = await administratorAsking(this.accounts, command.account);
    const role = roleNamed(command.role, "AddRole");
    const found = await accountThatCanBeGiven(
      this.accountsByAddress,
      command.emailAddress,
    );
    // Loaded, since giving a role changes the account, and asked again as it
    // is now, so that one forgotten since it was found is refused as one that
    // cannot be given a role rather than by the account.
    const account =
      found === undefined ? undefined : await this.accounts.load(found);
    if (account === undefined || !account.confirmed || account.forgotten) {
      throw new RoleOperationRefused(
        "AddRole.NoSuchAccount",
        "The address has no account that can be given a role.",
      );
    }
    account.addRole(role, by, command.requestedAt);
    await this.accounts.save(account);
  }
}
