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
    `delete from competition_standings where competition_id = $1`,
    [competition],
  );
  await connection.query(
    `update competitions set level_on_matches_won = false
      where competition_id = $1`,
    [competition],
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
 */
export const standCompetition = async (
  connection: PoolClient,
  competition: string,
): Promise<void> => {
  const shape = await connection.query<{
    kind: string | null;
    best_of: number | null;
    tie_break: string | null;
  }>(
    `select kind, best_of, tie_break from competitions where competition_id = $1`,
    [competition],
  );
  const [row] = shape.rows;
  // Where it cannot be stood, nothing is kept of it, so that what was kept
  // when it could is not served as if it still held.
  if (row?.kind !== "block" && row?.kind !== "swiss") {
    await nothingKept(connection, competition);
    return;
  }

  const entries = await connection.query<{
    entry_id: string;
    withdrawn: boolean;
    carry_match_wins: number | null;
    carry_match_losses: number | null;
    carry_game_wins: number | null;
    carry_game_losses: number | null;
    carry_hoops_for: number | null;
    carry_hoops_against: number | null;
  }>(
    `select entry_id, withdrawn, carry_match_wins, carry_match_losses,
            carry_game_wins, carry_game_losses, carry_hoops_for,
            carry_hoops_against
       from competition_entries where competition_id = $1
      order by position`,
    [competition],
  );
  const games = await connection.query<{
    game_id: string;
    winner_id: string;
    winner_score: string;
    loser_id: string;
    loser_score: string;
    drawn: boolean;
    archived: boolean;
    withdrawn: boolean;
  }>(
    `select game_id, winner_id, winner_score, loser_id, loser_score, drawn,
            archived, withdrawn
       from competition_games where competition_id = $1
      order by position`,
    [competition],
  );
  const toStand = entries.rows.map((each): EntryToStand => ({
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
  const played = games.rows.map((each): GameKept => ({
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

  let stood: StandingsToKeep;
  if (row.kind === "block") {
    // The rules a block is told of by its tournament's events, which may not
    // have been projected yet.
    if (row.best_of === null || row.tie_break === null) {
      await nothingKept(connection, competition);
      return;
    }
    stood = standBlock(
      toStand,
      played,
      row.best_of,
      TieBreak.from(row.tie_break),
    );
  } else {
    stood = standSwiss(toStand, played);
  }

  await connection.query(
    `delete from competition_standings where competition_id = $1`,
    [competition],
  );
  // All of the lines in one statement, since a block has a line a player.
  const lines = stood.standings;
  if (lines.length > 0) {
    await connection.query(
      `insert into competition_standings
         (entry_id, competition_id, rank, played, won, lost, games_won,
          net_games, net_hoops, withdrawn, place, shared)
       select entry_id, $1, rank, played, won, lost, games_won, net_games,
              net_hoops, withdrawn, place, shared
         from unnest($2::text[], $3::int[], $4::int[], $5::int[], $6::int[],
                     $7::int[], $8::int[], $9::int[], $10::boolean[],
                     $11::int[], $12::boolean[])
              as t(entry_id, rank, played, won, lost, games_won, net_games,
                   net_hoops, withdrawn, place, shared)`,
      [
        competition,
        lines.map((each) => each.entryId),
        lines.map((each) => each.rank),
        lines.map((each) => each.played),
        lines.map((each) => each.won),
        lines.map((each) => each.lost ?? null),
        lines.map((each) => each.gamesWon ?? null),
        lines.map((each) => each.netGames ?? null),
        lines.map((each) => each.netHoops),
        lines.map((each) => each.withdrawn),
        lines.map((each) => each.place ?? null),
        lines.map((each) => each.shared),
      ],
    );
  }
  await connection.query(
    `update competitions set level_on_matches_won = $2
      where competition_id = $1`,
    [competition, stood.levelOnMatchesWon],
  );
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
      lost: number | null;
      games_won: number | null;
      net_games: number | null;
      net_hoops: number;
      withdrawn: boolean;
      place: number | null;
      shared: boolean;
    }>(
      `select s.entry_id, e.tournament_player_id, s.rank, s.played, s.won,
              s.lost, s.games_won, s.net_games, s.net_hoops, s.withdrawn, s.place,
              s.shared
         from competition_standings s
         join competition_entries e on e.entry_id = s.entry_id
        where s.competition_id = $1
        order by s.rank`,
      [competition],
    );
    const level = await connection.query<{ level_on_matches_won: boolean }>(
      `select level_on_matches_won from competitions where competition_id = $1`,
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
        lost: each.lost ?? undefined,
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
