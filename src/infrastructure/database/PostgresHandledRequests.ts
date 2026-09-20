// The requests already carried out, kept in Postgres in the transaction of the
// request itself, so that an id is remembered if and only if the work it names
// was kept.
import type { HandledRequests } from "../../application/services/HandledRequests.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "./UnitOfWork.js";

/**
 * How long a claim is remembered. Long enough to outlast the longest gap
 * between a request being sent and sent again — a button pressed twice is
 * seconds, a page gone back to is minutes, an app holding a request until it
 * has a connection again can be hours — and the same as the life of the link
 * registering emails, since a request arriving later than its link lasted is
 * not that request finishing.
 */
const REMEMBERED_FOR_HOURS = 24;

const AN_HOUR = 60 * 60 * 1000;

export class PostgresHandledRequests implements HandledRequests {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  /**
   * Claiming is the insert: the primary key is what decides, so two requests
   * with the same id sent at once cannot both be claimed, however they are
   * interleaved. The second inserts nothing and is told so by the row count,
   * rather than by asking first and inserting after, which would let both
   * through between the asking and the inserting.
   *
   * What has gone stale is taken out first, by this request's own moment, as
   * sending what is queued takes out the emails given up long enough ago.
   * First rather than after, because a stale claim of this very id has to be
   * gone before the insert or the insert would conflict with it and this
   * request would be told it had already happened.
   */
  async claim(requestId: string, at: ReadOnlyDate): Promise<boolean> {
    await this.forget(at);
    const { rowCount } = await this.unitOfWork.connection().query(
      `insert into handled_requests (request_id, handled_at)
         values ($1, $2)
         on conflict (request_id) do nothing`,
      [requestId, at.toDate()],
    );
    return rowCount === 1;
  }

  // Older than the window, not as old as it: a claim made exactly that long
  // ago is still remembered, so that the boundary is somewhere rather than
  // wherever the clock happened to land.
  private async forget(at: ReadOnlyDate): Promise<void> {
    const oldest = new Date(
      at.toDate().getTime() - REMEMBERED_FOR_HOURS * AN_HOUR,
    );
    await this.unitOfWork
      .connection()
      .query(`delete from handled_requests where handled_at < $1`, [oldest]);
  }
}
