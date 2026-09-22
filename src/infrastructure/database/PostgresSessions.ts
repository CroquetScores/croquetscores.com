// Sessions in Postgres: a row for each, against a hash of the id its browser
// holds.
//
// The hash is a plain SHA-256, unkeyed. An id is 32 random bytes, so there is
// nothing to guess at by hashing candidates the way there is with an email
// address; the hash is here so that a stolen table holds nothing that can be
// sent back as a cookie.
//
// A session lasts 90 days from its last use. Its last use is written at most
// once an hour, so that reading a page is a read and not a write: the 90 days
// are counted from within an hour of the last visit, which is as exact as this
// needs to be.
import { createHash, randomBytes } from "node:crypto";

import type { Sessions } from "../../application/services/Sessions.js";
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "./UnitOfWork.js";

/** How long a session lasts from its last use. */
const LASTS_DAYS = 90;

/** How often a session's last use is written down. */
const WRITE_LAST_USE_EVERY_MILLISECONDS = 60 * 60 * 1000;

const A_DAY = 24 * 60 * 60 * 1000;

const hashOf = (id: string): string =>
  createHash("sha256").update(id).digest("base64url");

export class PostgresSessions implements Sessions {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async start(account: AccountId, at: ReadOnlyDate): Promise<string> {
    // 32 bytes from the system's own source: enough that nobody guesses one,
    // and nothing about the account or the moment in it.
    const id = randomBytes(32).toString("base64url");
    await this.unitOfWork.connection().query(
      `insert into sessions (id_hash, account_id, started_at, last_used_at)
         values ($1, $2, $3, $3)`,
      [hashOf(id), account.value, at.toDate()],
    );
    return id;
  }

  async readerOf(id: string, at: ReadOnlyDate): Promise<AccountId | undefined> {
    const connection = this.unitOfWork.connection();
    const since = new Date(at.toDate().getTime() - LASTS_DAYS * A_DAY);
    const { rows } = await connection.query<{
      account_id: string;
      last_used_at: Date;
    }>(
      `select account_id, last_used_at from sessions
        where id_hash = $1 and last_used_at > $2`,
      [hashOf(id), since],
    );
    const row = rows[0];
    if (row === undefined) return undefined;

    const used = row.last_used_at.getTime();
    if (at.toDate().getTime() - used >= WRITE_LAST_USE_EVERY_MILLISECONDS) {
      await connection.query(
        `update sessions set last_used_at = $2 where id_hash = $1`,
        [hashOf(id), at.toDate()],
      );
    }
    return AccountId.from(row.account_id);
  }

  // Deleted rather than marked: a row nobody can use again is a row worth
  // nothing, and a copy of the cookie taken beforehand stops working with it.
  async end(id: string): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`delete from sessions where id_hash = $1`, [hashOf(id)]);
  }

  async endEveryOneFor(account: AccountId): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`delete from sessions where account_id = $1`, [account.value]);
  }
}
