import type { Projection } from "../../application/common/Projection.js";
import type {
  CompetitionGames as Asked,
  EntryKept,
  GameKept,
  GamesKept,
  WhoPlayed,
} from "../../application/operations/tournaments/competitionGames.js";
import { CompetitionByeMoved } from "../../domain/aggregates/tournaments/competitions/events/CompetitionByeMoved.js";
import { CompetitionByeRemoved } from "../../domain/aggregates/tournaments/competitions/events/CompetitionByeRemoved.js";
import { CompetitionGameAdded } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameAdded.js";
import { CompetitionGameArchived } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameArchived.js";
import { CompetitionGameCorrected } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameCorrected.js";
import { CompetitionGameMoved } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameMoved.js";
import { CompetitionGameRestored } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameRestored.js";
import { CompetitionGameWithdrawalReversed } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameWithdrawalReversed.js";
import { CompetitionGameWithdrawn } from "../../domain/aggregates/tournaments/competitions/events/CompetitionGameWithdrawn.js";
import { CompetitionPlayerEntered } from "../../domain/aggregates/tournaments/competitions/events/CompetitionPlayerEntered.js";
import { CompetitionPlayerMoved } from "../../domain/aggregates/tournaments/competitions/events/CompetitionPlayerMoved.js";
import { CompetitionPlayerRemoved } from "../../domain/aggregates/tournaments/competitions/events/CompetitionPlayerRemoved.js";
import { CompetitionPlayersSpacedOut } from "../../domain/aggregates/tournaments/competitions/events/CompetitionPlayersSpacedOut.js";
import { CompetitionPlayerWithdrawalReversed } from "../../domain/aggregates/tournaments/competitions/events/CompetitionPlayerWithdrawalReversed.js";
import { CompetitionPlayerWithdrawn } from "../../domain/aggregates/tournaments/competitions/events/CompetitionPlayerWithdrawn.js";
import { CompetitionPlayerId } from "../../domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { Score } from "../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { ORDER_STEP } from "../../domain/common/orders.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

const bye = CompetitionPlayerId.bye().value;

// Every kind of event about one game, each of which says which.
const isAboutAGame = (
  event: DomainEvent,
): event is DomainEvent & { readonly gameId: string } =>
  event instanceof CompetitionGameAdded ||
  event instanceof CompetitionGameArchived ||
  event instanceof CompetitionGameCorrected ||
  event instanceof CompetitionGameMoved ||
  event instanceof CompetitionGameRestored ||
  event instanceof CompetitionGameWithdrawalReversed ||
  event instanceof CompetitionGameWithdrawn;

// Whether nobody won, as a game says it: the winner is not ahead and was not
// marked as the winner.
const drawnBy = (winner: Score, loser: Score): boolean =>
  !winner.isMoreThan(loser) && !winner.marked;

/**
 * The games of each competition, and the players they are played by and what
 * they are played out against, kept as the competition's events say, so that
 * the API asks nothing of the events (`CompetitionGames.feature`).
 *
 * Written event by event from a competition's own stream, which says what its
 * players and games are and not which tournament it is in, so no stream has to
 * come before another when the read models are made again. A game's round in
 * a knockout, and the matches of a test, are worked out when they are asked for
 * from what is kept, since each depends on the games before it.
 *
 * Each is written so that writing it twice leaves what writing it once did.
 */
export class CompetitionGames implements Projection, Asked {
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
    await this.unitOfWork
      .connection()
      .query(
        `truncate competition_entries, competition_byes, competition_games`,
      );
  }

  /** The tables made again from the streams it is handed, in any order. */
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const { event } of events) await this.#project(stream, event);
  }

  async gamesKept(competition: string): Promise<GamesKept> {
    const connection = this.unitOfWork.connection();
    const games = await connection.query<{
      game_id: string;
      winner_id: string;
      winner_score: string;
      loser_id: string;
      loser_score: string;
      drawn: boolean;
      archived: boolean;
      withdrawn: boolean;
      changed_at: Date;
    }>(
      `select game_id, winner_id, winner_score, loser_id, loser_score, drawn,
              archived, withdrawn, changed_at
         from competition_games
        where competition_id = $1
        order by position`,
      [competition],
    );
    const entries = await connection.query<{
      entry_id: string;
      tournament_player_id: string;
      position: number;
      withdrawn: boolean;
    }>(
      `select entry_id, tournament_player_id, position, withdrawn
         from competition_entries where competition_id = $1
        order by position`,
      [competition],
    );
    const byes = await connection.query<{ position: number }>(
      `select position from competition_byes where competition_id = $1
        order by position`,
      [competition],
    );
    const shape = await connection.query<{
      draw_places: number | null;
      draw_rounds: number[] | null;
      placed_by_order: boolean | null;
      first_team_id: string | null;
      second_team_id: string | null;
    }>(
      `select draw_places, draw_rounds, placed_by_order, first_team_id,
              second_team_id
         from competitions where competition_id = $1`,
      [competition],
    );
    const [kept] = shape.rows;
    // Whoever a game names, by the id it names them by: a player of the
    // competition, by the id it gives them, and a player of a team, in a test.
    const who = await connection.query<{
      id: string;
      player_id: string;
      name: string;
      team_id: string | null;
    }>(
      `select e.entry_id as id, p.player_id, p.name, null as team_id
         from competition_entries e
         join tournament_players p on p.player_id = e.tournament_player_id
        where e.competition_id = $1
        union all
       select t.player_id as id, t.player_id, t.name, t.team_id
         from tournament_team_players t
        where t.team_id in ($2, $3)`,
      [competition, kept?.first_team_id ?? null, kept?.second_team_id ?? null],
    );

    return {
      games: games.rows.map((row): GameKept => ({
        id: row.game_id,
        winner: row.winner_id,
        winnerScore: row.winner_score,
        loser: row.loser_id,
        loserScore: row.loser_score,
        drawn: row.drawn,
        archived: row.archived,
        withdrawn: row.withdrawn,
        changedAt:
          row.changed_at === null
            ? undefined
            : ReadOnlyDate.from(row.changed_at),
      })),
      entries: entries.rows.map((row): EntryKept => ({
        id: row.entry_id,
        tournamentPlayerId: row.tournament_player_id,
        order: row.position,
        withdrawn: row.withdrawn,
      })),
      byes: byes.rows.map((row) => row.position),
      draw:
        kept?.draw_places == null || kept.draw_rounds == null
          ? undefined
          : {
              places: kept.draw_places,
              rounds: kept.draw_rounds,
              placedByOrder: kept.placed_by_order === true,
            },
      firstTeam: kept?.first_team_id ?? undefined,
      who: new Map(
        who.rows.map((row): [string, WhoPlayed] => [
          row.id,
          {
            playerId: row.player_id,
            name: row.name,
            team: row.team_id ?? undefined,
          },
        ]),
      ),
    };
  }

  // Each written so that writing it twice leaves what writing it once did,
  // which is what makes projecting the same events again change nothing.
  async #project(stream: string, event: DomainEvent): Promise<void> {
    if (!stream.startsWith("competition/")) return;
    const connection = this.unitOfWork.connection();

    // Its players and byes --------------------------------------------------
    if (event instanceof CompetitionPlayerEntered) {
      if (event.playerId === bye) {
        await connection.query(
          `insert into competition_byes (competition_id, position)
           values ($1, $2) on conflict do nothing`,
          [stream, event.order],
        );
      } else {
        await connection.query(
          `insert into competition_entries
             (entry_id, competition_id, tournament_player_id, position)
           values ($1, $2, $3, $4)
           on conflict (entry_id) do update
             set tournament_player_id = excluded.tournament_player_id,
                 position = excluded.position`,
          [event.playerId, stream, event.tournamentPlayerId, event.order],
        );
      }
    } else if (event instanceof CompetitionPlayerMoved) {
      await connection.query(
        `update competition_entries set position = $2 where entry_id = $1`,
        [event.playerId, event.order],
      );
    } else if (event instanceof CompetitionByeMoved) {
      await connection.query(
        `update competition_byes set position = $3
          where competition_id = $1 and position = $2`,
        [stream, event.fromOrder, event.order],
      );
    } else if (event instanceof CompetitionByeRemoved) {
      await connection.query(
        `delete from competition_byes
          where competition_id = $1 and position = $2`,
        [stream, event.order],
      );
    } else if (event instanceof CompetitionPlayersSpacedOut) {
      // By place rather than by id, since every bye has the same id: the
      // players are said in the order they are in, byes among them.
      const byes: number[] = [];
      for (const [index, id] of event.playerIds.entries()) {
        const order = (index + 1) * ORDER_STEP;
        if (id === bye) byes.push(order);
        else {
          await connection.query(
            `update competition_entries set position = $2 where entry_id = $1`,
            [id, order],
          );
        }
      }
      await connection.query(
        `delete from competition_byes where competition_id = $1`,
        [stream],
      );
      for (const order of byes) {
        await connection.query(
          `insert into competition_byes (competition_id, position)
           values ($1, $2)`,
          [stream, order],
        );
      }
    } else if (event instanceof CompetitionPlayerWithdrawn) {
      await connection.query(
        `update competition_entries set withdrawn = true, position = $2
          where entry_id = $1`,
        [event.playerId, event.order],
      );
    } else if (event instanceof CompetitionPlayerWithdrawalReversed) {
      await connection.query(
        `update competition_entries set withdrawn = false
          where entry_id = $1`,
        [event.playerId],
      );
    } else if (event instanceof CompetitionPlayerRemoved) {
      // Only archived games are left of a player who is removed, and they go
      // with them.
      await connection.query(
        `delete from competition_entries where entry_id = $1`,
        [event.playerId],
      );
      await connection.query(
        `delete from competition_games
          where competition_id = $1 and (winner_id = $2 or loser_id = $2)`,
        [stream, event.playerId],
      );

      // Its games ------------------------------------------------------------
    } else if (event instanceof CompetitionGameAdded) {
      const winner = Score.kept(event.winnerScore, event.winnerMarked);
      const loser = Score.kept(event.loserScore, false);
      await connection.query(
        `insert into competition_games
           (game_id, competition_id, position, winner_id, winner_score,
            loser_id, loser_score, drawn, changed_at)
         values ($1, $2,
                 (select coalesce(max(position), 0) + 1
                    from competition_games where competition_id = $2),
                 $3, $4, $5, $6, $7, $8)
         -- Adding it again must not undo a correction made since.
         on conflict (game_id) do update
           set changed_at = greatest(competition_games.changed_at,
                                     excluded.changed_at)`,
        [
          event.gameId,
          stream,
          event.winnerId,
          winner.toString(),
          event.loserId,
          loser.toString(),
          drawnBy(winner, loser),
          event.occurredAt.toISOString(),
        ],
      );
    } else if (event instanceof CompetitionGameCorrected) {
      const winner = Score.kept(event.winnerScore, event.winnerMarked);
      const loser = Score.kept(event.loserScore, false);
      // One that says no players keeps its own.
      await connection.query(
        `update competition_games
            set winner_score = $2, loser_score = $3, drawn = $4,
                winner_id = coalesce($5, winner_id),
                loser_id = coalesce($6, loser_id)
          where game_id = $1`,
        [
          event.gameId,
          winner.toString(),
          loser.toString(),
          drawnBy(winner, loser),
          event.winnerId ?? null,
          event.loserId ?? null,
        ],
      );
    } else if (event instanceof CompetitionGameArchived) {
      await this.#setGame(event.gameId, "archived", true);
    } else if (event instanceof CompetitionGameRestored) {
      await this.#setGame(event.gameId, "archived", false);
    } else if (event instanceof CompetitionGameWithdrawn) {
      await this.#setGame(event.gameId, "withdrawn", true);
    } else if (event instanceof CompetitionGameWithdrawalReversed) {
      await this.#setGame(event.gameId, "withdrawn", false);
    } else if (event instanceof CompetitionGameMoved) {
      await this.#moveGame(stream, event.gameId, event.direction);
    }
    // Every event about a game, whatever it did, is the game's last change.
    if (isAboutAGame(event)) {
      await connection.query(
        `update competition_games set changed_at = greatest(changed_at, $2)
          where game_id = $1`,
        [event.gameId, event.occurredAt.toISOString()],
      );
    }
  }

  async #setGame(
    game: string,
    flag: "archived" | "withdrawn",
    value: boolean,
  ): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`update competition_games set ${flag} = $2 where game_id = $1`, [
        game,
        value,
      ]);
  }

  // A game moved is put in the place of the one beside it among those that
  // count, which is the one it is swapped with; none at the end of the list.
  async #moveGame(
    competition: string,
    game: string,
    direction: "up" | "down",
  ): Promise<void> {
    const connection = this.unitOfWork.connection();
    const { rows } = await connection.query<{
      game_id: string;
      position: number;
    }>(
      `select game_id, position from competition_games
        where competition_id = $1 and not archived and not withdrawn
        order by position`,
      [competition],
    );
    const at = rows.findIndex((row) => row.game_id === game);
    const other = rows[direction === "up" ? at - 1 : at + 1];
    const moved = rows[at];
    if (at === -1 || other === undefined || moved === undefined) return;
    await connection.query(
      `update competition_games
          set position = case game_id when $1 then $4::integer else $3::integer end
        where game_id in ($1, $2)`,
      [game, other.game_id, moved.position, other.position],
    );
  }
}
