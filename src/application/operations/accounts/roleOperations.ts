// What giving a role, taking one, and listing who holds one share: that only
// an administrator may ask, finding the role a request names, and where the
// accounts holding each role are found.
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import {
  isRole,
  type Role,
} from "../../../domain/aggregates/accounts/value-objects/Role.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";

/** Why giving, taking or listing a role is refused. */
export type RoleOperationErrorCode =
  | "Account.NotAnAdministrator"
  | "AddRole.NoSuchAccount"
  | "AddRole.NoSuchRole"
  | "RemoveRole.NoSuchAccount"
  | "RemoveRole.NoSuchRole"
  | "RemoveRole.Yourself"
  | "AccountsWithRole.NoSuchRole";

/**
 * An operation's refusal, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class RoleOperationRefused extends Refused<RoleOperationErrorCode> {}

/** Where the accounts holding each role are found. */
export interface AccountsByRole {
  /** Every account holding `role`, in no order. */
  holding(role: Role): Promise<readonly AccountId[]>;

  /**
   * Every account holding `role`, in no order, each held until the
   * transaction is done: whoever else takes hold of them waits until then,
   * and finds them as this transaction left them.
   */
  holdEvery(role: Role): Promise<readonly AccountId[]>;
}

/**
 * The account `written`, which asks, once it is known to hold the
 * Administrator role. Anybody else is refused with
 * `Account.NotAnAdministrator`: an account there is not, as one whose session
 * outlived it, and a forgotten one, which holds no role, alike.
 */
export const administratorAsking = async (
  accounts: AggregateRepository<Account, AccountId>,
  written: string,
): Promise<AccountId> => {
  const account = await accounts.load(AccountId.from(written));
  if (account?.isAdministrator !== true) {
    throw new RoleOperationRefused(
      "Account.NotAnAdministrator",
      "Only an administrator can ask for this.",
    );
  }
  return account.id;
};

/**
 * The role `written` names, as a role is kept, or refused as `operation`'s
 * `NoSuchRole`. Asked after whoever asks is known to be an administrator, so
 * that nobody else learns which roles there are.
 */
export const roleNamed = (
  written: string,
  operation: "AddRole" | "RemoveRole" | "AccountsWithRole",
): Role => {
  if (!isRole(written)) {
    throw new RoleOperationRefused(
      `${operation}.NoSuchRole`,
      "There is no such role.",
    );
  }
  return written;
};
