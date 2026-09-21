// What has been written to an account, kept in Postgres in the transaction of
// the command that wrote it, and kept after the email has been sent and
// dropped from the queue: the limit is on what was sent, not on what is still
// waiting.
import type { EmailsWritten } from "../../application/services/EmailsWritten.js";
import type { WrittenTo } from "../../application/services/EmailsWritten.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

// One column holds both kinds, so what is in it says which it is: an account
// and an address could otherwise share a spelling and be counted as one.
const named = (whom: WrittenTo): string => {
  if ("account" in whom) return `account:${whom.account.value}`;
  if ("emailAddressHash" in whom) return `address:${whom.emailAddressHash}`;
  return `administrator:${whom.administratorAbout}`;
};

export class PostgresEmailsWritten implements EmailsWritten {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async record(whom: WrittenTo, kind: string, at: ReadOnlyDate): Promise<void> {
    await this.unitOfWork.connection().query(
      `insert into emails_written (written_to, kind, written_at)
         values ($1, $2, $3)`,
      [named(whom), kind, at.toDate()],
    );
  }

  async countSince(whom: WrittenTo, since: ReadOnlyDate): Promise<number> {
    const connection = this.unitOfWork.connection();
    // An advisory lock rather than a row locked for update, because there may
    // be no row to lock: an account never written to has none here, and that
    // is exactly when the first few counts must not run side by side. It is
    // the transaction's, so it is let go when the command is kept or rolled
    // back and cannot be left held. The name is hashed with the table's in
    // front of it, so that another lock taken by an account's id elsewhere is
    // not this one.
    await connection.query(
      `select pg_advisory_xact_lock(hashtextextended($1, 0))`,
      [`emails_written:${named(whom)}`],
    );
    const { rows } = await connection.query<{ written: string }>(
      `select count(*) as written
           from emails_written
          where written_to = $1 and written_at > $2`,
      [named(whom), since.toDate()],
    );
    // Postgres counts in bigint, which comes back as text so that a count
    // larger than a number can hold is not quietly rounded on the way.
    return Number(rows[0]?.written ?? 0);
  }
}
