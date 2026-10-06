import type { Projection } from "../../application/common/Projection.js";
import type {
  CommentaryChanged,
  CommentaryListed,
  TournamentCommentaries,
} from "../../application/operations/tournaments/tournamentForReaders.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { CommentaryCommentAdded } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryCommentAdded.js";
import { CommentaryCommentEdited } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryCommentEdited.js";
import { CommentaryStarted } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryStarted.js";
import { CommentaryTitleChanged } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryTitleChanged.js";
import type { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

/**
 * A tournament's commentaries, kept in step with every append, with their
 * titles, slugs, writers and when each last changed, and never what their
 * comments say (CommentariesByTournament.feature): every page of a tournament
 * asks this, and starting a commentary asks it which titles and slugs are
 * taken.
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
   * The tables made again from `events`, every one there is. A commentary's
   * row depends on its own stream, and whether its writer is forgotten on a
   * table of its own, so the streams can come in any order, as long as each
   * stream's own events come in the order they were kept.
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
        order by started_at desc, commentary_id`,
      [tournament.value],
    );
    return rows.map((row) => ({
      id: row.commentary_id,
      changedAt: ReadOnlyDate.from(row.changed_at),
    }));
  }

  async listed(tournament: TournamentId): Promise<readonly CommentaryListed[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      commentary_id: string;
      title: string;
      slug: string;
      writer_id: string;
      changed_at: Date;
    }>(
      `select commentary_id, title, slug, writer_id, changed_at
         from commentaries_by_tournament
        where tournament_id = $1
        order by started_at desc, commentary_id`,
      [tournament.value],
    );
    return rows.map((row) => ({
      id: row.commentary_id,
      title: row.title,
      slug: row.slug,
      writer: row.writer_id,
      changedAt: ReadOnlyDate.from(row.changed_at),
    }));
  }

  async at(
    tournament: TournamentId,
    slug: string,
  ): Promise<string | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ commentary_id: string }>(
        `select commentary_id from commentaries_by_tournament
          where tournament_id = $1 and slug = $2`,
        [tournament.value, slug],
      );
    return rows[0]?.commentary_id;
  }

  async taken(
    tournament: TournamentId,
    except?: string,
  ): Promise<{
    readonly titles: readonly string[];
    readonly slugs: readonly string[];
  }> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ title: string; slug: string }>(
        `select title, slug from commentaries_by_tournament
          where tournament_id = $1 and commentary_id is distinct from $2`,
        [tournament.value, except ?? null],
      );
    return {
      titles: rows.map(({ title }) => title),
      slugs: rows.map(({ slug }) => slug),
    };
  }

  // Each event's part, safe to run twice: a commentary started again is the
  // row it already has, a title is set to what the event says, and a later
  // moment is kept over an earlier one whichever comes first.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof CommentaryStarted) {
      const at = event.occurredAt.toDate();
      await connection.query(
        `insert into commentaries_by_tournament
                (commentary_id, tournament_id, title, slug, writer_id,
                 started_at, changed_at)
         values ($1, $2, $3, $4, $5, $6, $6)
         on conflict (commentary_id) do nothing`,
        [stream, event.tournamentId, event.title, event.slug, event.writer, at],
      );
    } else if (event instanceof CommentaryTitleChanged) {
      await connection.query(
        `update commentaries_by_tournament set title = $2
          where commentary_id = $1`,
        [stream, event.title],
      );
    } else if (
      event instanceof CommentaryCommentAdded ||
      event instanceof CommentaryCommentEdited
    ) {
      await connection.query(
        `update commentaries_by_tournament
            set changed_at = greatest(changed_at, $2)
          where commentary_id = $1`,
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
