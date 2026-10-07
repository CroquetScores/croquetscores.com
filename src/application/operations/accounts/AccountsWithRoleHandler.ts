import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { namesOf } from "../tournaments/tournamentOperations.js";
import { AccountsWithRole, type AccountWithRole } from "./AccountsWithRole.js";
import {
  type AccountsByRole,
  administratorAsking,
  roleNamed,
} from "./roleOperations.js";

/**
 * The accounts holding a role, found in the read model and named from their
 * own streams. The read model keeps no name, since a name is personal and is
 * kept sealed in the account's events; and the accounts holding a role are a
 * handful, so reading each is cheap.
 */
export class AccountsWithRoleHandler extends QueryHandler<
  AccountsWithRole,
  readonly AccountWithRole[]
> {
  readonly handles: RequestType<AccountsWithRole> = AccountsWithRole;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byRole: AccountsByRole,
  ) {
    super();
  }

  async handle(query: AccountsWithRole): Promise<readonly AccountWithRole[]> {
    const by = await administratorAsking(this.accounts, query.account);
    const role = roleNamed(query.role, "AccountsWithRole");
    const holding = (await this.byRole.holding(role)).filter(
      (id) => role !== "administrator" || !id.equals(by),
    );
    return (await namesOf(this.accounts, holding))
      .map(({ id, name }) => ({ id: id.value, name }))
      .sort((one, other) => one.name.localeCompare(other.name));
  }
}
