import type { Projection } from "../../application/common/Projection.js";
import type {
  TournamentOfWebsite,
  TournamentWithSport,
  TournamentPlayed,
  TournamentsByWebsite as Asked,
} from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { CompetitionGameAdded } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameAdded.js";
import { CompetitionGameArchived } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameArchived.js";
import { CompetitionGameRestored } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameRestored.js";
import { BlockAdded } from "../../domain/aggregates/tournaments/events/BlockAdded.js";
import { CompetitionArchived } from "../../domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionRestored } from "../../domain/aggregates/tournaments/events/CompetitionRestored.js";
import { KnockoutAdded } from "../../domain/aggregates/tournaments/events/KnockoutAdded.js";
import { SwissAdded } from "../../domain/aggregates/tournaments/events/SwissAdded.js";
import { TestAdded } from "../../domain/aggregates/tournaments/events/TestAdded.js";
import { TournamentArchived } from "../../domain/aggregates/tournaments/events/TournamentArchived.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentRestored } from "../../domain/aggregates/tournaments/events/TournamentRestored.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import type { Sport } from "../../domain/aggregates/tournaments/value-objects/Sport.js";
import type { TournamentFilter } from "../../domain/aggregates/tournaments/value-objects/TournamentFilter.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../domain/common/Website.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

interface Row {
  tournament_id: string;
  name: string;
  starts: string;
  finishes: string;
  country: string;
  address: string;
}

// The days as text, since pg makes a date into a moment at midnight wherever
// the server happens to be, and a day is what is kept.
const COLUMNS = `t.tournament_id, t.name,
       to_char(t.starts, 'YYYY-MM-DD') as starts,
       to_char(t.finishes, 'YYYY-MM-DD') as finishes,
       t.country, t.address`;

// What the filter narrows by, as conditions on the tournaments' table from
// the parameter numbered `first` on, and the parameters themselves. Each is
// left out where nothing was chosen, rather than written to match anything,
// so that the index on the website and the start is still of use.
const narrowedBy = (
  filter: TournamentFilter,
  first: number,
): { readonly where: string; readonly values: readonly string[] } => {
  const chosen = [
    ["country", filter.country?.code],
    ["region", filter.region?.code],
    ["sport", filter.sport?.code],
  ] as const;
  const conditions: string[] = [];
  const values: string[] = [];
  for (const [column, value] of chosen) {
    if (value === undefined) continue;
    values.push(value);
    conditions.push(`and t.${column} = $${String(first + values.length - 1)}`);
  }
  return { where: conditions.join(" "), values };
};

const listed = (row: Row): TournamentOfWebsite => ({
  id: row.tournament_id,
  name: row.name,
  starts: row.starts,
  finishes: row.finishes,
  country: row.country,
  address: row.address,
});

/**
 * The tournaments of each website, kept in step with every append, so that
 * the home page can list those played lately and those about to start, and
 * the years there are tournaments in, without replaying every tournament
 * there is.
 *
 * Games are added to a competition, whose events do not say which tournament
 * it is in, and the tournament's do. So which tournament each competition is
 * in, and each competition's games, are kept apart and put together when
 * asked, which lets a competition's games be projected before the tournament
 * that has it.
 */
export class TournamentsByWebsite implements Projection, Asked {
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
    await this.unitOfWork.connection().query(
      `truncate tournaments_by_website, tournaments_by_website_competitions,
                  tournaments_by_website_games`,
    );
  }

  /**
   * The tables made again from the streams it is handed, one at a time.
   * Nothing one stream writes depends on another's having been written first,
   * so the streams can come in any order, as long as each stream's own events
   * come in the order they were kept, which reading them back gives.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, event);
  }

  async playedSince(
    website: Website,
    since: ReadOnlyDate,
    filter: TournamentFilter,
  ): Promise<readonly TournamentPlayed[]> {
    const narrowed = narrowedBy(filter, 3);
    const { rows } = await this.unitOfWork
      .connection()
      .query<Row & { last_played: Date }>(
        `select ${COLUMNS}, max(g.added_at) as last_played
           from tournaments_by_website t
           join tournaments_by_website_competitions c
             on c.tournament_id = t.tournament_id and not c.archived
           join tournaments_by_website_games g
             on g.competition_id = c.competition_id and not g.archived
          where t.website = $1 and not t.archived ${narrowed.where}
          group by t.tournament_id
         having max(g.added_at) >= $2
          order by last_played desc, t.name`,
        [website.host, since.toISOString(), ...narrowed.values],
      );
    return rows.map((row) => ({
      ...listed(row),
      lastPlayed: ReadOnlyDate.from(row.last_played),
    }));
  }

  async startingBetween(
    website: Website,
    first: string,
    last: string,
    filter: TournamentFilter,
  ): Promise<readonly TournamentOfWebsite[]> {
    const narrowed = narrowedBy(filter, 4);
    const { rows } = await this.unitOfWork.connection().query<Row>(
      `select ${COLUMNS}
           from tournaments_by_website t
          where t.website = $1 and not t.archived
            and t.starts between $2 and $3 ${narrowed.where}
          order by t.starts, t.name`,
      [website.host, first, last, ...narrowed.values],
    );
    return rows.map(listed);
  }

  async withSports(): Promise<readonly TournamentWithSport[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<Row & { sport: string }>(
        `select ${COLUMNS}, t.sport
           from tournaments_by_website t
          where not t.archived
          order by t.starts, t.name`,
      );
    return rows.map((row) => ({ ...listed(row), sport: row.sport }));
  }

  async yearsOf(website: Website, sport?: Sport): Promise<readonly number[]> {
    const { rows } = await this.unitOfWork.connection().query<{ year: number }>(
      `select distinct extract(year from starts)::int as year
           from tournaments_by_website
          where website = $1 and not archived
            and ($2::text is null or sport = $2)
          order by year desc`,
      [website.host, sport?.code ?? null],
    );
    return rows.map(({ year }) => year);
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof TournamentCreated) {
      await connection.query(
        `insert into tournaments_by_website
           (tournament_id, website, name, starts, finishes, country, region,
            sport, address)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         on conflict (tournament_id) do update
           set name = excluded.name, starts = excluded.starts,
               finishes = excluded.finishes, country = excluded.country,
               region = excluded.region, sport = excluded.sport,
               address = excluded.address`,
        [
          stream,
          event.website,
          event.name,
          event.starts,
          event.finishes,
          event.country,
          event.region ?? null,
          event.sport,
          event.address,
        ],
      );
    } else if (event instanceof TournamentUpdated) {
      await connection.query(
        `update tournaments_by_website
            set name = $2, starts = $3, finishes = $4, country = $5,
                region = $6, sport = $7, address = $8
          where tournament_id = $1`,
        [
          stream,
          event.name,
          event.starts,
          event.finishes,
          event.country,
          event.region ?? null,
          event.sport,
          event.address,
        ],
      );
    } else if (event instanceof TournamentArchived) {
      await this.#archived("tournaments_by_website", "tournament_id", [
        stream,
        true,
      ]);
    } else if (event instanceof TournamentRestored) {
      await this.#archived("tournaments_by_website", "tournament_id", [
        stream,
        false,
      ]);
    } else if (
      event instanceof BlockAdded ||
      event instanceof KnockoutAdded ||
      event instanceof SwissAdded ||
      event instanceof TestAdded
    ) {
      await connection.query(
        `insert into tournaments_by_website_competitions
           (competition_id, tournament_id)
         values ($1, $2)
         on conflict (competition_id) do nothing`,
        [event.competitionId, stream],
      );
    } else if (event instanceof CompetitionArchived) {
      await this.#archived(
        "tournaments_by_website_competitions",
        "competition_id",
        [event.competitionId, true],
      );
    } else if (event instanceof CompetitionRestored) {
      await this.#archived(
        "tournaments_by_website_competitions",
        "competition_id",
        [event.competitionId, false],
      );
    } else if (event instanceof CompetitionGameAdded) {
      // When it was added is kept as it was first projected, and so is
      // whether it is archived, since a game is added once and projecting it
      // again is not adding it again.
      await connection.query(
        `insert into tournaments_by_website_games
           (competition_id, game_id, added_at)
         values ($1, $2, $3)
         on conflict (competition_id, game_id) do nothing`,
        [stream, event.gameId, event.occurredAt.toISOString()],
      );
    } else if (event instanceof CompetitionGameArchived) {
      await this.#gameArchived(stream, event.gameId, true);
    } else if (event instanceof CompetitionGameRestored) {
      await this.#gameArchived(stream, event.gameId, false);
    }
  }

  async #archived(
    table: string,
    key: string,
    [id, archived]: readonly [string, boolean],
  ): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`update ${table} set archived = $2 where ${key} = $1`, [
        id,
        archived,
      ]);
  }

  async #gameArchived(
    competition: string,
    game: string,
    archived: boolean,
  ): Promise<void> {
    await this.unitOfWork.connection().query(
      `update tournaments_by_website_games set archived = $3
        where competition_id = $1 and game_id = $2`,
      [competition, game, archived],
    );
  }
}
