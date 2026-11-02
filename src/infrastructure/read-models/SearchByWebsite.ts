import type { Projection } from "../../application/common/Projection.js";
import type { PlayersRepresenting } from "../../application/services/PlayersRepresenting.js";
import {
  type CompetitionFound,
  foldedForSearch,
  type Limited,
  type PlayerFound,
  type PlayerOfWebsiteFound,
  type PlayerTournament,
  type SearchByWebsite as Asked,
  type TournamentFound,
  type TournamentFoundByName,
} from "../../application/operations/tournaments/searching.js";
import { BlockAdded } from "../../domain/aggregates/tournaments/events/BlockAdded.js";
import { BlockUpdated } from "../../domain/aggregates/tournaments/events/BlockUpdated.js";
import { CompetitionArchived } from "../../domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionRestored } from "../../domain/aggregates/tournaments/events/CompetitionRestored.js";
import { KnockoutAdded } from "../../domain/aggregates/tournaments/events/KnockoutAdded.js";
import { KnockoutUpdated } from "../../domain/aggregates/tournaments/events/KnockoutUpdated.js";
import { SwissAdded } from "../../domain/aggregates/tournaments/events/SwissAdded.js";
import { SwissUpdated } from "../../domain/aggregates/tournaments/events/SwissUpdated.js";
import { TeamAdded } from "../../domain/aggregates/tournaments/events/TeamAdded.js";
import { TeamArchived } from "../../domain/aggregates/tournaments/events/TeamArchived.js";
import { TeamRestored } from "../../domain/aggregates/tournaments/events/TeamRestored.js";
import { TeamPlayerAdded } from "../../domain/aggregates/tournaments/events/TeamPlayerAdded.js";
import { TeamPlayerArchived } from "../../domain/aggregates/tournaments/events/TeamPlayerArchived.js";
import { TeamPlayerRestored } from "../../domain/aggregates/tournaments/events/TeamPlayerRestored.js";
import { TeamPlayerUpdated } from "../../domain/aggregates/tournaments/events/TeamPlayerUpdated.js";
import { TournamentArchived } from "../../domain/aggregates/tournaments/events/TournamentArchived.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentPlayerAdded } from "../../domain/aggregates/tournaments/events/TournamentPlayerAdded.js";
import { TournamentPlayerArchived } from "../../domain/aggregates/tournaments/events/TournamentPlayerArchived.js";
import { TournamentPlayerRestored } from "../../domain/aggregates/tournaments/events/TournamentPlayerRestored.js";
import { TournamentPlayerUpdated } from "../../domain/aggregates/tournaments/events/TournamentPlayerUpdated.js";
import { TournamentRestored } from "../../domain/aggregates/tournaments/events/TournamentRestored.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import { canMakeASlug } from "../../domain/common/canMakeASlug.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { Slug } from "../../domain/common/Slug.js";
import type { Website } from "../../domain/common/Website.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

// Each word as a pattern that finds it anywhere in a name. A folded word is
// only letters and digits, so nothing in it is a wildcard.
const patterns = (words: readonly string[]): string[] =>
  words.map((word) => `%${word}%`);

// The words as they were typed, folded and one space apart, which a name that
// is a reader's first choice begins with. What orders the names that are found
// before the limit is applied, so that one is never cut for being late in the
// alphabet when it is the one asked for (Search.feature).
const beginning = (words: readonly string[]): string => words.join(" ");

// One more than was wanted is asked for, which is how it is known there were
// more: the one over is not answered.
const limited = <T>(rows: readonly T[], most: number): Limited<T> => ({
  found: rows.slice(0, most),
  more: rows.length > most,
});

// What makes two players one person is the address their world ranking name
// makes, as a tournament's players are told apart by theirs. A name that
// makes none, as one of nothing but punctuation, is the player's own name's
// address instead, which every player's name can make.
const personOf = (worldRankingName: string, name: string): string =>
  Slug.fromName(
    canMakeASlug(worldRankingName) ? worldRankingName : name,
  ).toString();

// A tournament's days, sport and country as a search answers them, from a row
// that has them as the database holds them: the sport and the country of a
// tournament kept before there were any are null there and none here.
const whenAndWhere = (row: {
  starts: string;
  finishes: string;
  sport: string | null;
  country: string | null;
}): Pick<TournamentFound, "starts" | "finishes" | "sport" | "country"> => ({
  starts: row.starts,
  finishes: row.finishes,
  sport: row.sport ?? undefined,
  country: row.country ?? undefined,
});

/**
 * The names of each website's tournaments, competitions and players, kept in
 * step with every append, so that a search finds them without replaying every
 * tournament there is (Search.feature, SearchPlayersOfWebsite.feature).
 *
 * A player's world ranking name is the one the event says, and a player added
 * before every player had one is known by their name.
 */
export class SearchByWebsite implements Projection, Asked, PlayersRepresenting {
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
      `truncate search_by_website_tournaments, search_by_website_competitions,
                  search_by_website_players, search_by_website_teams`,
    );
  }

  /**
   * The tables made again from the streams it is handed, one at a time.
   * Nothing one stream writes depends on another's having been written
   * first.
   */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, event);
  }

  async tournaments(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<Limited<TournamentFoundByName>> {
    const { rows } = await this.unitOfWork.connection().query<{
      name: string;
      address: string;
      starts: string;
      finishes: string;
      sport: string | null;
      country: string | null;
      national: boolean;
      international: boolean;
    }>(
      `select name, address, to_char(starts, 'YYYY-MM-DD') as starts,
              to_char(finishes, 'YYYY-MM-DD') as finishes, sport, country,
              national, international
           from search_by_website_tournaments
          where website = $1 and not archived and folded_name like all($2)
          order by starts_with(folded_name, $4) desc, folded_name, name,
                   tournament_id
          limit $3`,
      [website.host, patterns(words), most + 1, beginning(words)],
    );
    return limited(
      rows.map((row) => ({
        name: row.name,
        address: row.address,
        ...whenAndWhere(row),
        national: row.national,
        international: row.international,
      })),
      most,
    );
  }

  async players(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<Limited<PlayerFound>> {
    // Each person is the spelling of the tournament that started most
    // recently, chosen before the words are looked for in it, so that the name
    // shown is the same whatever was typed.
    const { rows } = await this.unitOfWork.connection().query<{
      name: string;
      person: string;
    }>(
      `with shown as (
         select distinct on (p.person)
                p.person, p.world_ranking_name as name, p.folded_name
           from search_by_website_players p
           join search_by_website_tournaments t
             on t.tournament_id = p.tournament_id
           left join search_by_website_teams team
             on team.team_id = p.team_id
          where t.website = $1 and not t.archived and not p.archived
            and not coalesce(team.archived, false)
            -- Only the people with some spelling that has the words, which
            -- is no more than the people the latest spelling can have them
            -- for, so that the one pass is over them and not over everybody.
            and p.person in (select person from search_by_website_players
                              where folded_name like all($2))
          order by p.person, t.starts desc, t.tournament_id desc,
                   p.player_id desc)
       select name, person
         from shown
        where folded_name like all($2)
        order by starts_with(folded_name, $4) desc, folded_name, name, person
        limit $3`,
      [website.host, patterns(words), most + 1, beginning(words)],
    );
    return limited(
      rows.map(({ name, person }) => ({
        name,
        address: `players/${person}`,
      })),
      most,
    );
  }

  async competitions(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<Limited<CompetitionFound>> {
    const { rows } = await this.unitOfWork.connection().query<{
      name: string;
      slug: string;
      tournament_name: string;
      tournament_address: string;
      starts: string;
      finishes: string;
      sport: string | null;
      country: string | null;
    }>(
      `select c.name, c.slug, t.name as tournament_name,
              t.address as tournament_address,
              to_char(t.starts, 'YYYY-MM-DD') as starts,
              to_char(t.finishes, 'YYYY-MM-DD') as finishes, t.sport,
              t.country
         from search_by_website_competitions c
         join search_by_website_tournaments t
           on t.tournament_id = c.tournament_id
        where t.website = $1 and not t.archived and not c.archived
          and c.folded_name like all($2)
        order by starts_with(c.folded_name, $4) desc, c.folded_name, c.name,
                 c.competition_id
        limit $3`,
      [website.host, patterns(words), most + 1, beginning(words)],
    );
    return limited(
      rows.map((row) => ({
        name: row.name,
        address: `${row.tournament_address}/competitions/${row.slug}`,
        tournament: {
          name: row.tournament_name,
          address: row.tournament_address,
          ...whenAndWhere(row),
        },
      })),
      most,
    );
  }

  async player(
    website: Website,
    slug: string,
  ): Promise<PlayerOfWebsiteFound | undefined> {
    // Every player of the person that is in use, the tournament that started
    // most recently first, so that the first is the one that names them and
    // the order is the order the page begins with. A tournament a person is
    // twice in, under one world ranking name, is listed once.
    const { rows } = await this.unitOfWork.connection().query<{
      name: string;
      tournament_name: string;
      starts: string;
      finishes: string;
      address: string;
      player_slug: string;
      national: boolean;
      international: boolean;
    }>(
      `select distinct on (t.starts, t.tournament_id)
              p.world_ranking_name as name, t.name as tournament_name,
              to_char(t.starts, 'YYYY-MM-DD') as starts,
              to_char(t.finishes, 'YYYY-MM-DD') as finishes,
              t.address, p.slug as player_slug, t.national, t.international
         from search_by_website_players p
         join search_by_website_tournaments t
           on t.tournament_id = p.tournament_id
         left join search_by_website_teams team on team.team_id = p.team_id
        where t.website = $1 and p.person = $2 and not t.archived
          and not p.archived and not coalesce(team.archived, false)
        order by t.starts desc, t.tournament_id desc, p.player_id desc`,
      [website.host, slug],
    );
    const first = rows[0];
    if (first === undefined) return undefined;
    const tournaments: PlayerTournament[] = rows.map((row) => ({
      name: row.tournament_name,
      starts: row.starts,
      finishes: row.finishes,
      address: row.address,
      playerAddress: `${row.address}/players/${row.player_slug}`,
      national: row.national,
      international: row.international,
    }));
    return { name: first.name, tournaments };
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof TournamentCreated) {
      await connection.query(
        `insert into search_by_website_tournaments
           (tournament_id, website, name, folded_name, address, starts,
            finishes, sport, country, national, international)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         on conflict (tournament_id) do update
           set name = excluded.name, folded_name = excluded.folded_name,
               address = excluded.address, starts = excluded.starts,
               finishes = excluded.finishes, sport = excluded.sport,
               country = excluded.country, national = excluded.national,
               international = excluded.international`,
        [
          stream,
          event.website,
          event.name,
          foldedForSearch(event.name),
          event.address,
          event.starts,
          event.finishes,
          event.sport,
          event.country,
          event.national,
          event.international,
        ],
      );
    } else if (event instanceof TournamentUpdated) {
      await connection.query(
        `update search_by_website_tournaments
            set name = $2, folded_name = $3, address = $4, starts = $5,
                finishes = $6, country = $7, sport = $8, national = $9,
                international = $10
          where tournament_id = $1`,
        [
          stream,
          event.name,
          foldedForSearch(event.name),
          event.address,
          event.starts,
          event.finishes,
          event.country,
          event.sport,
          event.national,
          event.international,
        ],
      );
    } else if (event instanceof TournamentArchived) {
      await this.#archived("search_by_website_tournaments", "tournament_id", [
        stream,
        true,
      ]);
    } else if (event instanceof TournamentRestored) {
      await this.#archived("search_by_website_tournaments", "tournament_id", [
        stream,
        false,
      ]);
    } else if (
      event instanceof BlockAdded ||
      event instanceof KnockoutAdded ||
      event instanceof SwissAdded
    ) {
      await connection.query(
        `insert into search_by_website_competitions
           (competition_id, tournament_id, name, folded_name, slug)
         values ($1, $2, $3, $4, $5)
         on conflict (competition_id) do update
           set name = excluded.name, folded_name = excluded.folded_name,
               slug = excluded.slug`,
        [
          event.competitionId,
          stream,
          event.name,
          foldedForSearch(event.name),
          event.slug,
        ],
      );
    } else if (
      event instanceof BlockUpdated ||
      event instanceof KnockoutUpdated ||
      event instanceof SwissUpdated
    ) {
      await connection.query(
        `update search_by_website_competitions
            set name = $2, folded_name = $3
          where competition_id = $1`,
        [event.competitionId, event.name, foldedForSearch(event.name)],
      );
    } else if (event instanceof CompetitionArchived) {
      await this.#archived("search_by_website_competitions", "competition_id", [
        event.competitionId,
        true,
      ]);
    } else if (event instanceof CompetitionRestored) {
      await this.#archived("search_by_website_competitions", "competition_id", [
        event.competitionId,
        false,
      ]);
    } else if (event instanceof TeamAdded) {
      // Kept as it is, since a team added is not one archived again by
      // projecting its adding a second time.
      await connection.query(
        `insert into search_by_website_teams (team_id) values ($1)
         on conflict (team_id) do nothing`,
        [event.teamId],
      );
    } else if (event instanceof TeamArchived) {
      await this.#archived("search_by_website_teams", "team_id", [
        event.teamId,
        true,
      ]);
    } else if (event instanceof TeamRestored) {
      await this.#archived("search_by_website_teams", "team_id", [
        event.teamId,
        false,
      ]);
    } else if (event instanceof TeamPlayerAdded) {
      await this.#playerKept(
        stream,
        event.playerId,
        event.name,
        event.worldRankingName,
        event.teamId,
        event.slug,
        undefined,
      );
    } else if (event instanceof TournamentPlayerAdded) {
      await this.#playerKept(
        stream,
        event.playerId,
        event.name,
        event.worldRankingName,
        undefined,
        event.slug,
        event.representing,
      );
    } else if (
      event instanceof TournamentPlayerUpdated ||
      event instanceof TeamPlayerUpdated
    ) {
      await this.#playerKept(
        stream,
        event.playerId,
        event.name,
        event.worldRankingName,
        event instanceof TeamPlayerUpdated ? event.teamId : undefined,
        undefined,
        event instanceof TournamentPlayerUpdated
          ? event.representing
          : undefined,
      );
    } else if (
      event instanceof TournamentPlayerArchived ||
      event instanceof TeamPlayerArchived
    ) {
      await this.#archived("search_by_website_players", "player_id", [
        event.playerId,
        true,
      ]);
    } else if (
      event instanceof TournamentPlayerRestored ||
      event instanceof TeamPlayerRestored
    ) {
      await this.#archived("search_by_website_players", "player_id", [
        event.playerId,
        false,
      ]);
    }
  }

  // Added and updated alike write the player as the event says they now are,
  // keeping whether they are archived, which an update does not change.
  async #playerKept(
    tournament: string,
    player: string,
    name: string,
    worldRankingName: string | undefined,
    team: string | undefined,
    slug: string | undefined,
    representing: string | undefined,
  ): Promise<void> {
    // A blank one is none, as the domain reads it.
    const known =
      worldRankingName === undefined || worldRankingName.trim() === ""
        ? name
        : worldRankingName;
    await this.unitOfWork.connection().query(
      `insert into search_by_website_players
         (player_id, tournament_id, team_id, name, world_ranking_name,
          folded_name, person, slug, representing)
       values ($1, $2, $7, $3, $4, $5, $6, $8, $9)
       on conflict (player_id) do update
         set name = excluded.name,
             world_ranking_name = excluded.world_ranking_name,
             folded_name = excluded.folded_name,
             person = excluded.person,
             representing = excluded.representing,
             -- A player keeps the slug they were given when their name is
             -- corrected, which an update does not say.
             slug = case when excluded.slug <> '' then excluded.slug
                         else search_by_website_players.slug end`,
      [
        player,
        tournament,
        name,
        known,
        foldedForSearch(known),
        personOf(known, name),
        team ?? null,
        slug ?? "",
        representing === undefined || representing.trim() === ""
          ? null
          : representing.trim(),
      ],
    );
  }

  // Read from every player there is, as the world ranking players are: a word
  // can begin anywhere in what is represented, which no index can find.
  async beginning(typed: string, most: number): Promise<readonly string[]> {
    // Every character a pattern would read as anything but itself, written so
    // that it is read as itself. Lowered by Postgres, to the pattern and the
    // names alike, so that the two are lowered the same way.
    const pattern = typed.replace(/[\\%_]/g, (character) => `\\${character}`);
    const { rows } = await this.unitOfWork.connection().query<{
      representing: string;
    }>(
      `select representing
         from (select distinct on (lower(representing)) representing
                 from search_by_website_players
                where not archived
                  and representing is not null
                  and (lower(representing) like lower($1) escape '\\'
                    or lower(representing) like lower($2) escape '\\'
                    or lower(representing) like lower($3) escape '\\')
                order by lower(representing), kept) as once
        order by representing
        limit $4`,
      [`${pattern}%`, `% ${pattern}%`, `%-${pattern}%`, most],
    );
    return rows.map((row) => row.representing);
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
}
