import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { WorldRankingPlayersKept } from "../../services/WorldRankingPlayers.js";
import {
  mostPlayersInAPage,
  WorldRankingPlayersForApps,
  type WorldRankingPlayersForAppsPage,
} from "./WorldRankingPlayersForApps.js";

export class WorldRankingPlayersForAppsHandler extends QueryHandler<
  WorldRankingPlayersForApps,
  WorldRankingPlayersForAppsPage
> {
  readonly handles: RequestType<WorldRankingPlayersForApps> =
    WorldRankingPlayersForApps;

  constructor(private readonly kept: WorldRankingPlayersKept) {
    super();
  }

  // Paged here and not by the database, since the total and the date of the
  // list both need every player that matches, so the database is asked once
  // for all of them.
  async handle(
    query: WorldRankingPlayersForApps,
  ): Promise<WorldRankingPlayersForAppsPage> {
    const matching = await this.kept.changedAfter(
      query.sport,
      query.changedSince,
    );
    const pageSize = Math.min(query.pageSize, mostPlayersInAPage);
    const first = (query.page - 1) * pageSize;
    const latest = matching.reduce<ReadOnlyDate | undefined>(
      (soFar, { changedAt }) =>
        soFar === undefined || changedAt.toDate() > soFar.toDate()
          ? changedAt
          : soFar,
      undefined,
    );
    return {
      players: matching.slice(first, first + pageSize),
      total: matching.length,
      page: query.page,
      pageSize,
      next: first + pageSize < matching.length ? query.page + 1 : undefined,
      changedAt: latest,
    };
  }
}
