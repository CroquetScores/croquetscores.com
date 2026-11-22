// Accounts by the keys that work, for an app's request to be known by the key
// it sends. Nothing can replay every account's events to find out, so this
// keeps the answer as keys are made and revoked and accounts forgotten, and
// with it what the request is let in on: what the key may do, the tournament
// it is limited to, and its limits (IdentifyApiKeyHandler asks nothing else).
//
// It holds the hash of each key, which the event holds too, and never a key.
import type { Projection } from "../../application/common/Projection.js";
import type {
  ApiKeyFound,
  FindsApiKeys,
} from "../../application/operations/accounts/apiKeyOperations.js";
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { ApiKeyCreated } from "../../domain/aggregates/accounts/events/ApiKeyCreated.js";
import { ApiKeyLimitsChanged } from "../../domain/aggregates/accounts/events/ApiKeyLimitsChanged.js";
import { ApiKeyRevoked } from "../../domain/aggregates/accounts/events/ApiKeyRevoked.js";
import { ApiKeyScope } from "../../domain/aggregates/accounts/value-objects/ApiKeyScope.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";
import { writtenMoment } from "./writtenMoment.js";

export class AccountsByApiKey implements Projection, FindsApiKeys {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  /**
   * Keeps the table in step with `events`. Safe to run twice when an
   * account's events are given again in the order they were kept, which is
   * how rebuilding and the projecting store hand them over: a key made and
   * projected again writes the row it wrote, and one revoked or forgotten
   * deletes nothing the second time.
   *
   * It is not safe for a key's making to be given again after its revoking
   * or its account's forgetting without the revoking or forgetting following,
   * since nothing is kept of a deleted row to say the key was ever revoked,
   * and the making would put its row back. Keeping a mark of revoked keys
   * would close that, at the cost of a row for every key ever made; nothing
   * hands events over that way, so it has not been paid for.
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
        // A scope the code does not know is refused here as `Account.apply`
        // refuses it, rather than stored as something the key may do: a key
        // let in on a guess at its scope is worse than an append that fails.
        const scope = ApiKeyScope.from(event.scope);
        await connection.query(
          `insert into accounts_by_api_key
             (key_hash, key_id, account_id, may_write, tournament,
              per_minute, per_day, changed_at)
           values ($1, $2, $3, $4, $5, $6, $7, $8)
           on conflict (key_hash) do nothing`,
          [
            event.keyHash,
            event.keyId,
            stream,
            scope.mayWrite,
            event.tournament ?? null,
            event.perMinute,
            event.perDay,
            writtenMoment(event.occurredAt).toISOString(),
          ],
        );
      } else if (event instanceof ApiKeyLimitsChanged) {
        // A revoked key has no row, so there is nothing to change and nothing
        // to bring back.
        await connection.query(
          `update accounts_by_api_key
              set per_minute = $2, per_day = $3, changed_at = $4
            where key_id = $1`,
          [
            event.keyId,
            event.perMinute,
            event.perDay,
            writtenMoment(event.occurredAt).toISOString(),
          ],
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

  async findByHash(hash: string): Promise<ApiKeyFound | undefined> {
    const { rows } = await this.unitOfWork.connection().query<{
      account_id: string;
      key_id: string;
      may_write: boolean;
      tournament: string | null;
      per_minute: number;
      per_day: number;
    }>(
      `select account_id, key_id, may_write, tournament,
              per_minute, per_day
         from accounts_by_api_key
        where key_hash = $1`,
      [hash],
    );
    const row = rows[0];
    return row === undefined
      ? undefined
      : {
          account: AccountId.from(row.account_id),
          keyId: row.key_id,
          // Every key may read (ApiKeyScope.mayRead).
          mayRead: true,
          mayWrite: row.may_write,
          tournament: row.tournament ?? undefined,
          perMinute: row.per_minute,
          perDay: row.per_day,
        };
  }

  async accountOf(keyId: string): Promise<AccountId | undefined> {
    const { rows } = await this.unitOfWork.connection().query<{
      account_id: string;
    }>(`select account_id from accounts_by_api_key where key_id = $1`, [keyId]);
    const row = rows[0];
    return row === undefined ? undefined : AccountId.from(row.account_id);
  }

  async all(): Promise<
    readonly { readonly account: AccountId; readonly keyId: string }[]
  > {
    const { rows } = await this.unitOfWork.connection().query<{
      account_id: string;
      key_id: string;
    }>(`select account_id, key_id from accounts_by_api_key`);
    return rows.map((row) => ({
      account: AccountId.from(row.account_id),
      keyId: row.key_id,
    }));
  }
}
