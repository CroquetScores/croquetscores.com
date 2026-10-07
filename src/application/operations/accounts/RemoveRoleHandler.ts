import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RemoveRole } from "./RemoveRole.js";
import {
  RoleOperationRefused,
  administratorAsking,
  roleNamed,
} from "./roleOperations.js";

/**
 * Taking a role from somebody, named by their account's id, as an
 * administrator takes it (RemoveRole.feature).
 */
export class RemoveRoleHandler extends CommandHandler<RemoveRole, void> {
  readonly handles: RequestType<RemoveRole> = RemoveRole;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
  ) {
    super();
  }

  async handle(command: RemoveRole): Promise<void> {
    const by = await administratorAsking(this.accounts, command.account);
    const role = roleNamed(command.role, "RemoveRole");
    const holder = AccountId.from(command.holder);
    // Refused here as well as not offered, because the last administrator
    // taking it from themselves would leave the site with none, which only the
    // database could then undo.
    if (role === "administrator" && holder.equals(by)) {
      throw new RoleOperationRefused(
        "RemoveRole.Yourself",
        "An administrator cannot take the Administrator role from themselves.",
      );
    }
    // A forgotten account holds no role, and refuses whatever is asked of it,
    // so it is refused as one there is not.
    const account = await this.accounts.load(holder);
    if (account === undefined || account.forgotten) {
      throw new RoleOperationRefused(
        "RemoveRole.NoSuchAccount",
        "There is no such account.",
      );
    }
    account.removeRole(role, by, command.requestedAt);
    await this.accounts.save(account);
  }
}
