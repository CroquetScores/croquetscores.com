// Accounts by the keys that work, for an app's request to be known by the key
// it sends. Nothing can replay every account's events to find out, so this
// keeps the answer as keys are made and revoked and accounts forgotten.
//
// It holds the hash of each key, which the event holds too, and never a key.
import type { Projection } from "../../application/common/Projection.js";
import type { FindsApiKeys } from "../../application/operations/accounts/apiKeyOperations.js";
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { ApiKeyCreated } from "../../domain/aggregates/accounts/events/ApiKeyCreated.js";
import { ApiKeyRevoked } from "../../domain/aggregates/accounts/events/ApiKeyRevoked.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

export class AccountsByApiKey implements Projection, FindsApiKeys {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  /**
   * Keeps the table in step with `events`. Safe to run twice: a key made and
   * projected again writes the row it wrote, and one revoked or forgotten
   * deletes nothing the second time.
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
      if (event instanceof ApiKeyCreated) {
        await connection.query(
          `insert into accounts_by_api_key (key_hash, key_id, account_id)
           values ($1, $2, $3)
           on conflict (key_hash) do nothing`,
          [event.keyHash, event.keyId, stream],
        );
      } else if (event instanceof ApiKeyRevoked) {
        await connection.query(
          `delete from accounts_by_api_key where key_id = $1`,
          [event.keyId],
        );
      } else if (event instanceof AccountForgotten) {
        await connection.query(
          `delete from accounts_by_api_key where account_id = $1`,
          [stream],
        );
      }
    }
  }

  /** Empties its tables, so that every stream can be handed to it again. */
  async clear(): Promise<void> {
    await this.unitOfWork.connection().query(`truncate accounts_by_api_key`);
  }

  /**
   * Makes the table again from the streams it is handed, one at a time, each
   * event projected as it was when it was appended. A key's making, its
   * revoking and its account's forgetting are all in that account's own
   * stream, so which stream is read first changes nothing.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, [event]);
  }

  async findByHash(
    hash: string,
  ): Promise<
    { readonly account: AccountId; readonly keyId: string } | undefined
  > {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string; key_id: string }>(
        `select account_id, key_id from accounts_by_api_key
          where key_hash = $1`,
        [hash],
      );
    const row = rows[0];
    return row === undefined
      ? undefined
      : { account: AccountId.from(row.account_id), keyId: row.key_id };
  }

  async accountOf(keyId: string): Promise<AccountId | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string }>(
        `select account_id from accounts_by_api_key where key_id = $1`,
        [keyId],
      );
    const row = rows[0];
    return row === undefined ? undefined : AccountId.from(row.account_id);
  }
}
