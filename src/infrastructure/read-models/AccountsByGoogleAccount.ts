// Accounts by the Google account linked to them, for signing in with Google to
// find the account a Google account signs in to. Nothing can replay every
// account's events to find out, so this keeps the answer as Google accounts
// are linked and accounts forgotten.
//
// It holds a keyed hash of each subject, never the subject, made with the key
// email addresses are hashed with and a prefix of its own, so that no subject
// hashes to the same as any address. The hash is made here rather than carried
// in the event, as an address's is: nothing needs to find a forgotten
// account's Google account, so nothing needs its hash once its subject can no
// longer be read.
import { createHmac } from "node:crypto";

import type { Projection } from "../../application/common/Projection.js";
import type { AccountsByGoogleAccount as Finding } from "../../application/operations/accounts/SignInWithGoogleHandler.js";
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { GoogleAccountLinked } from "../../domain/aggregates/accounts/events/GoogleAccountLinked.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

export class AccountsByGoogleAccount implements Projection, Finding {
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
    const connection = this.unitOfWork.connection();
    for (const event of events) {
      if (event instanceof GoogleAccountLinked) {
        await connection.query(
          `insert into accounts_by_google_account (account_id, subject_hash)
           values ($1, $2)
           on conflict (account_id) do nothing`,
          [stream.value, this.#hash(event.subject)],
        );
      } else if (event instanceof AccountForgotten) {
        await connection.query(
          `delete from accounts_by_google_account where account_id = $1`,
          [stream.value],
        );
      }
    }
  }

  /** The account the Google account `subject` is linked to, if any. */
  async find(subject: string): Promise<AccountId | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string }>(
        `select account_id from accounts_by_google_account
          where subject_hash = $1`,
        [this.#hash(subject)],
      );
    const row = rows[0];
    return row === undefined ? undefined : AccountId.from(row.account_id);
  }

  #hash(subject: string): string {
    return createHmac("sha256", this.key)
      .update(`google-subject:${subject}`)
      .digest("hex");
  }
}
