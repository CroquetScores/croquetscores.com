import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { WorldRankingPlayerGamesKept } from "../../services/WorldRankingPlayers.js";
import {
  mostGamesInAPage,
  WorldRankingPlayerGamesForApps,
  type WorldRankingPlayerGamesForAppsPage,
  type WorldRankingPlayerGamesForAppsRefusedCode,
} from "./WorldRankingPlayerGamesForApps.js";

export class WorldRankingPlayerGamesForAppsHandler extends QueryHandler<
  WorldRankingPlayerGamesForApps,
  WorldRankingPlayerGamesForAppsPage
> {
  readonly handles: RequestType<WorldRankingPlayerGamesForApps> =
    WorldRankingPlayerGamesForApps;

  constructor(private readonly kept: WorldRankingPlayerGamesKept) {
    super();
  }

  // Paged here and not by the database, as the list of the players is: the
  // total and the date of the list both need every game that matches.
  async handle(
    query: WorldRankingPlayerGamesForApps,
  ): Promise<WorldRankingPlayerGamesForAppsPage> {
    const matching = await this.kept.changedAfter(
      query.sport,
      query.playerId,
      query.changedSince,
    );
    if (matching === undefined) {
      throw new ValidationError<WorldRankingPlayerGamesForAppsRefusedCode>(
        "WorldRankingPlayerGamesForApps.PlayerNotFound",
      );
    }
    const pageSize = Math.min(query.pageSize, mostGamesInAPage);
    const first = (query.page - 1) * pageSize;
    const latest = matching.reduce<ReadOnlyDate | undefined>(
      (soFar, { changedAt }) =>
        soFar === undefined || changedAt.toDate() > soFar.toDate()
          ? changedAt
          : soFar,
      undefined,
    );
    return {
      games: matching.slice(first, first + pageSize),
      total: matching.length,
      page: query.page,
      pageSize,
      next: first + pageSize < matching.length ? query.page + 1 : undefined,
      changedAt: latest,
    };
  }
}
