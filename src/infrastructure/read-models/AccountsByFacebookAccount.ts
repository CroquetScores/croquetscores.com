// Accounts by the Facebook account linked to them, for signing in with Facebook to
// find the account a Facebook account signs in to. Nothing can replay every
// account's events to find out, so this keeps the answer as Facebook accounts
// are linked and accounts forgotten.
//
// It holds a keyed hash of each id, never the id, made with the key
// email addresses are hashed with and a prefix of its own, so that no id
// hashes to the same as any address. The hash is made here rather than carried
// in the event, as an address's is: nothing needs to find a forgotten
// account's Facebook account, so nothing needs its hash once its subject can no
// longer be read.
import { createHmac } from "node:crypto";

import type { Projection } from "../../application/common/Projection.js";
import type { AccountsByFacebookAccount as Finding } from "../../application/operations/accounts/SignInWithFacebookHandler.js";
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { FacebookAccountLinked } from "../../domain/aggregates/accounts/events/FacebookAccountLinked.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

export class AccountsByFacebookAccount implements Projection, Finding {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly key: string,
  ) {}

  /**
   * Keeps the table in step with `events`. Safe to run twice: a linking
   * projected again writes the row it wrote, and a forgetting deletes nothing
   * the second time.
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
      if (event instanceof FacebookAccountLinked) {
        await connection.query(
          `insert into accounts_by_facebook_account (account_id, facebook_id_hash)
           values ($1, $2)
           on conflict (account_id) do nothing`,
          [stream, this.#hash(event.facebookId)],
        );
      } else if (event instanceof AccountForgotten) {
        await connection.query(
          `delete from accounts_by_facebook_account where account_id = $1`,
          [stream],
        );
      }
    }
  }

  /** Empties its tables, so that every stream can be handed to it again. */
  async clear(): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`truncate accounts_by_facebook_account`);
  }

  /**
   * Makes the table again from the streams it is handed, one at a time, each
   * event projected as it was when it was appended. A link and the forgetting
   * of its account are both in that account's own stream, so which stream is
   * read first changes nothing.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, [event]);
  }

  /** The account the Facebook account `subject` is linked to, if any. */
  async find(facebookId: string): Promise<AccountId | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string }>(
        `select account_id from accounts_by_facebook_account
          where facebook_id_hash = $1`,
        [this.#hash(facebookId)],
      );
    const row = rows[0];
    return row === undefined ? undefined : AccountId.from(row.account_id);
  }

  #hash(facebookId: string): string {
    return createHmac("sha256", this.key)
      .update(`facebook-id:${facebookId}`)
      .digest("hex");
  }
}
