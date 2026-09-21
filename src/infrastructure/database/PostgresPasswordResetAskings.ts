// How often each IP address has asked for a way back in, in Postgres. Written
// down as each asking is made, under a lock held by the address, and answered
// with whether it was let through.
import type { PasswordResetAskings } from "../../application/services/PasswordResetAskings.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "./UnitOfWork.js";

const AN_HOUR = 60 * 60 * 1000;

export class PostgresPasswordResetAskings implements PasswordResetAskings {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async ask(
    ipAddress: string,
    at: ReadOnlyDate,
    most: number,
  ): Promise<boolean> {
    const connection = this.unitOfWork.connection();
    // The transaction's, so it is let go when the asking is kept or given up
    // and cannot be left held.
    await connection.query(
      `select pg_advisory_xact_lock(hashtextextended($1, 0))`,
      [`password_reset_askings:${ipAddress}`],
    );
    const since = new Date(at.toDate().getTime() - AN_HOUR);
    const { rows } = await connection.query<{ asked: string }>(
      `select count(*) as asked from password_reset_askings
        where ip_address = $1 and asked_at > $2`,
      [ipAddress, since],
    );
    // Postgres counts in bigint, which comes back as text.
    if (Number(rows[0]?.asked ?? 0) >= most) return false;

    await connection.query(
      `insert into password_reset_askings (ip_address, asked_at) values ($1, $2)`,
      [ipAddress, at.toDate()],
    );
    return true;
  }
}
