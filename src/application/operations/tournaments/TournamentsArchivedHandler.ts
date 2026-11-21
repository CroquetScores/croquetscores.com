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

  async handle(query: TournamentsArchived): Promise<TournamentsArchivedPage> {
    const pageSize = Math.min(query.pageSize, mostInAPage);
    const first = (query.page - 1) * pageSize;
    const { tournaments, total, latest } = await this.archived.archivedSince(
      Website.from(query.website),
      query.archivedSince,
      first,
      pageSize,
    );
    return {
      tournaments,
      total,
      page: query.page,
      pageSize,
      next: first + pageSize < total ? query.page + 1 : undefined,
      changedAt: latest,
    };
  }
}
