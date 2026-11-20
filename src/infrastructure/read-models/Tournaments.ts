import type { Projection } from "../../application/common/Projection.js";
import { BlockAdded } from "../../domain/aggregates/tournaments/events/BlockAdded.js";
import { BlockUpdated } from "../../domain/aggregates/tournaments/events/BlockUpdated.js";
import { CompetitionArchived } from "../../domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionRestored } from "../../domain/aggregates/tournaments/events/CompetitionRestored.js";
import { KnockoutAdded } from "../../domain/aggregates/tournaments/events/KnockoutAdded.js";
import { KnockoutUpdated } from "../../domain/aggregates/tournaments/events/KnockoutUpdated.js";
import { SwissAdded } from "../../domain/aggregates/tournaments/events/SwissAdded.js";
import { SwissUpdated } from "../../domain/aggregates/tournaments/events/SwissUpdated.js";
import { TeamArchived } from "../../domain/aggregates/tournaments/events/TeamArchived.js";
import { TeamPlayerArchived } from "../../domain/aggregates/tournaments/events/TeamPlayerArchived.js";
import { TeamPlayerRestored } from "../../domain/aggregates/tournaments/events/TeamPlayerRestored.js";
import { TeamPlayerUpdated } from "../../domain/aggregates/tournaments/events/TeamPlayerUpdated.js";
import { TeamRestored } from "../../domain/aggregates/tournaments/events/TeamRestored.js";
import { TeamUpdated } from "../../domain/aggregates/tournaments/events/TeamUpdated.js";
import { TestAdded } from "../../domain/aggregates/tournaments/events/TestAdded.js";
import { TournamentPlayerArchived } from "../../domain/aggregates/tournaments/events/TournamentPlayerArchived.js";
import { TournamentPlayerRestored } from "../../domain/aggregates/tournaments/events/TournamentPlayerRestored.js";
import { TournamentPlayerUpdated } from "../../domain/aggregates/tournaments/events/TournamentPlayerUpdated.js";
import { TestUpdated } from "../../domain/aggregates/tournaments/events/TestUpdated.js";
import { TournamentArchived } from "../../domain/aggregates/tournaments/events/TournamentArchived.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentRestored } from "../../domain/aggregates/tournaments/events/TournamentRestored.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

// The competition a tournament's event is about, where it is about one.
const competitionOf = (event: DomainEvent): string | undefined => {
  const { competitionId } = event as { readonly competitionId?: unknown };
  return typeof competitionId === "string" ? competitionId : undefined;
};

// What a competition's answers say that is not in its own events: the
// tournament's days and address, and the names of the players and teams.
// Archiving or restoring one may change what is shown, since which players are
// in use is told, so those are here. Adding or moving a player or a team
// changes none of them: none is in a competition until it is entered, and that
// is the competition's own event.
const changesWhatIsToldOfCompetitions = (event: DomainEvent): boolean =>
  event instanceof TournamentUpdated ||
  event instanceof TournamentPlayerUpdated ||
  event instanceof TournamentPlayerArchived ||
  event instanceof TournamentPlayerRestored ||
  event instanceof TeamUpdated ||
  event instanceof TeamArchived ||
  event instanceof TeamRestored ||
  event instanceof TeamPlayerUpdated ||
  event instanceof TeamPlayerArchived ||
  event instanceof TeamPlayerRestored;

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
 * What a tournament and its competitions are is written from the tournament's
 * own stream, since a competition's events do not say which tournament it is
 * in and its tournament's do. A competition's own events say only when it last
 * changed. They may be projected before its tournament's, which makes its row
 * with no tournament until the tournament's events say which it is in, and the
 * tournament takes the time then. So no stream has to come before another in
 * a rebuild, but a competition's `tournament_id` can be empty until it has.
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

  // A tournament's events are written to the tournament and, where they are
  // about a competition, to it; a competition's own events say only when it
  // last changed, since they do not say which tournament it is in.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    if (stream.startsWith("competition/")) {
      await this.#competitionChanged(stream, event);
      return;
    }
    await this.#projectTournament(stream, event);
    if (stream.startsWith("tournament/")) {
      await this.#tournamentChanged(stream, event);
    }
  }

  // When a tournament last changed is when the newest event of its own stream
  // happened, or of any of its competitions'. A competition's, when the newest
  // event of its own stream, or of its tournament's that is about it, or that
  // changes what is told of every one of them. Each written with the greater
  // of what is there and the event's moment, so that writing it twice, or in
  // another order, leaves what writing it once did.
  async #tournamentChanged(
    tournament: string,
    event: DomainEvent,
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    const at = event.occurredAt.toISOString();
    await connection.query(
      `update tournaments set changed_at = greatest(changed_at, $2)
        where tournament_id = $1`,
      [tournament, at],
    );
    const competition = competitionOf(event);
    if (competition !== undefined) {
      await connection.query(
        `update competitions set changed_at = greatest(changed_at, $2)
          where competition_id = $1`,
        [competition, at],
      );
      // What the competition's own events said before it was linked to this
      // tournament is the tournament's to hear of now.
      await connection.query(
        `update tournaments t set changed_at = greatest(t.changed_at, c.changed_at)
           from competitions c
          where c.competition_id = $2 and t.tournament_id = $1`,
        [tournament, competition],
      );
    } else if (changesWhatIsToldOfCompetitions(event)) {
      // Which of its competitions a player is entered in is not held here, so
      // it is every one of them: never earlier than it truly was.
      await connection.query(
        `update competitions set changed_at = greatest(changed_at, $2)
          where tournament_id = $1`,
        [tournament, at],
      );
    }
  }

  // A competition's own events are heard of whichever order the streams come
  // in, so its row is made here if the tournament's events have not made it,
  // with no tournament until they do.
  async #competitionChanged(
    competition: string,
    event: DomainEvent,
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    const at = event.occurredAt.toISOString();
    await connection.query(
      `insert into competitions (competition_id, changed_at)
       values ($1, $2)
       on conflict (competition_id) do update
         set changed_at = greatest(competitions.changed_at, excluded.changed_at)`,
      [competition, at],
    );
    await connection.query(
      `update tournaments set changed_at = greatest(changed_at, $2)
        where tournament_id = (select tournament_id from competitions
                                where competition_id = $1)`,
      [competition, at],
    );
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  async #projectTournament(
    tournament: string,
    event: DomainEvent,
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof TournamentCreated) {
      // The website is written only here, since a tournament keeps the one it
      // was created on however it is updated afterwards.
      await connection.query(
        `insert into tournaments
           (tournament_id, website, name, starts, finishes, address, country,
            region, sport, national, international, changed_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
          event.occurredAt.toISOString(),
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
      // reason. Its own events may have been projected first, which made its
      // row with no tournament: this is what says which it is in.
      await connection.query(
        `insert into competitions
           (competition_id, tournament_id, world_rankings, changed_at)
         values ($1, $2, $3, $4)
         on conflict (competition_id) do update
           set tournament_id = excluded.tournament_id,
               world_rankings = excluded.world_rankings,
               changed_at = greatest(competitions.changed_at,
                                     excluded.changed_at)
         where competitions.tournament_id is null`,
        [
          event.competitionId,
          tournament,
          event.worldRankings,
          event.occurredAt.toISOString(),
        ],
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
