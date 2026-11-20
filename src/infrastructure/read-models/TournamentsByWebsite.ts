import type { Projection } from "../../application/common/Projection.js";
import type {
  ChangesOfTournament,
  TournamentChanged,
  TournamentFingerprint,
  TournamentOfWebsite,
  TournamentPlayed,
  TournamentsByWebsite as Asked,
} from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { CompetitionGameAdded } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameAdded.js";
import { CompetitionGameArchived } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameArchived.js";
import { CompetitionGameCorrected } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameCorrected.js";
import { CompetitionGameMoved } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameMoved.js";
import { CompetitionGameRestored } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameRestored.js";
import { CompetitionGameWithdrawalReversed } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameWithdrawalReversed.js";
import { CompetitionGameWithdrawn } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameWithdrawn.js";
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
  region: string | null;
  sport: string;
  address: string;
  national: boolean;
  international: boolean;
}

// The days as text, since pg makes a date into a moment at midnight wherever
// the server happens to be, and a day is what is kept.
const COLUMNS = `t.tournament_id, t.name,
       to_char(t.starts, 'YYYY-MM-DD') as starts,
       to_char(t.finishes, 'YYYY-MM-DD') as finishes,
       t.country, t.region, t.sport, t.address, t.national, t.international`;

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

// Every kind of event about one game, each of which says which.
const isAboutAGame = (
  event: DomainEvent,
): event is DomainEvent & { readonly gameId: string } =>
  event instanceof CompetitionGameAdded ||
  event instanceof CompetitionGameArchived ||
  event instanceof CompetitionGameCorrected ||
  event instanceof CompetitionGameMoved ||
  event instanceof CompetitionGameRestored ||
  event instanceof CompetitionGameWithdrawalReversed ||
  event instanceof CompetitionGameWithdrawn;

const listed = (row: Row): TournamentOfWebsite => ({
  id: row.tournament_id,
  name: row.name,
  starts: row.starts,
  finishes: row.finishes,
  country: row.country,
  region: row.region ?? undefined,
  sport: row.sport,
  address: row.address,
  national: row.national,
  international: row.international,
});

/**
 * The tournaments of each website, kept in step with every append, so that
 * the home page can list those played lately and those about to start, and
 * the years there are tournaments in, without replaying every tournament
 * there is.
 *
 * The tournaments and the competitions are held once for every read model
 * of tournaments (`Tournaments`), and what is kept here is each game by its
 * competition. Games are added to a competition, whose events do not say which
 * tournament it is in, and the tournament's do, so the games and the
 * tournaments are put together when asked, which lets a competition's games
 * be projected before the tournament that has it.
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
    await this.unitOfWork
      .connection()
      .query(`truncate tournaments_by_website_games`);
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
        `select ${COLUMNS}, max(g.changed_at) as last_played
           from tournaments t
           join competitions c
             on c.tournament_id = t.tournament_id and not c.archived
           join tournaments_by_website_games g
             on g.competition_id = c.competition_id and not g.archived
          where t.website = $1 and not t.archived ${narrowed.where}
          group by t.tournament_id
         having max(g.changed_at) >= $2
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
           from tournaments t
          where t.website = $1 and not t.archived
            and t.starts between $2 and $3 ${narrowed.where}
          order by t.starts, t.name`,
      [website.host, first, last, ...narrowed.values],
    );
    return rows.map(listed);
  }

  // When each last changed is kept in the tournaments table, with the greater
  // of its own events and its competitions', so that it is asked of the read
  // model and never of the events.
  async startingBetweenWithChange(
    website: Website,
    first: string,
    last: string,
    filter: TournamentFilter,
  ): Promise<readonly TournamentChanged[]> {
    const narrowed = narrowedBy(filter, 4);
    const { rows } = await this.unitOfWork
      .connection()
      .query<Row & { changed_at: Date }>(
        `select ${COLUMNS}, t.changed_at
           from tournaments t
          where t.website = $1 and not t.archived
            and t.starts between $2 and $3 ${narrowed.where}
          order by t.starts, t.name, t.tournament_id`,
        [website.host, first, last, ...narrowed.values],
      );
    return rows.map((row) => ({
      ...listed(row),
      changedAt: ReadOnlyDate.from(row.changed_at),
    }));
  }

  async changesOfTournament(
    tournament: string,
  ): Promise<ChangesOfTournament | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ competition_id: string | null; at: Date; own: Date }>(
        `select null as competition_id, t.changed_at as at, t.changed_at as own
           from tournaments t where t.tournament_id = $1
          union all
         select c.competition_id, c.changed_at, null
           from competitions c where c.tournament_id = $1`,
        [tournament],
      );
    const own = rows.find((row) => row.competition_id === null);
    if (own === undefined) return undefined;
    return {
      tournament: ReadOnlyDate.from(own.at),
      competitions: new Map(
        rows.flatMap((row) =>
          row.competition_id === null
            ? []
            : [[row.competition_id, ReadOnlyDate.from(row.at)] as const],
        ),
      ),
    };
  }

  async changesOfGames(
    competition: string,
  ): Promise<ReadonlyMap<string, ReadOnlyDate>> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ game_id: string; changed_at: Date }>(
        `select game_id, changed_at from tournaments_by_website_games
          where competition_id = $1`,
        [competition],
      );
    return new Map(
      rows.map((row) => [row.game_id, ReadOnlyDate.from(row.changed_at)]),
    );
  }

  async withSports(): Promise<readonly TournamentOfWebsite[]> {
    const { rows } = await this.unitOfWork.connection().query<Row>(
      `select ${COLUMNS}
           from tournaments t
          where not t.archived
          order by t.starts, t.name`,
    );
    return rows.map(listed);
  }

  async addressesOf(website: Website): Promise<readonly string[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ address: string }>(
        `select address from tournaments
          where website = $1 and not archived
          order by address`,
        [website.host],
      );
    return rows.map(({ address }) => address);
  }

  // The newest version of each stream the tournament is made of, its own and
  // each competition's, put together and hashed. A version only ever grows, so
  // any append changes the mark; and it is read from the events themselves and
  // not from a moment, so that an append that was kept late, or at the same
  // moment as another, still changes it.
  async fingerprintsOf(
    website: Website,
  ): Promise<readonly TournamentFingerprint[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ tournament_id: string; fingerprint: string }>(
        `with streams as (
           select t.tournament_id, t.tournament_id as stream_id
             from tournaments t
            where t.website = $1 and not t.archived
           union all
           select c.tournament_id, c.competition_id
             from competitions c
             join tournaments t on t.tournament_id = c.tournament_id
            where t.website = $1 and not t.archived
         )
         select s.tournament_id,
                md5(string_agg(s.stream_id || ':' || coalesce(v.version, 0),
                               ',' order by s.stream_id)) as fingerprint
           from streams s
           left join lateral (
             select max(e.version) as version from events e
              where e.stream_id = s.stream_id
           ) v on true
          group by s.tournament_id
          order by s.tournament_id`,
        [website.host],
      );
    return rows.map((row) => ({
      id: row.tournament_id,
      fingerprint: row.fingerprint,
    }));
  }

  async namesOf(website: Website): Promise<readonly string[]> {
    const { rows } = await this.unitOfWork.connection().query<{ name: string }>(
      `select distinct name from tournaments
          where website = $1 and not archived
          order by name`,
      [website.host],
    );
    return rows.map(({ name }) => name);
  }

  async yearsOf(website: Website, sport?: Sport): Promise<readonly number[]> {
    const { rows } = await this.unitOfWork.connection().query<{ year: number }>(
      `select distinct extract(year from starts)::int as year
           from tournaments
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
    if (event instanceof CompetitionGameAdded) {
      // Whether it is archived is kept as it was first projected, since a game
      // is added once and projecting it again is not adding it again.
      await connection.query(
        `insert into tournaments_by_website_games
           (competition_id, game_id, changed_at)
         values ($1, $2, $3)
         on conflict (competition_id, game_id) do update
           set changed_at = greatest(tournaments_by_website_games.changed_at,
                                     excluded.changed_at)`,
        [stream, event.gameId, event.occurredAt.toISOString()],
      );
    } else if (event instanceof CompetitionGameArchived) {
      await this.#gameArchived(stream, event.gameId, true);
    } else if (event instanceof CompetitionGameRestored) {
      await this.#gameArchived(stream, event.gameId, false);
    }
    // Every event about a game, whatever it did, is the game's last change.
    if (isAboutAGame(event)) {
      await connection.query(
        `update tournaments_by_website_games
            set changed_at = greatest(changed_at, $3)
          where competition_id = $1 and game_id = $2`,
        [stream, event.gameId, event.occurredAt.toISOString()],
      );
    }
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
