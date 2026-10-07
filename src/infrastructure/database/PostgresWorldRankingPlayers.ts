// The players the world rankings know, by their full names, in a table for
// each sport (PostgresWorldRankingPlayers.feature).
import type { WorldRankingSport } from "../../application/services/WorldRankingLists.js";
import type { WorldRankingPlayers } from "../../application/services/WorldRankingPlayers.js";
import type { UnitOfWork } from "./UnitOfWork.js";

// Written out rather than made from the sport, so that nothing a caller says
// is ever part of a statement.
const TABLES: Readonly<Record<WorldRankingSport, string>> = {
  ac: "ac_world_ranking_players",
  gc: "gc_world_ranking_players",
};

export class PostgresWorldRankingPlayers implements WorldRankingPlayers {
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
}
