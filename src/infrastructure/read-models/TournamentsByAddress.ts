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

/**
 * Every address a tournament has ever been found at, kept in step with every
 * append, so that no address is ever given to two tournaments. An address stays
 * after its tournament has moved on, since an old link still leads there.
 */
export class TournamentsByAddress implements Projection, TournamentAddresses {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    await this.#project(stream.value, events);
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
        `insert into tournaments_by_address (address, tournament_id)
         values ($1, $2)
         on conflict (address) do update set address = excluded.address
           where tournaments_by_address.tournament_id = excluded.tournament_id`,
        [event.address, stream],
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

  /**
   * Makes the table again from `events`, every event there is, each projected
   * as it was when it was appended. An address once held is held for good, so
   * the tournament that holds it is the same whichever stream is read first.
   */
  async rebuildFrom(events: readonly StoredEvent[]): Promise<void> {
    await this.unitOfWork.connection().query(`truncate tournaments_by_address`);
    for (const { stream, event } of events) {
      await this.#project(stream, [event]);
    }
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
