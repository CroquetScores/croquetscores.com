// The players the world rankings know, in a table for each sport
// (PostgresWorldRankingPlayers.feature): golf croquet's by their full names
// and association croquet's by world ranking number, each brought up to date
// with the rankings' list. Found by their names
// (WorldRankingPlayersMatching.feature).
import {
  type ListedPlayer,
  NameTakenRefused,
  type WorldRankingSport,
} from "../../application/services/WorldRankingLists.js";
import type {
  KeptWorldRankingPlayer,
  WorldRankingPlayerNames,
  WorldRankingPlayers,
  WorldRankingPlayersKept,
} from "../../application/services/WorldRankingPlayers.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "./UnitOfWork.js";

// Written out rather than made from the sport, so that nothing a caller says
// is ever part of a statement.
const TABLES: Readonly<Record<WorldRankingSport, string>> = {
  ac: "ac_world_ranking_players",
  gc: "gc_world_ranking_players",
};

// The column each table keeps the site's own identifier in.
const IDENTIFIERS: Readonly<Record<WorldRankingSport, string>> = {
  ac: "ac_world_ranking_id",
  gc: "gc_world_ranking_id",
};

// What was typed, as a pattern matches it, with every character a pattern
// would read as anything other than itself written so that it is read as
// itself. Not put into lower case here: Postgres does that to the pattern and
// the names alike, so that the two are lowered the same way whatever the
// database's collation, which lowers some letters differently from
// JavaScript.
const literally = (typed: string): string =>
  typed.replace(/[\\%_]/g, (character) => `\\${character}`);

export class PostgresWorldRankingPlayers
  implements
    WorldRankingPlayers,
    WorldRankingPlayerNames,
    WorldRankingPlayersKept
{
  constructor(private readonly unitOfWork: UnitOfWork) {}

  // Both sports' players are kept by the number the rankings give them, and
  // a player who drops off a list is still one the site has met, so is
  // archived rather than let go.
  keepAssociationCroquet(
    players: readonly ListedPlayer[],
    at: ReadOnlyDate,
  ): Promise<void> {
    return this.keepByNumber("ac", players, at);
  }

  keepGolfCroquet(
    players: readonly ListedPlayer[],
    at: ReadOnlyDate,
  ): Promise<void> {
    return this.keepByNumber("gc", players, at);
  }

  // The same lock for both, so that two keepings of one sport at once are one
  // after the other.
  private async keepByNumber(
    sport: WorldRankingSport,
    players: readonly ListedPlayer[],
    at: ReadOnlyDate,
  ): Promise<void> {
    // Nobody given is no list the rankings would send, and would archive
    // everybody kept (an empty array is one nobody is different from), so
    // nothing is done.
    if (players.length === 0) return;
    const connection = this.unitOfWork.connection();
    const table = TABLES[sport];
    const identifier = IDENTIFIERS[sport];
    // Golf croquet's players are told apart by their country as well as their
    // name, so a name taken is a name taken in that country. Association
    // croquet's are told apart by name alone, and have a country all the same.
    const countries = players.map((player) => player.country ?? null);
    await connection.query(`lock table ${table} in share row exclusive mode`);
    const numbers = players.map((player) => player.worldRankingId);
    const names = players.map((player) => player.name);
    // A name is one player's, so a name on the list that another number holds
    // is refused before anything is written, whether that player is listed
    // or archived: the table would refuse it anyway, with nothing to say what
    // was wrong, and a swap of names in one list is refused with the rest
    // rather than guessed at.
    const { rows: taken } = await connection.query<{ name: string }>(
      `select kept.name
         from unnest($1::integer[], $2::text[], $3::text[])
              as given (world_ranking_id, name, country)
         join ${table} kept
           on kept.name = given.name
          and kept.world_ranking_id <> given.world_ranking_id
          ${sport === "gc" ? "and kept.country = given.country" : ""}
        order by kept.name`,
      [numbers, names, countries],
    );
    if (taken.length > 0) {
      const named = taken.map((row) => row.name);
      throw new NameTakenRefused(
        `The world rankings' ${sport === "ac" ? "association" : "golf"} croquet list gives ${named.join(", ")} to a player other than the one the site keeps it for, so none of it was kept.`,
        named,
      );
    }
    // The identifier is made here, one for each player given, and kept only
    // for those that are new: a player kept before keeps the one they have.
    await connection.query(
      `insert into ${table}
         (${identifier}, world_ranking_id, name, country, changed_at)
       select given.${identifier}, given.world_ranking_id, given.name,
              given.country, $5
         from unnest($1::text[], $2::integer[], $3::text[], $4::text[])
              as given (${identifier}, world_ranking_id, name, country)
       on conflict (world_ranking_id) do update
          set name = excluded.name,
              country = excluded.country,
              changed_at = excluded.changed_at,
              archived_at = null
        where ${table}.name is distinct from excluded.name
           or ${table}.country is distinct from excluded.country
           or ${table}.archived_at is not null`,
      [
        players.map(
          () => `${sport}-world-ranking-id/${globalThis.crypto.randomUUID()}`,
        ),
        numbers,
        names,
        countries,
        at.toDate(),
      ],
    );
    await connection.query(
      `update ${table}
          set archived_at = $2, changed_at = $2
        where archived_at is null
          and world_ranking_id <> all($1::integer[])`,
      [numbers, at.toDate()],
    );
  }

  // A few thousand names to a sport, so each is read rather than indexed: a
  // word can begin anywhere in a name, which no index of the name as a whole
  // can find.
  async beginning(
    sport: WorldRankingSport,
    typed: string,
    most: number,
  ): Promise<readonly string[]> {
    const pattern = literally(typed);
    const { rows } = await this.unitOfWork.connection().query<{
      name: string;
    }>(
      `select distinct name from ${TABLES[sport]}
        where lower(name) like lower($1) escape '\\'
           or lower(name) like lower($2) escape '\\'
           or lower(name) like lower($3) escape '\\'
        order by name
        limit $4`,
      [`${pattern}%`, `% ${pattern}%`, `%-${pattern}%`, most],
    );
    return rows.map((row) => row.name);
  }

  async has(sport: WorldRankingSport, name: string): Promise<boolean> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ found: boolean }>(
        `select exists (select 1 from ${TABLES[sport]} where name = $1) as found`,
        [name],
      );
    return rows[0]?.found === true;
  }

  // A few thousand rows at most, so all of them are read and the page is cut
  // from them, as a year's tournaments are. Ordered by name, which is unique,
  // so that two reads in a row put the players in the same order.
  async changedAfter(
    sport: WorldRankingSport,
    changedSince: ReadOnlyDate | undefined,
  ): Promise<readonly KeptWorldRankingPlayer[]> {
    const select = `select ${IDENTIFIERS[sport]} as id, world_ranking_id, name,
                           country,
                           changed_at, archived_at
                      from ${TABLES[sport]}`;
    const { rows } = await this.unitOfWork.connection().query<{
      id: string;
      world_ranking_id: number;
      name: string;
      country: string | null;
      changed_at: Date;
      archived_at: Date | null;
    }>(
      `${select}
        where $1::timestamptz is null or changed_at > $1
        order by name`,
      [changedSince?.toDate() ?? null],
    );
    return rows.map((row) => ({
      id: row.id,
      worldRankingId: row.world_ranking_id,
      name: row.name,
      country: row.country ?? undefined,
      changedAt: ReadOnlyDate.from(row.changed_at),
      archivedAt:
        row.archived_at === null
          ? undefined
          : ReadOnlyDate.from(row.archived_at),
    }));
  }
}
