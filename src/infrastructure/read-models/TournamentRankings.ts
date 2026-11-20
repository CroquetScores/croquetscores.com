import type {
  CompetitionToRank,
  TournamentRankings as Asked,
  TournamentToRank,
} from "../../application/operations/tournaments/tournamentRankings.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/**
 * What the rankings file takes of a tournament that no page's own data says. It
 * keeps nothing itself: it asks what `Tournaments` and `TournamentContents`
 * keep, in the request that asks it (`PublicRankingsOfTournament.feature`).
 */
export class TournamentRankings implements Asked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async tournament(id: string): Promise<TournamentToRank | undefined> {
    const connection = this.unitOfWork.connection();
    const found = await connection.query<{
      starts: string;
      finishes: string;
      country: string;
      region: string | null;
    }>(
      `select to_char(starts, 'YYYY-MM-DD') as starts,
              to_char(finishes, 'YYYY-MM-DD') as finishes, country, region
         from tournaments where tournament_id = $1`,
      [id],
    );
    const [row] = found.rows;
    if (row === undefined) return undefined;

    const competitions = await connection.query<{
      competition_id: string;
      name: string;
      kind: CompetitionToRank["kind"];
      world_rankings: boolean;
      changed_at: Date;
    }>(
      `select competition_id, name, kind, world_rankings, changed_at
         from competitions
        where tournament_id = $1 and not archived and kind is not null
        order by position, competition_id`,
      [id],
    );
    // An archived player is named too, since a game they played still is.
    const players = await connection.query<{
      player_id: string;
      world_ranking_name: string;
    }>(
      `select player_id, world_ranking_name from tournament_players
        where tournament_id = $1
       union all
       select player_id, world_ranking_name from tournament_team_players
        where tournament_id = $1`,
      [id],
    );
    return {
      starts: row.starts,
      finishes: row.finishes,
      country: row.country,
      region: row.region ?? undefined,
      competitions: competitions.rows.map((each) => ({
        id: each.competition_id,
        name: each.name,
        kind: each.kind,
        worldRankings: each.world_rankings,
        changedAt: ReadOnlyDate.from(each.changed_at),
      })),
      names: new Map(
        players.rows.map((each) => [each.player_id, each.world_ranking_name]),
      ),
    };
  }
}
