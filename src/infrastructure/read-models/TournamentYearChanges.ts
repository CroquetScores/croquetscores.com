import type {
  TournamentYearChanged,
  TournamentYearChanges as TournamentYearChangesAsked,
} from "../../application/operations/tournaments/TournamentsChangedYear.js";
import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../domain/common/Website.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/**
 * The tournaments that have come into another year than the one they were
 * in. Nothing is written here: `tournament_years` is kept by
 * `TournamentsByAddress`, which sees every address a tournament is given.
 */
export class TournamentYearChanges implements TournamentYearChangesAsked {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async changedYear(
    website: Website,
    since: ReadOnlyDate | undefined,
  ): Promise<readonly TournamentYearChanged[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      tournament_id: string;
      previous_year: number;
      year: number;
      changed_at: Date;
    }>(
      `select y.tournament_id, y.previous_year, y.year, y.changed_at
         from tournament_years y
         join tournaments t on t.tournament_id = y.tournament_id
        where t.website = $1 and not t.archived
          and y.previous_year is not null
          and ($2::timestamptz is null or y.changed_at > $2::timestamptz)
        order by y.changed_at, y.tournament_id`,
      [website.host, since?.toISOString() ?? null],
    );
    return rows.map((row) => ({
      tournamentId: row.tournament_id,
      previousYear: row.previous_year,
      newYear: row.year,
      changedAt: ReadOnlyDate.from(row.changed_at),
    }));
  }
}
