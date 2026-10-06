import type { Projection } from "../../application/common/Projection.js";
import type {
  CommentaryChanged,
  TournamentCommentaries,
} from "../../application/operations/tournaments/tournamentForReaders.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { CommentaryCommentAdded } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryCommentAdded.js";
import { CommentaryCommentEdited } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryCommentEdited.js";
import { TournamentCommentaryStarted } from "../../domain/aggregates/tournaments/events/TournamentCommentaryStarted.js";
import type { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

/**
 * When each of a tournament's commentaries last changed, kept in step with
 * every append, and never what its comments say
 * (CommentariesByTournament.feature): every page of a tournament asks this to
 * mark its Commentary section by.
 */
export class CommentariesByTournament
  implements Projection, TournamentCommentaries
{
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const event of events) await this.#project(stream.value, event);
  }

  /**
   * The tables made again from `events`, every one there is. A commentary is
   * heard of from its tournament's stream, its own and its writer's, and
   * nothing one of them writes depends on another's having been written first,
   * so the streams can come in any order.
   */
  async rebuildFrom(events: readonly StoredEvent[]): Promise<void> {
    await this.unitOfWork.connection().query(
      `truncate commentaries_by_tournament,
                  commentaries_by_tournament_forgotten`,
    );
    for (const { stream, event } of events) await this.#project(stream, event);
  }

  async of(tournament: TournamentId): Promise<readonly CommentaryChanged[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      commentary_id: string;
      changed_at: Date;
    }>(
      `select commentary_id, changed_at
         from commentaries_by_tournament c
        where tournament_id = $1
          and not exists (
                select 1 from commentaries_by_tournament_forgotten f
                 where f.account_id = c.writer_id)
        order by changed_at desc, commentary_id`,
      [tournament.value],
    );
    return rows.map((row) => ({
      id: row.commentary_id,
      changedAt: ReadOnlyDate.from(row.changed_at),
    }));
  }

  // Each event's part, safe to run twice: a later moment is kept over an
  // earlier one whichever comes first, and a commentary's tournament and
  // writer are the same however often they are said.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof TournamentCommentaryStarted) {
      await connection.query(
        `insert into commentaries_by_tournament
                (commentary_id, tournament_id, writer_id, changed_at)
         values ($1, $2, $3, $4)
         on conflict (commentary_id) do update
            set tournament_id = excluded.tournament_id,
                writer_id = excluded.writer_id,
                changed_at = greatest(commentaries_by_tournament.changed_at,
                                      excluded.changed_at)`,
        [
          event.commentaryId,
          stream,
          event.createdBy.value,
          event.occurredAt.toDate(),
        ],
      );
    } else if (
      event instanceof CommentaryCommentAdded ||
      event instanceof CommentaryCommentEdited
    ) {
      await connection.query(
        `insert into commentaries_by_tournament (commentary_id, changed_at)
         values ($1, $2)
         on conflict (commentary_id) do update
            set changed_at = greatest(commentaries_by_tournament.changed_at,
                                      excluded.changed_at)`,
        [stream, event.occurredAt.toDate()],
      );
    } else if (event instanceof AccountForgotten) {
      await connection.query(
        `insert into commentaries_by_tournament_forgotten (account_id)
         values ($1) on conflict (account_id) do nothing`,
        [stream],
      );
    }
  }
}
