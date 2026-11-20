import type { Projection } from "../../application/common/Projection.js";
import type {
  CommentaryChanged,
  CommentaryListed,
  CommentaryRead,
  TournamentCommentaries,
} from "../../application/operations/tournaments/tournamentForReaders.js";
import { CommentaryCommentAdded } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryCommentAdded.js";
import { CommentaryCommentDeleted } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryCommentDeleted.js";
import { CommentaryCommentEdited } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryCommentEdited.js";
import { CommentaryStarted } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryStarted.js";
import { CommentaryTitleChanged } from "../../domain/aggregates/tournaments/commentaries/events/CommentaryTitleChanged.js";
import type { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

// A commentary's row as a rebuild works it out from its stream, before it is
// written.
interface Row {
  readonly tournamentId: string;
  title: string;
  readonly slug: string;
  readonly writerId: string;
  readonly startedAt: Date;
  changedAt: Date;
}

/**
 * A tournament's commentaries, kept in step with every append, with their
 * titles, slugs, writers and when each last changed, and beside them their
 * comments (CommentariesByTournament.feature). Every page of a tournament asks
 * for the commentaries and starting one asks which titles and slugs are taken,
 * and neither selects a comment: only `read`, for the one commentary a reader
 * opened, does.
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

  /** Empties its tables, so that every stream can be handed to it again. */
  async clear(): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`truncate commentaries_by_tournament, commentary_comments`);
  }

  /**
   * The tables made again from the streams it is handed, which can come in any
   * order, as long as each stream's own events come in the order they were
   * kept, since the store keeps no order between them.
   *
   * Each commentary's row is worked out from its whole stream before any is
   * written, rather than written event by event as `project` does. A title can
   * pass from one commentary to another, and no two ever hold it at once; but
   * written event by event, a stream taken before another could give a title
   * to the second while the first still held it, and the table refuses that.
   * Each as its stream leaves it, no two hold one title.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    let row: Row | undefined;
    for (const { event } of events) {
      if (event instanceof CommentaryStarted) {
        if (row !== undefined) continue;
        const at = event.occurredAt.toDate();
        row = {
          tournamentId: event.tournamentId,
          title: event.title,
          slug: event.slug,
          writerId: event.writer,
          startedAt: at,
          changedAt: at,
        };
      } else if (event instanceof CommentaryTitleChanged) {
        if (row !== undefined) row.title = event.title;
      } else if (
        event instanceof CommentaryCommentAdded ||
        event instanceof CommentaryCommentEdited
      ) {
        const at = event.occurredAt.toDate();
        if (row !== undefined && at > row.changedAt) row.changedAt = at;
      }
      // A comment's row is its own, so it can be written as its event comes.
      await this.#projectComment(stream, event);
    }
    if (row !== undefined) {
      await connection.query(
        `insert into commentaries_by_tournament
                (commentary_id, tournament_id, title, slug, writer_id,
                 started_at, changed_at)
         values ($1, $2, $3, $4, $5, $6, $7)`,
        [
          stream,
          row.tournamentId,
          row.title,
          row.slug,
          row.writerId,
          row.startedAt,
          row.changedAt,
        ],
      );
    }
  }

  async of(tournament: TournamentId): Promise<readonly CommentaryChanged[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      commentary_id: string;
      changed_at: Date;
    }>(
      `select commentary_id, changed_at
         from commentaries_by_tournament c
        where tournament_id = $1
          -- The writer's account as the accounts' read model has it, so that
          -- the commentary is not found once it is forgotten, whichever
          -- stream a rebuild took first.
          and not exists (
                select 1 from accounts_by_email_address a
                 where a.account_id = c.writer_id
                   and a.email_address_hash is null)
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

  async read(
    tournament: TournamentId,
    slug: string,
  ): Promise<CommentaryRead | undefined> {
    const connection = this.unitOfWork.connection();
    const found = await connection.query<{
      commentary_id: string;
      title: string;
      slug: string;
      writer_id: string;
    }>(
      `select commentary_id, title, slug, writer_id
         from commentaries_by_tournament
        where tournament_id = $1 and slug = $2`,
      [tournament.value, slug],
    );
    const [row] = found.rows;
    if (row === undefined) return undefined;
    const comments = await connection.query<{
      comment_id: string;
      text: string;
      created_at: Date;
      changed_at: Date;
    }>(
      `select comment_id, text, created_at, changed_at
         from commentary_comments
        where commentary_id = $1
        order by position`,
      [row.commentary_id],
    );
    return {
      id: row.commentary_id,
      title: row.title,
      slug: row.slug,
      writer: row.writer_id,
      comments: comments.rows.map((comment) => ({
        id: comment.comment_id,
        text: comment.text,
        writtenAt: ReadOnlyDate.from(comment.created_at),
        // A comment changes only by being edited, so one that has changed
        // since it was made was edited then.
        lastEditedAt:
          comment.changed_at > comment.created_at
            ? ReadOnlyDate.from(comment.changed_at)
            : undefined,
      })),
    };
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

  // Held by a lock of the tournament's own for the rest of the transaction
  // asking, taken before anything is read, so that a second asking waits for
  // the first's work to be kept and then reads what it took. A lock of the
  // transaction rather than of rows, since what is guarded is a title nobody
  // has yet, which no row holds.
  async taken(
    tournament: TournamentId,
    except?: string,
  ): Promise<{
    readonly titles: readonly string[];
    readonly slugs: readonly string[];
  }> {
    const connection = this.unitOfWork.connection();
    await connection.query("select pg_advisory_xact_lock(hashtext($1))", [
      `commentaries-taken:${tournament.value}`,
    ]);
    const { rows } = await connection.query<{ title: string; slug: string }>(
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
    await this.#projectComment(stream, event);
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
    }
  }

  // A comment kept as its events say, in the place it was first kept in. A
  // comment added again is the row it already has; an edit sets what the event
  // says, which is what the stream's last edit leaves when the whole stream is
  // given again in order; and a deleted comment is taken out, which a second
  // deleting finds already done.
  async #projectComment(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof CommentaryCommentAdded) {
      await connection.query(
        `insert into commentary_comments
                (commentary_id, comment_id, text, created_at, changed_at)
         values ($1, $2, $3, $4, $4)
         on conflict (commentary_id, comment_id) do nothing`,
        [stream, event.commentId, event.text, event.occurredAt.toDate()],
      );
    } else if (event instanceof CommentaryCommentEdited) {
      await connection.query(
        `update commentary_comments
            set text = $3, changed_at = $4
          where commentary_id = $1 and comment_id = $2`,
        [stream, event.commentId, event.text, event.occurredAt.toDate()],
      );
    } else if (event instanceof CommentaryCommentDeleted) {
      await connection.query(
        `delete from commentary_comments
          where commentary_id = $1 and comment_id = $2`,
        [stream, event.commentId],
      );
    }
  }
}
