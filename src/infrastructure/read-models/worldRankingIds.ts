// The id the site gave the world ranking player of a tournament's player, looked
// for by the name the rankings know them by in the table of the tournament's
// sport (TournamentContents.feature), and again when the rankings' players are
// kept (PostgresWorldRankingPlayers.feature).
import {
  countryNamedInList,
  countryOfLetters,
} from "../world-rankings/countriesOfLists.js";

/** What a read model needs of a connection to look an id up. */
export interface Asking {
  query<Row>(
    statement: string,
    values?: readonly unknown[],
  ): Promise<{ readonly rows: Row[] }>;
}

// Written out rather than made from the sport, so that nothing a caller says
// is ever part of a statement. A sport not here has no rankings' players.
const RANKINGS: Readonly<Record<string, { table: string; id: string }>> = {
  ac: { table: "ac_world_ranking_players", id: "ac_world_ranking_id" },
  gc: { table: "gc_world_ranking_players", id: "gc_world_ranking_id" },
};

/** What a tournament's player is kept with: an id for each sport, one of them empty. */
export interface WorldRankingIds {
  readonly ac: string | null;
  readonly gc: string | null;
}

/** A player of the rankings who has the name looked for, and where they are from. */
interface Known {
  readonly id: string;
  readonly country: string | null;
}

/**
 * The site's code for the country a person typed, as a player represents it or
 * a team is called it: its name, its two letters or its three, in any case.
 * Nothing where it is not a country, as a club's name is not.
 */
const countryCodeOf = (typed: string): string | undefined => {
  const letters = typed.trim();
  if (letters === "") return undefined;
  return (countryOfLetters(letters) ?? countryNamedInList(letters))?.code;
};

/**
 * The id of the one of `known` the player is, or nothing where the rankings do
 * not know them or where nothing says which of several they are.
 *
 * One player of the name is the player, whatever they represent. Where two or
 * more have it they are told apart by what the player represents, where that
 * is a country one of them is from, and failing that by the country the
 * tournament is played in. A guess would give a player the games of another,
 * so where neither says which, there is no id.
 */
export const idAmong = (
  known: readonly Known[],
  represents: readonly string[],
  tournamentCountry: string | undefined,
): string | undefined => {
  if (known.length === 0) return undefined;
  if (known.length === 1) return known[0]?.id;
  const fromOneOf = (countries: readonly string[]): string | undefined => {
    const from = known.filter(
      (each) => each.country !== null && countries.includes(each.country),
    );
    return from.length === 1 ? from[0]?.id : undefined;
  };
  const represented = represents
    .map(countryCodeOf)
    .filter((code) => code !== undefined);
  return (
    fromOneOf(represented) ??
    (tournamentCountry === undefined
      ? undefined
      : fromOneOf([tournamentCountry]))
  );
};

/** The ids with `id` in the column of `sport`, and the other left empty. */
const idsOf = (sport: string, id: string | undefined): WorldRankingIds => ({
  ac: sport === "ac" ? (id ?? null) : null,
  gc: sport === "gc" ? (id ?? null) : null,
});

/**
 * The ids the site gave the world ranking player of a tournament's player
 * whose tournament is of `sport`, whose name the rankings know them by is
 * `name`, who represents or whose team is called `represents`, in a
 * tournament played in `tournamentCountry`.
 */
export const worldRankingIdsOf = async (
  connection: Asking,
  sport: string | undefined,
  name: string,
  represents: readonly string[],
  tournamentCountry: string | undefined,
): Promise<WorldRankingIds> => {
  const rankings = sport === undefined ? undefined : RANKINGS[sport];
  if (sport === undefined || rankings === undefined) {
    return { ac: null, gc: null };
  }
  const { rows } = await connection.query<{
    id: string;
    country: string | null;
  }>(
    `select ${rankings.id} as id,
            country
       from ${rankings.table} where name = $1`,
    [name],
  );
  return idsOf(sport, idAmong(rows, represents, tournamentCountry));
};

interface Kept {
  readonly id: string;
  readonly name: string;
  readonly represents: readonly string[];
  readonly country: string;
  readonly sport: string;
  readonly ac: string | null;
  readonly gc: string | null;
}

// The two tables a tournament's players are kept in, as what looking for an id
// needs of each: for a player of a tournament what they represent, and for a
// player of a team what the team is called.
const SELECTED = `
  select p.player_id as id, p.world_ranking_name as name,
         case when p.representing is null then array[]::text[]
              else array[p.representing] end as represents,
         t.country, t.sport,
         p.ac_world_ranking_id as ac, p.gc_world_ranking_id as gc
    from tournament_players p
    join tournaments t on t.tournament_id = p.tournament_id
   where ($1::text is null or t.sport = $1)
     and ($2::text is null or t.tournament_id = $2)
  union all
  select p.player_id, p.world_ranking_name, array[m.short_name, m.name],
         t.country, t.sport, p.ac_world_ranking_id, p.gc_world_ranking_id
    from tournament_team_players p
    join tournament_teams m on m.team_id = p.team_id
    join tournaments t on t.tournament_id = m.tournament_id
   where ($1::text is null or t.sport = $1)
     and ($2::text is null or t.tournament_id = $2)`;

/**
 * Looks for the id again of every player of the tournaments of `sport`, or of
 * the tournament `tournament` whichever sport it is, and keeps the ids that are
 * not what they were. Done where what the ids are looked for by has changed:
 * the rankings' players, or the tournament's sport or country, or what a team
 * is called.
 */
export const lookForIdsAgain = async (
  connection: Asking,
  of: { readonly sport?: string; readonly tournament?: string },
): Promise<void> => {
  const { rows: players } = await connection.query<Kept>(SELECTED, [
    of.sport ?? null,
    of.tournament ?? null,
  ]);
  if (players.length === 0) return;

  // The rankings' players are read once for the sport and not once for each
  // player of it, since a sport's whole tournaments are looked at at a time.
  const known = new Map<string, Map<string, Known[]>>();
  for (const sport of new Set(players.map((each) => each.sport))) {
    const rankings = RANKINGS[sport];
    const byName = new Map<string, Known[]>();
    if (rankings !== undefined) {
      const { rows: listed } = await connection.query<{
        name: string;
        id: string;
        country: string | null;
      }>(`select name, ${rankings.id} as id, country from ${rankings.table}`);
      for (const row of listed) {
        const same = byName.get(row.name) ?? [];
        same.push({ id: row.id, country: row.country });
        byName.set(row.name, same);
      }
    }
    known.set(sport, byName);
  }

  const changed = players
    .map((player) => ({
      id: player.id,
      was: { ac: player.ac, gc: player.gc },
      now: idsOf(
        player.sport,
        idAmong(
          known.get(player.sport)?.get(player.name) ?? [],
          player.represents,
          player.country,
        ),
      ),
    }))
    .filter(
      (each) => each.was.ac !== each.now.ac || each.was.gc !== each.now.gc,
    );
  if (changed.length === 0) return;

  const ids = changed.map((each) => each.id);
  const acs = changed.map((each) => each.now.ac);
  const gcs = changed.map((each) => each.now.gc);
  // A player's id is unique to its table, so the update of the one it is not in
  // finds nothing.
  for (const table of ["tournament_players", "tournament_team_players"]) {
    await connection.query(
      `update ${table}
          set ac_world_ranking_id = given.ac, gc_world_ranking_id = given.gc
         from unnest($1::text[], $2::text[], $3::text[])
              as given (id, ac, gc)
        where ${table}.player_id = given.id`,
      [ids, acs, gcs],
    );
  }
};
