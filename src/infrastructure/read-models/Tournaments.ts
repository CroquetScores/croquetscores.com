import type { Projection } from "../../application/common/Projection.js";
import { BlockAdded } from "../../domain/aggregates/tournaments/events/BlockAdded.js";
import { BlockUpdated } from "../../domain/aggregates/tournaments/events/BlockUpdated.js";
import { CompetitionArchived } from "../../domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionRestored } from "../../domain/aggregates/tournaments/events/CompetitionRestored.js";
import { KnockoutAdded } from "../../domain/aggregates/tournaments/events/KnockoutAdded.js";
import { KnockoutUpdated } from "../../domain/aggregates/tournaments/events/KnockoutUpdated.js";
import { SwissAdded } from "../../domain/aggregates/tournaments/events/SwissAdded.js";
import { SwissUpdated } from "../../domain/aggregates/tournaments/events/SwissUpdated.js";
import { TestAdded } from "../../domain/aggregates/tournaments/events/TestAdded.js";
import { TestUpdated } from "../../domain/aggregates/tournaments/events/TestUpdated.js";
import { TournamentArchived } from "../../domain/aggregates/tournaments/events/TournamentArchived.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentRestored } from "../../domain/aggregates/tournaments/events/TournamentRestored.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

/**
 * What every read model of tournaments is built on: each tournament once,
 * with what is true of it whoever asks, and each competition once, with the
 * tournament it is in. The home page's list, the admin's and the search join
 * to these and keep beside them only what is theirs alone, so that a
 * tournament changed is one row changed rather than one in each of them.
 *
 * It asks nothing itself. It is a read model that other read models are
 * written against, which is why it is projected and rebuilt with them and is
 * emptied before they are asked for anything.
 *
 * Everything here is written from a tournament's own stream, since a
 * competition's events do not say which tournament it is in and its
 * tournament's do. So no stream has to come before another in a rebuild.
 */
export class Tournaments implements Projection {
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
      .query(`truncate tournaments, competitions`);
  }

  /** The tables made again from the streams it is handed, in any order. */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, event);
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  async #project(tournament: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof TournamentCreated) {
      // The website is written only here, since a tournament keeps the one it
      // was created on however it is updated afterwards.
      await connection.query(
        `insert into tournaments
           (tournament_id, website, name, starts, finishes, address, country,
            region, sport, national, international)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         on conflict (tournament_id) do update
           set name = excluded.name, starts = excluded.starts,
               finishes = excluded.finishes, address = excluded.address,
               country = excluded.country, region = excluded.region,
               sport = excluded.sport, national = excluded.national,
               international = excluded.international`,
        [
          tournament,
          event.website,
          event.name,
          event.starts,
          event.finishes,
          event.address,
          event.country,
          event.region ?? null,
          event.sport,
          event.national,
          event.international,
        ],
      );
    } else if (event instanceof TournamentUpdated) {
      await connection.query(
        `update tournaments
            set name = $2, starts = $3, finishes = $4, address = $5,
                country = $6, region = $7, sport = $8, national = $9,
                international = $10
          where tournament_id = $1`,
        [
          tournament,
          event.name,
          event.starts,
          event.finishes,
          event.address,
          event.country,
          event.region ?? null,
          event.sport,
          event.national,
          event.international,
        ],
      );
    } else if (event instanceof TournamentArchived) {
      await this.#tournamentArchived(tournament, true);
    } else if (event instanceof TournamentRestored) {
      await this.#tournamentArchived(tournament, false);
    } else if (
      event instanceof BlockAdded ||
      event instanceof KnockoutAdded ||
      event instanceof SwissAdded ||
      event instanceof TestAdded
    ) {
      // Kept as it is first projected, since a competition is added once and
      // its rules are changed by the events that update it. A competition
      // archived before this is projected again stays archived for the same
      // reason.
      await connection.query(
        `insert into competitions
           (competition_id, tournament_id, world_rankings)
         values ($1, $2, $3)
         on conflict (competition_id) do nothing`,
        [event.competitionId, tournament, event.worldRankings],
      );
    } else if (
      event instanceof BlockUpdated ||
      event instanceof KnockoutUpdated ||
      event instanceof SwissUpdated ||
      event instanceof TestUpdated
    ) {
      await connection.query(
        `update competitions set world_rankings = $2
          where competition_id = $1`,
        [event.competitionId, event.worldRankings],
      );
    } else if (event instanceof CompetitionArchived) {
      await this.#competitionArchived(event.competitionId, true);
    } else if (event instanceof CompetitionRestored) {
      await this.#competitionArchived(event.competitionId, false);
    }
  }

  async #tournamentArchived(
    tournament: string,
    archived: boolean,
  ): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`update tournaments set archived = $2 where tournament_id = $1`, [
        tournament,
        archived,
      ]);
  }

  async #competitionArchived(
    competition: string,
    archived: boolean,
  ): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(
        `update competitions set archived = $2 where competition_id = $1`,
        [competition, archived],
      );
  }
}
