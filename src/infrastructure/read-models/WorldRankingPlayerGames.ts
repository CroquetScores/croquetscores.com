import type {
  KeptWorldRankingPlayerGame,
  WorldRankingPlayerGamesKept,
} from "../../application/services/WorldRankingPlayers.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/**
 * The games of each association croquet world ranking player, read from what
 * the competitions' and tournaments' read models already keep
 * (`worldRankingPlayerGames.feature`), so nothing is projected for it and
 * nothing is asked of the events.
 *
 * A tournament keeps no link to the rankings' players: a player is the
 * rankings' by the name the tournament says the rankings know them by, which
 * is what the players' dialogs offer from the rankings' list. So a game is a
 * ranking player's where one of its sides has that name, in a tournament of
 * association croquet, whether or not the competition counts towards the
 * rankings.
 */
export class WorldRankingPlayerGames implements WorldRankingPlayerGamesKept {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async changedAfter(
    playerId: string,
    changedSince: ReadOnlyDate | undefined,
  ): Promise<readonly KeptWorldRankingPlayerGame[] | undefined> {
    const connection = this.unitOfWork.connection();
    const { rows: known } = await connection.query<{ name: string }>(
      `select name from ac_world_ranking_players
        where ac_world_ranking_id = $1`,
      [playerId],
    );
    const [player] = known;
    if (player === undefined) return undefined;

    // A game names its sides by the id the competition gives a player, or by
    // a team player's id in a test. Only the sides that are this player's are
    // found by name, and the other side of each game is looked up by its id,
    // so that nothing is read of the players who are nobody's concern here.
    //
    // Where both sides of a game are this player's, which two tournament
    // players of one world ranking name can make, the winner's side is the
    // one told of, so that the game is listed once.
    //
    // In the order the games were added, and by nothing else, so that an app
    // that reads them in pages meets a game later than every one it has read.
    // One added before the website kept when has none, and is the oldest.
    //
    // A game of an archived competition or tournament says it is archived and
    // changed when that was done, so that an app that kept it is told it no
    // longer counts. A competition is only given a moment when something
    // changed in it, so that of an archived one is the latest it knows. One
    // restored after is not told again, since nothing marks the moment.
    const { rows } = await connection.query<{
      game_id: string;
      tournament_id: string;
      competition_id: string;
      is_winner: boolean;
      winner_score: string;
      loser_score: string;
      drawn: boolean;
      archived: boolean;
      withdrawn: boolean;
      added_at: Date | null;
      changed_at: Date;
      opponent_id: string | null;
      opponent_name: string;
    }>(
      `with mine as (
         select e.competition_id, e.entry_id as side_id
           from tournament_players p
           join competition_entries e on e.tournament_player_id = p.player_id
          where p.world_ranking_name = $1
         union all
         select c.competition_id, t.player_id as side_id
           from tournament_team_players t
           join competitions c
             on t.team_id in (c.first_team_id, c.second_team_id)
          where t.world_ranking_name = $1
       ),
       told as (
         select g.*, c.tournament_id,
                c.archived or t.archived or g.archived as told_archived,
                greatest(g.changed_at,
                         case when c.archived then c.changed_at end,
                         t.archived_at) as told_changed_at,
                me.side_id = g.winner_id as is_winner,
                case when me.side_id = g.winner_id
                     then g.loser_id else g.winner_id end as other_id
           from mine me
           join competition_games g
             on g.competition_id = me.competition_id
            and me.side_id in (g.winner_id, g.loser_id)
           join competitions c on c.competition_id = g.competition_id
           join tournaments t
             on t.tournament_id = c.tournament_id and t.sport = 'ac'
          where me.side_id = g.winner_id
             or not exists (select 1 from mine other
                             where other.competition_id = g.competition_id
                               and other.side_id = g.winner_id)
       )
       select told.game_id, told.tournament_id, told.competition_id,
              told.is_winner, told.winner_score, told.loser_score,
              told.drawn, told.told_archived as archived, told.withdrawn,
              told.added_at, told.told_changed_at as changed_at,
              opponent.ac_world_ranking_id as opponent_id,
              coalesce(opponent.name, other.name) as opponent_name
         from told
         cross join lateral (
           select p.world_ranking_name, p.name
             from competition_entries e
             join tournament_players p on p.player_id = e.tournament_player_id
            where e.entry_id = told.other_id
           union all
           select t.world_ranking_name, t.name
             from tournament_team_players t
            where t.player_id = told.other_id
         ) other
         left join ac_world_ranking_players opponent
           on opponent.name = other.world_ranking_name
        where $2::timestamptz is null or told.told_changed_at > $2
        order by told.added_at nulls first`,
      [player.name, changedSince?.toDate() ?? null],
    );
    return rows.map((row) => ({
      id: row.game_id,
      tournamentId: row.tournament_id,
      competitionId: row.competition_id,
      won: row.is_winner && !row.drawn,
      score: row.is_winner ? row.winner_score : row.loser_score,
      opponentScore: row.is_winner ? row.loser_score : row.winner_score,
      opponentId: row.opponent_id ?? undefined,
      opponentName: row.opponent_name,
      drawn: row.drawn,
      archived: row.archived,
      withdrawn: row.withdrawn,
      addedAt:
        row.added_at === null ? undefined : ReadOnlyDate.from(row.added_at),
      changedAt: ReadOnlyDate.from(row.changed_at),
    }));
  }
}
