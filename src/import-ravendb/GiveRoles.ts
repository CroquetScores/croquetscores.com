import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { Account } from "../domain/aggregates/accounts/Account.js";
import { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { Role } from "../domain/aggregates/accounts/value-objects/Role.js";
import type { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";

/** The addresses each role is to be held by, as the old sites' users had them. */
export type RoleHolders = Readonly<Partial<Record<Role, readonly string[]>>>;

/**
 * Gives the site's roles to the accounts named for them, once the old sites'
 * users are brought over (GiveRoles.feature). Nothing on the site gives a role
 * yet, and the import empties the database first, so without this every role
 * would be held by nobody.
 */
export class GiveRoles {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly database: ImportDatabase,
  ) {}

  /**
   * Gives each role in `holders` to each address named for it, at `at`, each
   * in a transaction of its own, and answers the addresses no user was brought
   * over as, so that one missing keeps none of the others from theirs.
   * Recorded as given by the account itself, since nobody asks for it but the
   * import.
   */
  async give(
    holders: RoleHolders,
    at: ReadOnlyDate,
  ): Promise<readonly string[]> {
    const withNoAccount: string[] = [];
    for (const [role, addresses] of Object.entries(holders) as [
      Role,
      readonly string[],
    ][]) {
      for (const address of addresses) {
        const given = await this.unitOfWork.inTransaction(async () => {
          const found = await this.database.findImportedAccount(
            EmailAddress.from(address),
          );
          if (found === undefined) return false;
          const id = AccountId.from(found);
          const account = await this.accounts.load(id);
          if (account === undefined) return false;
          account.addRole(role, id, at);
          await this.accounts.save(account);
          return true;
        });
        if (!given) withNoAccount.push(address);
      }
    }
    return withNoAccount;
  }
}
