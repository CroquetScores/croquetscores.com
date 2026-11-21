import type { PoolClient } from "pg";

import type {
  CompetitionStandings as Asked,
  EntryToStand,
  StandingRead,
  StandingsKept,
  StandingsToKeep,
} from "../../application/operations/tournaments/competitionStandings.js";
import type { GameKept } from "../../application/operations/tournaments/competitionGames.js";
import {
  standBlock,
  standSwiss,
} from "../../application/operations/tournaments/standingsToKeep.js";
import { TieBreak } from "../../domain/aggregates/tournaments/value-objects/TieBreak.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

const nothingKept = async (
  connection: PoolClient,
  competition: string,
): Promise<void> => {
  await connection.query(
    `delete from competition_standings
      where entry_id in (select entry_id from competition_entries
                          where competition_id = $1)`,
    [competition],
  );
  await connection.query(
    `delete from competition_standings_kept where competition_id = $1`,
    [competition],
  );
};

interface Shape {
  kind: string | null;
  best_of: number | null;
  tie_break: string | null;
}

interface EntryRow {
  entry_id: string;
  withdrawn: boolean;
  carry_match_wins: number | null;
  carry_match_losses: number | null;
  carry_game_wins: number | null;
  carry_game_losses: number | null;
  carry_hoops_for: number | null;
  carry_hoops_against: number | null;
}

interface GameRow {
  game_id: string;
  winner_id: string;
  winner_score: string;
  loser_id: string;
  loser_score: string;
  drawn: boolean;
  archived: boolean;
  withdrawn: boolean;
}

const entryColumns = `entry_id, withdrawn, carry_match_wins, carry_match_losses,
            carry_game_wins, carry_game_losses, carry_hoops_for,
            carry_hoops_against`;
const gameColumns = `game_id, winner_id, winner_score, loser_id, loser_score,
            drawn, archived, withdrawn`;

/** Whether what a competition is says it has standings to keep. */
const hasStandings = (shape: Shape | undefined): boolean =>
  shape?.kind === "block" || shape?.kind === "swiss";

/**
 * The standings of a competition of this `shape`, its `entries` and its
 * `games`, or nothing where it has none to keep: it is not a block or a Swiss,
 * or it is a block whose rules, which only its tournament's events say, are not
 * known yet.
 */
const standingsOf = (
  shape: Shape | undefined,
  entries: readonly EntryRow[],
  games: readonly GameRow[],
): StandingsToKeep | undefined => {
  if (shape === undefined || !hasStandings(shape)) return undefined;
  const toStand = entries.map((each): EntryToStand => ({
    id: each.entry_id,
    withdrawn: each.withdrawn,
    carried: {
      matchWins: each.carry_match_wins ?? undefined,
      matchLosses: each.carry_match_losses ?? undefined,
      gameWins: each.carry_game_wins ?? undefined,
      gameLosses: each.carry_game_losses ?? undefined,
      hoopsFor: each.carry_hoops_for ?? undefined,
      hoopsAgainst: each.carry_hoops_against ?? undefined,
    },
  }));
  const played = games.map((each): GameKept => ({
    id: each.game_id,
    winner: each.winner_id,
    winnerScore: each.winner_score,
    loser: each.loser_id,
    loserScore: each.loser_score,
    drawn: each.drawn,
    archived: each.archived,
    withdrawn: each.withdrawn,
    changedAt: undefined,
  }));
  if (shape.kind === "swiss") return standSwiss(toStand, played);
  // The rules a block is told of by its tournament's events, which may not
  // have been projected yet.
  if (shape.best_of === null || shape.tie_break === null) return undefined;
  return standBlock(
    toStand,
    played,
    shape.best_of,
    TieBreak.from(shape.tie_break),
  );
};

type Line = StandingsToKeep["standings"][number];

// Every line in one statement, since a block has a line a player, each with the
// moment it was last changed.
const linesWritten = async (
  connection: PoolClient,
  lines: readonly { readonly line: Line; readonly moment: string }[],
): Promise<void> => {
  if (lines.length === 0) return;
  await connection.query(
    `insert into competition_standings
       (entry_id, rank, played, won, games_won, net_games, net_hoops,
        place, shared, changed_at)
     select entry_id, rank, played, won, games_won, net_games,
            net_hoops, place, shared, changed_at
       from unnest($1::text[], $2::int[], $3::int[], $4::int[], $5::int[],
                   $6::int[], $7::int[], $8::int[], $9::boolean[],
                   $10::timestamptz[])
            as t(entry_id, rank, played, won, games_won, net_games,
                 net_hoops, place, shared, changed_at)`,
    [
      lines.map((each) => each.line.entryId),
      lines.map((each) => each.line.rank),
      lines.map((each) => each.line.played),
      lines.map((each) => each.line.won),
      lines.map((each) => each.line.gamesWon ?? null),
      lines.map((each) => each.line.netGames ?? null),
      lines.map((each) => each.line.netHoops),
      lines.map((each) => each.line.place ?? null),
      lines.map((each) => each.line.shared),
      lines.map((each) => each.moment),
    ],
  );
};

/**
 * The standings of the block or Swiss `competition`, worked out of what the
 * read models keep of it and written, in place of what was kept before. Called
 * after every event that can change them, by whichever read model projected it:
 * the competition's own events, which say its players, their carry forward and
 * its games, and the tournament's, which say what a block is played as. Where
 * the competition is not yet known to be a block or a Swiss, which only the
 * tournament's events say, nothing is written: that event is still to come, and
 * writes them.
 *
 * Done afresh each time, from the rows as they are, so that it does not matter
 * which stream a rebuild reads first, and doing it twice does what once did.
 * `at` is the `occurredAt` of the last event that could change them: a line
 * that comes out as it was is kept as it was, with its moment, so that a
 * moment moves only when an event changes that line.
 */
export const standCompetition = async (
  connection: PoolClient,
  competition: string,
  at: string,
): Promise<void> => {
  const shape = await connection.query<Shape>(
    `select kind, best_of, tie_break from competitions where competition_id = $1`,
    [competition],
  );
  // Where it cannot be stood, nothing is kept of it, so that what was kept
  // when it could is not served as if it still held.
  if (!hasStandings(shape.rows[0])) {
    await nothingKept(connection, competition);
    return;
  }

  const entries = await connection.query<EntryRow>(
    `select ${entryColumns}
       from competition_entries where competition_id = $1
      order by position`,
    [competition],
  );
  const games = await connection.query<GameRow>(
    `select ${gameColumns}
       from competition_games where competition_id = $1
      order by position`,
    [competition],
  );
  const stood = standingsOf(shape.rows[0], entries.rows, games.rows);
  if (stood === undefined) {
    await nothingKept(connection, competition);
    return;
  }

  const before = await connection.query<{
    entry_id: string;
    rank: number;
    played: number;
    won: number;
    games_won: number | null;
    net_games: number | null;
    net_hoops: number;
    place: number | null;
    shared: boolean;
    changed_at: Date | null;
  }>(
    `select s.entry_id, s.rank, s.played, s.won, s.games_won,
            s.net_games, s.net_hoops, s.place, s.shared, s.changed_at
       from competition_standings s
       join competition_entries e on e.entry_id = s.entry_id
      where e.competition_id = $1`,
    [competition],
  );
  const was = new Map(before.rows.map((each) => [each.entry_id, each]));
  const momentOf = (each: Line): string => {
    const old = was.get(each.entryId);
    const same =
      old !== undefined &&
      old.rank === each.rank &&
      old.played === each.played &&
      old.won === each.won &&
      old.games_won === (each.gamesWon ?? null) &&
      old.net_games === (each.netGames ?? null) &&
      old.net_hoops === each.netHoops &&
      old.place === (each.place ?? null) &&
      old.shared === each.shared;
    return same && old.changed_at !== null ? old.changed_at.toISOString() : at;
  };
  await connection.query(
    `delete from competition_standings
      where entry_id in (select entry_id from competition_entries
                          where competition_id = $1)`,
    [competition],
  );
  await linesWritten(
    connection,
    stood.standings.map((line) => ({ line, moment: momentOf(line) })),
  );
  // Its moment moves only when what it says does, as a line's does.
  await connection.query(
    `insert into competition_standings_kept
       (competition_id, level_on_matches_won, changed_at)
     values ($1, $2, $3)
     on conflict (competition_id) do update
       set level_on_matches_won = excluded.level_on_matches_won,
           changed_at = case
             when competition_standings_kept.level_on_matches_won
                    = excluded.level_on_matches_won
                  and competition_standings_kept.changed_at is not null
             then competition_standings_kept.changed_at
             else excluded.changed_at end`,
    [competition, stood.levelOnMatchesWon, at],
  );
};

// How many competitions are worked out in one reading of their rows.
const COMPETITIONS_TO_A_READING = 300;

/**
 * The competitions whose standings are to be made, and when each last had an
 * event that could change them, for a rebuild of the read models to make once
 * the rest is written.
 *
 * A rebuild writes every competition's players and games in one stream and
 * what a block is played as in another, and each says the standings are to be
 * worked out again. Worked out after each they are worked out two or three times
 * for every competition, at five readings a time, with the tables not yet
 * whole. Noted instead, they are worked out once, from the whole, many
 * competitions to a reading. Each line's moment is the last of the moments
 * noted, where made after every event it was the moment of the last that changed
 * the line, which a rebuild in another order would have made another.
 */
export class StandingsToMake {
  readonly #at = new Map<string, string>();

  /** Notes that the standings of `competition` are to be made, as of `at`. */
  note(competition: string, at: string): void {
    const noted = this.#at.get(competition);
    // Moments are written the same way, so the later is the greater as text.
    if (noted === undefined || at > noted) this.#at.set(competition, at);
  }

  /** Makes every standing noted, and forgets them. */
  async makeAll(connection: PoolClient): Promise<void> {
    const noted = new Map(this.#at);
    this.#at.clear();
    const competitions = [...noted.keys()];
    for (
      let from = 0;
      from < competitions.length;
      from += COMPETITIONS_TO_A_READING
    ) {
      await this.#makeSome(
        connection,
        competitions.slice(from, from + COMPETITIONS_TO_A_READING),
        noted,
      );
    }
  }

  async #makeSome(
    connection: PoolClient,
    competitions: readonly string[],
    noted: ReadonlyMap<string, string>,
  ): Promise<void> {
    const shapes = await connection.query<Shape & { competition_id: string }>(
      `select competition_id, kind, best_of, tie_break
         from competitions where competition_id = any($1)`,
      [[...competitions]],
    );
    const entries = await connection.query<
      EntryRow & { competition_id: string }
    >(
      `select competition_id, ${entryColumns}
         from competition_entries where competition_id = any($1)
        order by competition_id, position`,
      [[...competitions]],
    );
    const games = await connection.query<GameRow & { competition_id: string }>(
      `select competition_id, ${gameColumns}
         from competition_games where competition_id = any($1)
        order by competition_id, position`,
      [[...competitions]],
    );
    const shapeOf = new Map(
      shapes.rows.map((row) => [row.competition_id, row]),
    );
    const entriesOf = groupedByCompetition(entries.rows);
    const gamesOf = groupedByCompetition(games.rows);

    const lines: { line: Line; moment: string }[] = [];
    const kept: { competition: string; level: boolean; moment: string }[] = [];
    for (const competition of competitions) {
      const moment = noted.get(competition) ?? "";
      const stood = standingsOf(
        shapeOf.get(competition),
        entriesOf.get(competition) ?? [],
        gamesOf.get(competition) ?? [],
      );
      if (stood === undefined) continue;
      for (const line of stood.standings) lines.push({ line, moment });
      kept.push({
        competition,
        level: stood.levelOnMatchesWon,
        moment,
      });
    }
    // What was kept of them before goes, as it does when they are worked out one
    // at a time: a rebuild of this read model alone leaves the rest as it was.
    await connection.query(
      `delete from competition_standings
        where entry_id = any(array(select entry_id from competition_entries
                                    where competition_id = any($1)))`,
      [[...competitions]],
    );
    await connection.query(
      `delete from competition_standings_kept where competition_id = any($1)`,
      [[...competitions]],
    );
    await linesWritten(connection, lines);
    if (kept.length === 0) return;
    await connection.query(
      `insert into competition_standings_kept
         (competition_id, level_on_matches_won, changed_at)
       select competition_id, level_on_matches_won, changed_at
         from unnest($1::text[], $2::boolean[], $3::timestamptz[])
              as t(competition_id, level_on_matches_won, changed_at)`,
      [
        kept.map((each) => each.competition),
        kept.map((each) => each.level),
        kept.map((each) => each.moment),
      ],
    );
  }
}

const groupedByCompetition = <T extends { competition_id: string }>(
  rows: readonly T[],
): Map<string, T[]> => {
  const grouped = new Map<string, T[]>();
  for (const row of rows) {
    const these = grouped.get(row.competition_id);
    if (these === undefined) grouped.set(row.competition_id, [row]);
    else these.push(row);
  }
  return grouped;
};

// One list of what is to be made for each unit of work, so that the read models
// that note a competition and the one that makes them all, which are put
// together separately, are speaking of the same.
const toMake = new WeakMap<UnitOfWork, StandingsToMake>();

/** What is to be made, for the unit of work every read model is put together over. */
export const standingsToMakeOf = (unitOfWork: UnitOfWork): StandingsToMake => {
  let found = toMake.get(unitOfWork);
  if (found === undefined) {
    found = new StandingsToMake();
    toMake.set(unitOfWork, found);
  }
  return found;
};

/**
 * What the pages of a block and a Swiss, and the API, read of the standings
 * that `standCompetition` keeps. It keeps nothing itself: it is not a
 * projection, and is asked in the request that asks it.
 */
export class CompetitionStandings implements Asked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async standingsKept(competition: string): Promise<StandingsKept> {
    const connection = this.unitOfWork.connection();
    const rows = await connection.query<{
      entry_id: string;
      tournament_player_id: string;
      rank: number;
      played: number;
      won: number;
      kind: string;
      games_won: number | null;
      net_games: number | null;
      net_hoops: number;
      withdrawn: boolean;
      place: number | null;
      shared: boolean;
    }>(
      `select s.entry_id, e.tournament_player_id, s.rank, s.played, s.won,
              c.kind, s.games_won, s.net_games, s.net_hoops, e.withdrawn, s.place,
              s.shared
         from competition_standings s
         join competition_entries e on e.entry_id = s.entry_id
         join competitions c on c.competition_id = e.competition_id
        where e.competition_id = $1
        order by s.rank`,
      [competition],
    );
    const level = await connection.query<{ level_on_matches_won: boolean }>(
      `select level_on_matches_won from competition_standings_kept
        where competition_id = $1`,
      [competition],
    );
    return {
      levelOnMatchesWon: level.rows[0]?.level_on_matches_won ?? false,
      standings: rows.rows.map((each): StandingRead => ({
        entryId: each.entry_id,
        tournamentPlayerId: each.tournament_player_id,
        rank: each.rank,
        played: each.played,
        won: each.won,
        // Every match a block's player played they won or lost, and a Swiss
        // says nothing of matches lost.
        lost: each.kind === "block" ? each.played - each.won : undefined,
        gamesWon: each.games_won ?? undefined,
        netGames: each.net_games ?? undefined,
        netHoops: each.net_hoops,
        withdrawn: each.withdrawn,
        place: each.place ?? undefined,
        shared: each.shared,
      })),
    };
  }
}
