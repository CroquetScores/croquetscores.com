import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddRole } from "./AddRole.js";
import {
  type AccountsByAddress,
  accountThatCanBeGiven,
} from "./accountsThatCanBeGiven.js";
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
    private readonly accountsByAddress: AccountsByAddress,
  ) {
    super();
  }

  async handle(command: AddRole): Promise<void> {
    const by = await administratorAsking(this.accounts, command.account);
    const role = roleNamed(command.role, "AddRole");
    const account = await accountThatCanBeGiven(
      this.accounts,
      this.accountsByAddress,
      command.emailAddress,
    );
    if (account === undefined) {
      throw new RoleOperationRefused(
        "AddRole.NoSuchAccount",
        "The address has no account that can be given a role.",
      );
    }
    account.addRole(role, by, command.requestedAt);
    await this.accounts.save(account);
  }
}
