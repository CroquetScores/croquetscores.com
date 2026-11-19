import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  filterFor,
  type TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";
import {
  mostInAPage,
  TournamentsForApps,
  type TournamentsForAppsPage,
} from "./TournamentsForApps.js";

export class TournamentsForAppsHandler extends QueryHandler<
  TournamentsForApps,
  TournamentsForAppsPage
> {
  readonly handles: RequestType<TournamentsForApps> = TournamentsForApps;

  constructor(
    private readonly byWebsite: Pick<
      TournamentsByWebsite,
      "startingBetweenWithChange"
    >,
  ) {
    super();
  }

  // Paged here and not by the database, since a year has a few hundred
  // tournaments at most, and the total and the date of the list both need
  // every one that matches, so the database is asked once for all of them.
  async handle(query: TournamentsForApps): Promise<TournamentsForAppsPage> {
    const website = Website.from(query.website);
    const year = String(query.year).padStart(4, "0");
    const all = await this.byWebsite.startingBetweenWithChange(
      website,
      `${year}-01-01`,
      `${year}-12-31`,
      filterFor(website, { sport: query.sport }, "TournamentsInYear"),
    );
    const since = query.changedSince?.toDate().getTime();
    const matching =
      since === undefined
        ? all
        : all.filter((each) => each.changedAt.toDate().getTime() > since);
    const pageSize = Math.min(query.pageSize, mostInAPage);
    const first = (query.page - 1) * pageSize;
    const latest = matching.reduce<ReadOnlyDate | undefined>(
      (soFar, { changedAt }) =>
        soFar === undefined || changedAt.toDate() > soFar.toDate()
          ? changedAt
          : soFar,
      undefined,
    );
    return {
      tournaments: matching.slice(first, first + pageSize),
      total: matching.length,
      page: query.page,
      pageSize,
      next: first + pageSize < matching.length ? query.page + 1 : undefined,
      changedAt: latest,
    };
  }
}
