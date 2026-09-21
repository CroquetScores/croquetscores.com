// The attempts at signing in that failed, in Postgres.
//
// An attempt is written down as it is made, under a lock held by the email
// address and by the address it came from, and forgotten again when it turns
// out to have worked. That is what makes the limit hold against somebody
// sending their guesses all at once: counting after the password had been
// checked would have every one of them count before any had been written.
//
// Nothing is deleted here but an attempt that worked. A row is small, and what
// keeps the table from growing without end is a maintenance task rather than
// the page that writes them: a delete on every signing in would make the
// common case pay for the rare one.
import type {
  FailedSignIns,
  MostAnHour,
  SignInAttempt,
} from "../../application/services/FailedSignIns.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "./UnitOfWork.js";

const AN_HOUR = 60 * 60 * 1000;

const held: SignInAttempt = { held: true, written: undefined };

export class PostgresFailedSignIns implements FailedSignIns {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async attempt(
    emailAddress: string,
    ipAddress: string,
    at: ReadOnlyDate,
    mostAnHour: MostAnHour,
  ): Promise<SignInAttempt> {
    const connection = this.unitOfWork.connection();

    // Both locks, always in this order, so that two attempts sharing one of
    // the two cannot each hold what the other is waiting for. They are the
    // transaction's, so they are let go when it ends and cannot be left held.
    // An advisory lock rather than rows locked for update, because the rows
    // that matter most are the ones not there yet.
    for (const name of [
      `failed_sign_ins:email_address:${emailAddress}`,
      `failed_sign_ins:ip_address:${ipAddress}`,
    ]) {
      await connection.query(
        `select pg_advisory_xact_lock(hashtextextended($1, 0))`,
        [name],
      );
    }

    const since = new Date(at.toDate().getTime() - AN_HOUR);
    const { rows } = await connection.query<{
      by_email_address: string;
      by_ip_address: string;
    }>(
      `select
         count(*) filter (where email_address = $1) as by_email_address,
         count(*) filter (where ip_address = $2) as by_ip_address
       from failed_sign_ins
      where failed_at > $3 and (email_address = $1 or ip_address = $2)`,
      [emailAddress, ipAddress, since],
    );
    const counted = rows[0];
    // Postgres counts in bigint, which comes back as text so that a count
    // larger than a number can hold is not quietly rounded on the way.
    if (
      Number(counted?.by_email_address ?? 0) >= mostAnHour.byEmailAddress ||
      Number(counted?.by_ip_address ?? 0) >= mostAnHour.byIpAddress
    ) {
      return held;
    }

    const written = await connection.query<{ id: string }>(
      `insert into failed_sign_ins (email_address, ip_address, failed_at)
       values ($1, $2, $3)
       returning id`,
      [emailAddress, ipAddress, at.toDate()],
    );
    return { held: false, written: written.rows[0]?.id };
  }

  async itWorked(written: string): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`delete from failed_sign_ins where id = $1`, [written]);
  }
}
