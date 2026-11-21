import type {
  TournamentArchived,
  ArchivedTournaments as ArchivedTournamentsAsked,
} from "../../application/operations/tournaments/TournamentsArchived.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../domain/common/Website.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/**
 * The tournaments that are archived, and when each was. Nothing is written
 * here: the moment is kept in the tournaments table by `Tournaments`, which
 * sees every tournament archived and restored.
 */
export class ArchivedTournaments implements ArchivedTournamentsAsked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async archivedSince(
    website: Website,
    since: ReadOnlyDate | undefined,
  ): Promise<readonly TournamentArchived[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ tournament_id: string; archived_at: Date }>(
        `select tournament_id, archived_at
           from tournaments
          where website = $1 and archived and archived_at is not null
            and ($2::timestamptz is null or archived_at > $2::timestamptz)
          order by archived_at, tournament_id`,
        [website.host, since?.toISOString() ?? null],
      );
    return rows.map((row) => ({
      tournamentId: row.tournament_id,
      archivedAt: ReadOnlyDate.from(row.archived_at),
    }));
  }
}
