import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { mostInAPage } from "./TournamentsForApps.js";
import {
  TournamentsChangedYear,
  type TournamentYearChanges,
  type TournamentsChangedYearPage,
} from "./TournamentsChangedYear.js";

export class TournamentsChangedYearHandler extends QueryHandler<
  TournamentsChangedYear,
  TournamentsChangedYearPage
> {
  readonly handles: RequestType<TournamentsChangedYear> =
    TournamentsChangedYear;

  constructor(private readonly years: TournamentYearChanges) {
    super();
  }

  // Paged here and not by the database, as the list of a year's is, since the
  // total and the date of the list both need every one that matches. Only a
  // tournament that has been moved to another year is a row, which is few
  // beside the tournaments there are, and each row is three numbers and an id.
  async handle(
    query: TournamentsChangedYear,
  ): Promise<TournamentsChangedYearPage> {
    const all = await this.years.changedYear(
      Website.from(query.website),
      query.changedSince,
    );
    const pageSize = Math.min(query.pageSize, mostInAPage);
    const first = (query.page - 1) * pageSize;
    const latest = all.reduce<(typeof all)[number]["changedAt"] | undefined>(
      (soFar, { changedAt }) =>
        soFar === undefined || changedAt.toDate() > soFar.toDate()
          ? changedAt
          : soFar,
      undefined,
    );
    return {
      tournaments: all.slice(first, first + pageSize),
      total: all.length,
      page: query.page,
      pageSize,
      next: first + pageSize < all.length ? query.page + 1 : undefined,
      changedAt: latest,
    };
  }
}
