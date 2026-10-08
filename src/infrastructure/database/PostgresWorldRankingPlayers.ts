// The players the world rankings know, by their full names, in a table for
// each sport (PostgresWorldRankingPlayers.feature), and found by them
// (WorldRankingPlayersMatching.feature).
import type { WorldRankingSport } from "../../application/services/WorldRankingLists.js";
import type {
  WorldRankingPlayerNames,
  WorldRankingPlayers,
} from "../../application/services/WorldRankingPlayers.js";
import type { UnitOfWork } from "./UnitOfWork.js";

// Written out rather than made from the sport, so that nothing a caller says
// is ever part of a statement.
const TABLES: Readonly<Record<WorldRankingSport, string>> = {
  ac: "ac_world_ranking_players",
  gc: "gc_world_ranking_players",
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
  implements WorldRankingPlayers, WorldRankingPlayerNames
{
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async replace(
    sport: WorldRankingSport,
    names: readonly string[],
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    const table = TABLES[sport];
    // A lock that two replacings cannot both hold, so that the second waits
    // for the first to commit and then replaces what it kept. Without it the
    // second deletes only the rows it could see when it began, and its
    // inserts run into the first's. Share row exclusive rather than truncate's
    // access exclusive, because readers do not wait on it: they go on reading
    // the players kept before until this is committed.
    await connection.query(`lock table ${table} in share row exclusive mode`);
    await connection.query(`delete from ${table}`);
    await connection.query(
      `insert into ${table} (name)
       select distinct name from unnest($1::text[]) as given (name)`,
      [names],
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
      `select name from ${TABLES[sport]}
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
}
