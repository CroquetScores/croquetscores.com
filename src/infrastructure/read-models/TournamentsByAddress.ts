import type { Projection } from "../../application/common/Projection.js";
import type { TournamentAddresses } from "../../application/operations/tournaments/tournamentOperations.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Sport } from "../../domain/aggregates/tournaments/value-objects/Sport.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

// Where a tournament is in the years: the one it is in, the one it was in
// before it came into that, and when it came into it.
interface Years {
  readonly year: number;
  readonly previous: number | undefined;
  readonly at: string;
}

// The year a tournament starts in, which is the year the list of a year finds
// it in and the year the tournaments table holds it under (its start is the
// date the table keeps). Said loudly where it is not one, since a year that is
// not a number would otherwise fail the append at the insert with no word of
// which tournament it was.
const yearOf = (starts: string): number => {
  const year = Number(starts.slice(0, 4));
  if (!Number.isInteger(year)) {
    throw new Error(`The start ${starts} does not begin with a year.`);
  }
  return year;
};

/**
 * Every address a tournament has ever been found at, kept in step with every
 * append, so that no address is ever given to two tournaments. An address stays
 * after its tournament has moved on, since an old link still leads there.
 *
 * It keeps the year each tournament is in beside them, and the one it was in
 * before, since the addresses cannot say what came before the last one when a
 * tournament moves back to one it had.
 */
export class TournamentsByAddress implements Projection, TournamentAddresses {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    await this.#project(stream.value, events);
    await this.#keepYears(
      stream.value,
      events,
      await this.#yearsOf(stream.value),
    );
  }

  async #yearsOf(stream: string): Promise<Years | undefined> {
    const { rows } = await this.unitOfWork.connection().query<{
      year: number;
      previous_year: number | null;
      changed_at: Date;
    }>(
      `select year, previous_year, changed_at
         from tournament_years where tournament_id = $1`,
      [stream],
    );
    const row = rows[0];
    return row === undefined
      ? undefined
      : {
          year: row.year,
          previous: row.previous_year ?? undefined,
          at: row.changed_at.toISOString(),
        };
  }

  // Worked out in memory from where the tournament was and written once, so
  // that making it again reads nothing and a rebuild's writes stay together.
  async #keepYears(
    stream: string,
    events: readonly DomainEvent[],
    from: Years | undefined,
  ): Promise<void> {
    let now = from;
    for (const event of events) {
      if (
        !(event instanceof TournamentCreated) &&
        !(event instanceof TournamentUpdated)
      ) {
        continue;
      }
      const year = yearOf(event.starts);
      const at = event.occurredAt.toISOString();
      if (now === undefined) now = { year, previous: undefined, at };
      else if (year !== now.year) {
        now = { year, previous: now.year, at };
      }
    }
    if (now === undefined || now === from) return;
    await this.unitOfWork.connection().query(
      `insert into tournament_years
         (tournament_id, year, previous_year, changed_at)
       values ($1, $2, $3, $4)
       on conflict (tournament_id) do update
         set year = excluded.year,
             previous_year = excluded.previous_year,
             changed_at = excluded.changed_at`,
      [stream, now.year, now.previous ?? null, now.at],
    );
  }

  async #project(
    stream: string,
    events: readonly DomainEvent[],
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    for (const event of events) {
      if (
        !(event instanceof TournamentCreated) &&
        !(event instanceof TournamentUpdated)
      ) {
        continue;
      }
      // A tournament found where it was found before already holds the
      // address. One found where another tournament was, which two requests
      // at once could each have decided without seeing the other, is refused
      // by the key, and the whole append with it.
      await connection.query(
        `insert into tournaments_by_address
           (address, tournament_id, changed_at)
         values ($1, $2, $3)
         -- Said again, the address is held as it was, so its moment is too.
         on conflict (address) do update set address = excluded.address
           where tournaments_by_address.tournament_id = excluded.tournament_id`,
        [event.address, stream, event.occurredAt.toISOString()],
      );
      const { rows } = await connection.query<{ tournament_id: string }>(
        `select tournament_id from tournaments_by_address where address = $1`,
        [event.address],
      );
      if (rows[0]?.tournament_id !== stream) {
        throw new Error(
          `${event.address} already leads to another tournament.`,
        );
      }
    }
  }

  /** Empties its tables, so that every stream can be handed to it again. */
  async clear(): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`truncate tournaments_by_address, tournament_years`);
  }

  /**
   * Makes the table again from the streams it is handed, one at a time, each
   * event projected as it was when it was appended. An address once held is
   * held for good, so the tournament that holds it is the same whichever
   * stream is read first.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, [event]);
    await this.#keepYears(
      stream,
      events.map(({ event }) => event),
      undefined,
    );
  }

  async tournamentAt(address: string): Promise<TournamentId | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ tournament_id: string }>(
        `select tournament_id from tournaments_by_address where address = $1`,
        [address],
      );
    const found = rows[0]?.tournament_id;
    return found === undefined ? undefined : TournamentId.from(found);
  }

  async takenIn(
    year: number,
    sport: Sport,
    tournament: TournamentId,
  ): Promise<ReadonlySet<string>> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ address: string }>(
        `select address from tournaments_by_address
          where address like $1 and tournament_id <> $2`,
        [`${year}/${sport.code}/%`, tournament.value],
      );
    return new Set(rows.map(({ address }) => address));
  }
}
