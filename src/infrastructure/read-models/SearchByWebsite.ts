import type { Projection } from "../../application/common/Projection.js";
import {
  type CompetitionFound,
  foldedForSearch,
  type PlayerFound,
  type SearchByWebsite as Asked,
  type TournamentFound,
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

// What makes two players one person is the address their world ranking name
// makes, as a tournament's players are told apart by theirs. A name that
// makes none, as one of nothing but punctuation, is the player's own name's
// address instead, which every player's name can make.
const personOf = (worldRankingName: string, name: string): string =>
  Slug.fromName(
    canMakeASlug(worldRankingName) ? worldRankingName : name,
  ).toString();

/**
 * The names of each website's tournaments, competitions and players, kept in
 * step with every append, so that a search finds them without replaying every
 * tournament there is (Search.feature, SearchPlayersOfWebsite.feature).
 *
 * A player's world ranking name is the one the event says, and a player added
 * before every player had one is known by their name.
 */
export class SearchByWebsite implements Projection, Asked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const event of events) await this.#project(stream.value, event);
  }

  /**
   * The tables made again from `events`, every one there is. Nothing one
   * stream writes depends on another's having been written first.
   */
  async rebuildFrom(events: readonly StoredEvent[]): Promise<void> {
    await this.unitOfWork.connection().query(
      `truncate search_by_website_tournaments, search_by_website_competitions,
                  search_by_website_players, search_by_website_teams`,
    );
    for (const { stream, event } of events) await this.#project(stream, event);
  }

  async tournaments(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<readonly TournamentFound[]> {
    const { rows } = await this.unitOfWork.connection().query<TournamentFound>(
      `select name, address
           from search_by_website_tournaments
          where website = $1 and not archived and folded_name like all($2)
          order by folded_name, name, tournament_id
          limit $3`,
      [website.host, patterns(words), most],
    );
    return rows;
  }

  async players(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<readonly PlayerFound[]> {
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
          order by p.person, t.starts desc, t.tournament_id desc,
                   p.player_id desc)
       select name, person
         from shown
        where folded_name like all($2)
        order by folded_name, name, person
        limit $3`,
      [website.host, patterns(words), most],
    );
    return rows.map(({ name, person }) => ({
      name,
      address: `players/${person}`,
    }));
  }

  async competitions(
    website: Website,
    words: readonly string[],
    most: number,
  ): Promise<readonly CompetitionFound[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      name: string;
      slug: string;
      tournament_name: string;
      tournament_address: string;
    }>(
      `select c.name, c.slug, t.name as tournament_name,
              t.address as tournament_address
         from search_by_website_competitions c
         join search_by_website_tournaments t
           on t.tournament_id = c.tournament_id
        where t.website = $1 and not t.archived and not c.archived
          and c.folded_name like all($2)
        order by c.folded_name, c.name, c.competition_id
        limit $3`,
      [website.host, patterns(words), most],
    );
    return rows.map((row) => ({
      name: row.name,
      address: `${row.tournament_address}/${row.slug}`,
      tournament: {
        name: row.tournament_name,
        address: row.tournament_address,
      },
    }));
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof TournamentCreated) {
      await connection.query(
        `insert into search_by_website_tournaments
           (tournament_id, website, name, folded_name, address, starts)
         values ($1, $2, $3, $4, $5, $6)
         on conflict (tournament_id) do update
           set name = excluded.name, folded_name = excluded.folded_name,
               address = excluded.address, starts = excluded.starts`,
        [
          stream,
          event.website,
          event.name,
          foldedForSearch(event.name),
          event.address,
          event.starts,
        ],
      );
    } else if (event instanceof TournamentUpdated) {
      await connection.query(
        `update search_by_website_tournaments
            set name = $2, folded_name = $3, address = $4, starts = $5
          where tournament_id = $1`,
        [
          stream,
          event.name,
          foldedForSearch(event.name),
          event.address,
          event.starts,
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
      );
    } else if (event instanceof TournamentPlayerAdded) {
      await this.#playerKept(
        stream,
        event.playerId,
        event.name,
        event.worldRankingName,
        undefined,
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
  ): Promise<void> {
    const known = worldRankingName ?? name;
    await this.unitOfWork.connection().query(
      `insert into search_by_website_players
         (player_id, tournament_id, team_id, name, world_ranking_name,
          folded_name, person)
       values ($1, $2, $7, $3, $4, $5, $6)
       on conflict (player_id) do update
         set name = excluded.name,
             world_ranking_name = excluded.world_ranking_name,
             folded_name = excluded.folded_name,
             person = excluded.person`,
      [
        player,
        tournament,
        name,
        known,
        foldedForSearch(known),
        personOf(known, name),
        team ?? null,
      ],
    );
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
