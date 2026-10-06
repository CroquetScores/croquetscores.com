import type { Projection } from "../../application/common/Projection.js";
import type {
  ManagerNoteHeading,
  TournamentManagerNotes,
} from "../../application/operations/tournaments/managerNoteOperations.js";
import { ManagerNoteAdded } from "../../domain/aggregates/tournaments/manager-notes/events/ManagerNoteAdded.js";
import { ManagerNoteDeleted } from "../../domain/aggregates/tournaments/manager-notes/events/ManagerNoteDeleted.js";
import { ManagerNoteEdited } from "../../domain/aggregates/tournaments/manager-notes/events/ManagerNoteEdited.js";
import type { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

/**
 * The notes of each tournament, kept in step with every append, with their
 * titles, their slugs and when each was written and last changed, and never
 * what they say
 * (ManagerNotesByTournament.feature): a description may be 750,000
 * characters, and every page of a tournament asks this.
 */
export class ManagerNotesByTournament
  implements Projection, TournamentManagerNotes
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
   * The table made again from `events`, every one there is. A note's row
   * depends on its own stream alone, so the streams can come in any order, as
   * long as each stream's own events come in the order they were kept.
   */
  async rebuildFrom(events: readonly StoredEvent[]): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`truncate manager_notes_by_tournament`);
    for (const { stream, event } of events) await this.#project(stream, event);
  }

  async of(tournament: TournamentId): Promise<readonly ManagerNoteHeading[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      note_id: string;
      title: string;
      slug: string;
      written_at: Date;
      changed_at: Date;
    }>(
      `select note_id, title, slug, written_at, changed_at
         from manager_notes_by_tournament
        where tournament_id = $1 and not deleted
        order by written_at desc, made desc`,
      [tournament.value],
    );
    return rows.map((row) => ({
      id: row.note_id,
      title: row.title,
      slug: row.slug,
      writtenAt: ReadOnlyDate.from(row.written_at),
      changedAt: ReadOnlyDate.from(row.changed_at),
    }));
  }

  async noteAt(
    tournament: TournamentId,
    slug: string,
  ): Promise<string | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ note_id: string }>(
        `select note_id from manager_notes_by_tournament
          where tournament_id = $1 and slug = $2 and not deleted`,
        [tournament.value, slug],
      );
    return rows[0]?.note_id;
  }

  async slugsTakenIn(tournament: TournamentId): Promise<readonly string[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ slug: string }>(
        `select slug from manager_notes_by_tournament where tournament_id = $1`,
        [tournament.value],
      );
    return rows.map(({ slug }) => slug);
  }

  // Each event's part, safe to run twice: a note added again is the row it
  // already has, and an edit or a delete again leaves what it left.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof ManagerNoteAdded) {
      const at = event.occurredAt.toDate();
      await connection.query(
        `insert into manager_notes_by_tournament
                (note_id, tournament_id, title, slug, written_at, changed_at)
         values ($1, $2, $3, $4, $5, $5)
         on conflict (note_id) do nothing`,
        [stream, event.tournamentId, event.title, event.slug, at],
      );
    } else if (event instanceof ManagerNoteEdited) {
      await connection.query(
        `update manager_notes_by_tournament
            set title = $2, changed_at = $3
          where note_id = $1`,
        [stream, event.title, event.occurredAt.toDate()],
      );
    } else if (event instanceof ManagerNoteDeleted) {
      // Kept, marked, so that its slug stays taken.
      await connection.query(
        `update manager_notes_by_tournament set deleted = true
          where note_id = $1`,
        [stream],
      );
    }
  }
}
