import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RemoveRole } from "./RemoveRole.js";
import {
  type AccountsByRole,
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
    private readonly byRole: AccountsByRole,
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
    // The last two administrators taking the role from each other at once
    // would each be found an administrator before the other had taken it, and
    // leave the site with none. So the administrators are held first, and
    // whoever asks is asked again whether they are one: the second to ask
    // waits, and then finds the role already taken from them.
    if (role === "administrator") {
      const administrators = await this.byRole.holdEvery("administrator");
      if (!administrators.some((id) => id.equals(by))) {
        throw new RoleOperationRefused(
          "Account.NotAnAdministrator",
          "Only an administrator can ask for this.",
        );
      }
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
