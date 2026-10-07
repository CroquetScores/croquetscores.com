import { Query } from "../../common/Query.js";

/** An account holding a role, as an administrator lists them. */
export interface AccountWithRole {
  /** The account's id, which is what taking the role names it by. */
  readonly id: string;
  /** The account's name, which is what a reader knows somebody by. */
  readonly name: string;
}

/**
 * The accounts holding the role `role`, by name in alphabetical order, as the
 * account the reader is signed in to lists them.
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`. A role there is not is refused as
 * `AccountsWithRole.NoSuchRole`. The administrator asking is left out of the
 * administrators, since they cannot take that role from themselves
 * (`RemoveRole.Yourself`).
 */
export class AccountsWithRole extends Query<readonly AccountWithRole[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The role, as one is kept: "administrator" or "world-ranking-officer". */
    readonly role: string,
  ) {
    super();
  }
}
