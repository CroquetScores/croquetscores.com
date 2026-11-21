import type {
  KeptEvent,
  TournamentEvents,
} from "../../application/services/TournamentEvents.js";
import type { TournamentId } from "../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/**
 * Every event kept of a tournament, read from the events themselves and not
 * from a read model, since what is wanted is what was kept: a manager note
 * that was deleted has gone from its read model and is still among the events.
 *
 * A competition is found by the id its tournament's events give it, and a
 * commentary or a manager note by the tournament its first event names. Both
 * are asked of the events, so that nothing here depends on a read model being
 * up to date, or being there to be rebuilt. Ordered by the number the database
 * gave each event as it was kept, which is the order across every stream.
 */
export class PostgresTournamentEvents implements TournamentEvents {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async of(tournament: TournamentId): Promise<readonly KeptEvent[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      stream_id: string;
      name: string;
      data: Record<string, unknown>;
    }>(
      `select e.stream_id, e.name, e.data
         from events e
        where e.stream_id = $1
           or e.stream_id in (
                select distinct t.data ->> 'competitionId'
                  from events t
                 where t.stream_id = $1
                   and t.data ->> 'competitionId' is not null)
           or e.stream_id in (
                select distinct n.stream_id
                  from events n
                 where n.data ->> 'tournamentId' = $1
                   and (n.stream_id like 'commentary/%'
                     or n.stream_id like 'manager-note/%'))
        order by e.id`,
      [tournament.value],
    );
    return rows.map((row) => ({
      kind: row.name,
      stream: row.stream_id,
      happenedAt:
        typeof row.data["occurredAt"] === "string"
          ? row.data["occurredAt"]
          : "",
      carried: row.data,
    }));
  }
}
