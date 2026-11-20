// What each account is called (AccountNames.feature), kept as an account is
// confirmed, brought over or renamed, and taken away when it is forgotten, so
// that nothing of the person is kept here once they are.
import type { Projection } from "../../application/common/Projection.js";
import type { AccountNames as Asked } from "../../application/operations/accounts/accountNames.js";
import { AccountBroughtOver } from "../../domain/aggregates/accounts/events/AccountBroughtOver.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { EmailAddressConfirmed } from "../../domain/aggregates/accounts/events/EmailAddressConfirmed.js";
import { NameChanged } from "../../domain/aggregates/accounts/events/NameChanged.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

export class AccountNames implements Projection, Asked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  /**
   * Keeps the table in step with `events`. Safe to run twice when an
   * account's events are given again in the order they were kept: a name
   * written again is the name written, and a forgetting deletes nothing the
   * second time.
   */
  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    await this.#project(stream.value, events);
  }

  async #project(
    stream: string,
    events: readonly DomainEvent[],
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    for (const event of events) {
      if (
        event instanceof AccountBroughtOver ||
        event instanceof EmailAddressConfirmed ||
        event instanceof NameChanged
      ) {
        await connection.query(
          `insert into account_names (account_id, name, changed_at)
           values ($1, $2, $3)
           on conflict (account_id)
           do update set name = excluded.name, changed_at = excluded.changed_at`,
          [stream, event.name, event.occurredAt.toISOString()],
        );
      } else if (event instanceof AccountForgotten) {
        await connection.query(
          `delete from account_names where account_id = $1`,
          [stream],
        );
      }
    }
  }

  /** Empties its table, so that every stream can be handed to it again. */
  async clear(): Promise<void> {
    await this.unitOfWork.connection().query(`truncate account_names`);
  }

  /**
   * Makes the table again from the streams it is handed, one at a time. Every
   * event that names an account, and the one that forgets it, is in that
   * account's own stream, so which stream is read first changes nothing.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, [event]);
  }

  async of(accounts: readonly string[]): Promise<ReadonlyMap<string, string>> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string; name: string }>(
        `select account_id, name from account_names
          where account_id = any($1::text[])`,
        [accounts],
      );
    return new Map(rows.map((row) => [row.account_id, row.name]));
  }
}
