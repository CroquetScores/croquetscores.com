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
    skip: number,
    count: number,
  ): Promise<{
    readonly tournaments: readonly TournamentArchived[];
    readonly total: number;
    readonly latest: ReadOnlyDate | undefined;
  }> {
    const connection = this.unitOfWork.connection();
    const asked = [website.host, since?.toISOString() ?? null];
    const where = `website = $1 and archived and archived_at is not null
            and ($2::timestamptz is null or archived_at > $2::timestamptz)`;
    // Counted apart from the page, so that a page past the last still says how
    // many there are and when the latest was.
    const { rows: counted } = await connection.query<{
      total: string;
      latest: Date | null;
    }>(
      `select count(*) as total, max(archived_at) as latest
         from tournaments where ${where}`,
      asked,
    );
    const { rows } = await connection.query<{
      tournament_id: string;
      archived_at: Date;
    }>(
      `select tournament_id, archived_at
         from tournaments
        where ${where}
        order by archived_at, tournament_id
        limit $3 offset $4`,
      [...asked, count, skip],
    );
    const latest = counted[0]?.latest;
    return {
      tournaments: rows.map((row) => ({
        tournamentId: row.tournament_id,
        archivedAt: ReadOnlyDate.from(row.archived_at),
      })),
      total: Number(counted[0]?.total ?? 0),
      latest:
        latest === null || latest === undefined
          ? undefined
          : ReadOnlyDate.from(latest),
    };
  }
}
