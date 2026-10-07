// The accounts holding each role (AccountsWithRole.feature), kept as roles are
// given and taken, and as accounts are forgotten, which takes every role they
// held.
import type { Projection } from "../../application/common/Projection.js";
import type { AccountsByRole as Finding } from "../../application/operations/accounts/roleOperations.js";
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { RoleAdded } from "../../domain/aggregates/accounts/events/RoleAdded.js";
import { RoleRemoved } from "../../domain/aggregates/accounts/events/RoleRemoved.js";
import type { Role } from "../../domain/aggregates/accounts/value-objects/Role.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

export class AccountsByRole implements Projection, Finding {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  /**
   * Keeps the table in step with `events`. Safe to run twice: a role given
   * again writes the row it wrote, and a role taken or an account forgotten
   * deletes nothing the second time.
   */
  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    for (const event of events) {
      if (event instanceof RoleAdded) {
        await connection.query(
          `insert into accounts_by_role (account_id, role)
           values ($1, $2)
           on conflict do nothing`,
          [stream.value, event.role],
        );
      } else if (event instanceof RoleRemoved) {
        await connection.query(
          `delete from accounts_by_role where account_id = $1 and role = $2`,
          [stream.value, event.role],
        );
      } else if (event instanceof AccountForgotten) {
        await connection.query(
          `delete from accounts_by_role where account_id = $1`,
          [stream.value],
        );
      }
    }
  }

  /**
   * Locks the rows as they are read. Under read committed, a second request
   * waiting on them reads them again once the first is done, and finds any
   * the first deleted gone. Locked in the order of their ids, so that two
   * requests take them in the same order and one waits for the other, rather
   * than each holding a row the other wants and both being stopped as a
   * deadlock.
   */
  async holdEvery(role: Role): Promise<readonly AccountId[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string }>(
        `select account_id from accounts_by_role where role = $1
         order by account_id
         for update`,
        [role],
      );
    return rows.map(({ account_id }) => AccountId.from(account_id));
  }

  async holding(role: Role): Promise<readonly AccountId[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string }>(
        `select account_id from accounts_by_role where role = $1`,
        [role],
      );
    return rows.map(({ account_id }) => AccountId.from(account_id));
  }
}
