import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { mostInAPage } from "./TournamentsForApps.js";
import {
  TournamentsArchived,
  type ArchivedTournaments,
  type TournamentsArchivedPage,
} from "./TournamentsArchived.js";

export class TournamentsArchivedHandler extends QueryHandler<
  TournamentsArchived,
  TournamentsArchivedPage
> {
  readonly handles: RequestType<TournamentsArchived> = TournamentsArchived;

  constructor(private readonly archived: ArchivedTournaments) {
    super();
  }

  // Paged here and not by the database, as the list of a year's is, since the
  // total and the date of the list both need every one that matches. Only a
  // tournament that has been archived is a row, which is few beside the
  // tournaments there are, and each row is an id and a moment.
  async handle(query: TournamentsArchived): Promise<TournamentsArchivedPage> {
    const all = await this.archived.archivedSince(
      Website.from(query.website),
      query.archivedSince,
    );
    const pageSize = Math.min(query.pageSize, mostInAPage);
    const first = (query.page - 1) * pageSize;
    const latest = all.reduce<(typeof all)[number]["archivedAt"] | undefined>(
      (soFar, { archivedAt }) =>
        soFar === undefined || archivedAt.toDate() > soFar.toDate()
          ? archivedAt
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
