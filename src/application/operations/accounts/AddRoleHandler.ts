import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { AccountsByAddress } from "../tournaments/tournamentOperations.js";
import { AddRole } from "./AddRole.js";
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
    // Refused the same way however the address came to have no account that
    // can sign in, as making a manager is, so that the administrator learns no
    // more about somebody else's address than that it cannot be given a role.
    const found = await this.accountsByAddress.find(
      EmailAddress.from(command.emailAddress),
    );
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
