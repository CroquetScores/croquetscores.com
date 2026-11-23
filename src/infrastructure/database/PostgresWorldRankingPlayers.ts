// The players the world rankings know, in a table for each sport
// (PostgresWorldRankingPlayers.feature): golf croquet's by their full names,
// replaced whole, and association croquet's by world ranking number, brought
// up to date with the rankings' list. Found by their names
// (WorldRankingPlayersMatching.feature).
import {
  type AssociationCroquetPlayer,
  NameTakenRefused,
  type WorldRankingSport,
} from "../../application/services/WorldRankingLists.js";
import type {
  WorldRankingPlayerNames,
  WorldRankingPlayers,
} from "../../application/services/WorldRankingPlayers.js";
import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
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

  async replaceGolfCroquet(names: readonly string[]): Promise<void> {
    const connection = this.unitOfWork.connection();
    const table = TABLES.gc;
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

  // Not replaced whole, as golf croquet's are: the number the rankings give a
  // player is what identifies them here, and a player who drops off the list
  // is still one the site has met, so is archived rather than let go. The
  // same lock as golf croquet's, for the same reason.
  async keepAssociationCroquet(
    players: readonly AssociationCroquetPlayer[],
    at: ReadOnlyDate,
  ): Promise<void> {
    // Nobody given is no list the rankings would send, and would archive
    // everybody kept (an empty array is one nobody is different from), so
    // nothing is done.
    if (players.length === 0) return;
    const connection = this.unitOfWork.connection();
    const table = TABLES.ac;
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
         from unnest($1::integer[], $2::text[]) as given (world_ranking_id, name)
         join ${table} kept
           on kept.name = given.name
          and kept.world_ranking_id <> given.world_ranking_id
        order by kept.name`,
      [numbers, names],
    );
    if (taken.length > 0) {
      const named = taken.map((row) => row.name);
      throw new NameTakenRefused(
        `The world rankings' association croquet list gives ${named.join(", ")} to a player other than the one the site keeps it for, so none of it was kept.`,
        named,
      );
    }
    // The identifier is made here, one for each player given, and kept only
    // for those that are new: a player kept before keeps the one they have.
    await connection.query(
      `insert into ${table}
         (ac_world_ranking_id, world_ranking_id, name, changed_at)
       select given.ac_world_ranking_id, given.world_ranking_id, given.name, $4
         from unnest($1::text[], $2::integer[], $3::text[])
              as given (ac_world_ranking_id, world_ranking_id, name)
       on conflict (world_ranking_id) do update
          set name = excluded.name,
              changed_at = excluded.changed_at,
              archived_at = null
        where ${table}.name is distinct from excluded.name
           or ${table}.archived_at is not null`,
      [
        players.map(
          () => `ac-world-ranking-id/${globalThis.crypto.randomUUID()}`,
        ),
        numbers,
        names,
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
