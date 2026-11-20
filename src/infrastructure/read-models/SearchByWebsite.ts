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
import { KnockoutAdded } from "../../domain/aggregates/tournaments/events/KnockoutAdded.js";
import { KnockoutUpdated } from "../../domain/aggregates/tournaments/events/KnockoutUpdated.js";
import { SwissAdded } from "../../domain/aggregates/tournaments/events/SwissAdded.js";
import { SwissUpdated } from "../../domain/aggregates/tournaments/events/SwissUpdated.js";
import { TeamPlayerAdded } from "../../domain/aggregates/tournaments/events/TeamPlayerAdded.js";
import { TeamPlayerArchived } from "../../domain/aggregates/tournaments/events/TeamPlayerArchived.js";
import { TeamPlayerRestored } from "../../domain/aggregates/tournaments/events/TeamPlayerRestored.js";
import { TeamPlayerUpdated } from "../../domain/aggregates/tournaments/events/TeamPlayerUpdated.js";
import { TournamentCreated } from "../../domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentPlayerAdded } from "../../domain/aggregates/tournaments/events/TournamentPlayerAdded.js";
import { TournamentPlayerArchived } from "../../domain/aggregates/tournaments/events/TournamentPlayerArchived.js";
import { TournamentPlayerRestored } from "../../domain/aggregates/tournaments/events/TournamentPlayerRestored.js";
import { TournamentPlayerUpdated } from "../../domain/aggregates/tournaments/events/TournamentPlayerUpdated.js";
import { TournamentUpdated } from "../../domain/aggregates/tournaments/events/TournamentUpdated.js";
import { pairMembers } from "../../domain/aggregates/tournaments/value-objects/pairName.js";
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
//
// A doubles pair is a player like any other, written with whichever of its two
// first, so "Sam & Alex" and "Alex & Sam" would be two people by their names.
// The pair's address is made of the two players' addresses in alphabetical
// order, so that it is the same whichever way round it was written, with two
// hyphens between them. A slug never has two hyphens together, so no player's
// address can be a pair's, as "Alex Sam" would be that of "Sam & Alex" with one
// (SearchPlayersOfWebsite.feature).
const personOf = (worldRankingName: string, name: string): string => {
  const known = canMakeASlug(worldRankingName) ? worldRankingName : name;
  const members = pairMembers(known);
  if (members !== undefined && members.every(canMakeASlug)) {
    return members
      .map((member) => Slug.fromName(member).toString())
      .sort()
      .join("--");
  }
  return Slug.fromName(known).toString();
};

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
      `truncate search_by_website_tournament_names,
                  search_by_website_competitions, search_by_website_players`,
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
      `select t.name, t.address, to_char(t.starts, 'YYYY-MM-DD') as starts,
              to_char(t.finishes, 'YYYY-MM-DD') as finishes, t.sport,
              t.country, t.national, t.international
           from tournaments t
           join search_by_website_tournament_names n
             on n.tournament_id = t.tournament_id
          where t.website = $1 and not t.archived
            and n.folded_name like all($2)
          order by starts_with(n.folded_name, $4) desc, n.folded_name, t.name,
                   t.tournament_id
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
                p.person, e.world_ranking_name as name, p.folded_name
           from search_by_website_players p
           join every_player e on e.player_id = p.player_id
           join tournaments t on t.tournament_id = e.tournament_id
           left join tournament_teams team on team.team_id = e.team_id
          where t.website = $1 and not t.archived and not e.archived
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

  async competitionNamesOf(
    website: Website,
    tournament: string,
  ): Promise<readonly string[]> {
    const { rows } = await this.unitOfWork.connection().query<{ name: string }>(
      // Names the tournament takes to be one name are one here, by the rule it
      // takes them by (`sameName`: lower case, then composed): each is counted
      // under that key, and shown in the capitals more competitions have it in
      // (the one that sorts first where they have it as often). The names used
      // most come first, and those used as often in the alphabetical order of
      // their keys, which does not depend on the capitals that happen to win.
      `with counted as (
         select normalize(lower(c.name), NFC) as key, c.name, count(*) as used
           from search_by_website_competitions c
           join competitions k on k.competition_id = c.competition_id
           join tournaments t on t.tournament_id = k.tournament_id
          where t.website = $1 and not t.archived and not k.archived
            and normalize(lower(c.name), NFC) not in (
              select normalize(lower(c2.name), NFC)
                from search_by_website_competitions c2
                join competitions k2 on k2.competition_id = c2.competition_id
               where k2.tournament_id = $2 and not k2.archived)
          group by 1, c.name)
       select (array_agg(name order by used desc, name))[1] as name
         from counted
        group by key
        order by sum(used) desc, key`,
      [website.host, tournament],
    );
    return rows.map(({ name }) => name);
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
         join competitions k on k.competition_id = c.competition_id
         join tournaments t on t.tournament_id = k.tournament_id
        where t.website = $1 and not t.archived and not k.archived
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
              e.world_ranking_name as name, t.name as tournament_name,
              to_char(t.starts, 'YYYY-MM-DD') as starts,
              to_char(t.finishes, 'YYYY-MM-DD') as finishes,
              t.address, e.slug as player_slug, t.national, t.international
         from search_by_website_players p
         join every_player e on e.player_id = p.player_id
         join tournaments t on t.tournament_id = e.tournament_id
         left join tournament_teams team on team.team_id = e.team_id
        where t.website = $1 and p.person = $2 and not t.archived
          and not e.archived and not coalesce(team.archived, false)
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
      // Only the name folded is the search's to keep; the tournament itself is
      // held once, for every read model (Tournaments.feature).
      await connection.query(
        `insert into search_by_website_tournament_names
           (tournament_id, folded_name, changed_at)
         values ($1, $2, $3)
         on conflict (tournament_id) do update
           set folded_name = excluded.folded_name,
               changed_at = excluded.changed_at`,
        [stream, foldedForSearch(event.name), event.occurredAt.toISOString()],
      );
    } else if (event instanceof TournamentUpdated) {
      await connection.query(
        `update search_by_website_tournament_names
            set folded_name = $2, changed_at = $3
          where tournament_id = $1`,
        [stream, foldedForSearch(event.name), event.occurredAt.toISOString()],
      );
    } else if (
      event instanceof BlockAdded ||
      event instanceof KnockoutAdded ||
      event instanceof SwissAdded
    ) {
      // Which tournament it is in, and whether it is archived, are held once
      // with the competition (Tournaments.feature).
      await connection.query(
        `insert into search_by_website_competitions
           (competition_id, name, folded_name, slug, changed_at)
         values ($1, $2, $3, $4, $5)
         on conflict (competition_id) do update
           set name = excluded.name, folded_name = excluded.folded_name,
               slug = excluded.slug, changed_at = excluded.changed_at`,
        [
          event.competitionId,
          event.name,
          foldedForSearch(event.name),
          event.slug,
          event.occurredAt.toISOString(),
        ],
      );
    } else if (
      event instanceof BlockUpdated ||
      event instanceof KnockoutUpdated ||
      event instanceof SwissUpdated
    ) {
      await connection.query(
        `update search_by_website_competitions
            set name = $2, folded_name = $3, changed_at = $4
          where competition_id = $1`,
        [
          event.competitionId,
          event.name,
          foldedForSearch(event.name),
          event.occurredAt.toISOString(),
        ],
      );
    } else if (
      event instanceof CompetitionArchived &&
      event.name !== undefined
    ) {
      // Archiving renames the competition so that its name can be used again,
      // and it keeps the new name when it is restored. Not found while it is
      // archived, but found by this name after.
      await connection.query(
        `update search_by_website_competitions
            set name = $2, folded_name = $3, changed_at = $4
          where competition_id = $1`,
        [
          event.competitionId,
          event.name,
          foldedForSearch(event.name),
          event.occurredAt.toISOString(),
        ],
      );
    } else if (
      event instanceof TeamPlayerAdded ||
      event instanceof TournamentPlayerAdded ||
      event instanceof TournamentPlayerUpdated ||
      event instanceof TeamPlayerUpdated
    ) {
      await this.#playerKept(
        event.playerId,
        event.name,
        event.worldRankingName,
        event.occurredAt.toISOString(),
      );
    } else if (
      event instanceof TournamentPlayerArchived ||
      event instanceof TeamPlayerArchived ||
      event instanceof TournamentPlayerRestored ||
      event instanceof TeamPlayerRestored
    ) {
      // Whether the player is archived is the tournament's to say; what is
      // the search's is when the row last changed.
      await this.unitOfWork.connection().query(
        `update search_by_website_players set changed_at = $2
            where player_id = $1`,
        [event.playerId, event.occurredAt.toISOString()],
      );
    }
  }

  // Added and updated alike write the name folded and the person made of it,
  // as the event says the player now is. Nothing else of the player is kept
  // here: the rest is the tournament's (every_player).
  async #playerKept(
    player: string,
    name: string,
    worldRankingName: string | undefined,
    at: string,
  ): Promise<void> {
    // A blank one is none, as the domain reads it.
    const known =
      worldRankingName === undefined || worldRankingName.trim() === ""
        ? name
        : worldRankingName;
    await this.unitOfWork.connection().query(
      `insert into search_by_website_players
         (player_id, folded_name, person, changed_at)
       values ($1, $2, $3, $4)
       on conflict (player_id) do update
         set folded_name = excluded.folded_name,
             person = excluded.person,
             changed_at = excluded.changed_at`,
      [player, foldedForSearch(known), personOf(known, name), at],
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
         from (select distinct on (lower(e.representing)) e.representing
                 from search_by_website_players p
                 join every_player e on e.player_id = p.player_id
                where not e.archived
                  and e.representing is not null
                  and (lower(e.representing) like lower($1) escape '\\'
                    or lower(e.representing) like lower($2) escape '\\'
                    or lower(e.representing) like lower($3) escape '\\')
                order by lower(e.representing), p.kept) as once
        order by representing
        limit $4`,
      [`${pattern}%`, `% ${pattern}%`, `%-${pattern}%`, most],
    );
    return rows.map((row) => row.representing);
  }
}
