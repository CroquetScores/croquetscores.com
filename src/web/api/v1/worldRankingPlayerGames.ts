// GET /api/v1/ac/world-ranking-players/{id}/games: the games an association
// croquet world ranking player has played, for apps
// (worldRankingPlayerGames.feature). Asked and answered as the list of the
// players is (worldRankingPlayers.ts), so that an app that reads one reads the
// other.
import type { FastifyPluginAsync, FastifyReply } from "fastify";

import {
  mostGamesInAPage,
  WorldRankingPlayerGamesForApps,
  type WorldRankingPlayerGamesForAppsPage,
} from "../../../application/operations/world-rankings/WorldRankingPlayerGamesForApps.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { marked, sendConditionally } from "./conditional.js";
import { refusal } from "./errors.js";
import { refuseKey } from "./apiKey.js";
import { callerOf } from "./rateLimit.js";
import { momentOf, wholeNumber } from "./tournaments.js";

interface Asked {
  readonly changedSince?: string;
  readonly page?: string;
  readonly pageSize?: string;
}

// Each refusal of what was asked, written once, as the list of the players'
// are: the code the application refuses it as, and what the API answers.
const refusals: Readonly<
  Record<
    string,
    {
      readonly status: number;
      readonly code: string;
      readonly field?: string;
      readonly message: string;
    }
  >
> = {
  "WorldRankingPlayerGamesForApps.PageNotWhole": {
    status: 400,
    code: "WorldRankingPlayerGames.PageNotWhole",
    field: "page",
    message: "The page is a whole number, from 1.",
  },
  "WorldRankingPlayerGamesForApps.PageOutOfRange": {
    status: 400,
    code: "WorldRankingPlayerGames.PageOutOfRange",
    field: "page",
    message: "The first page is page 1.",
  },
  "WorldRankingPlayerGamesForApps.PageSizeNotWhole": {
    status: 400,
    code: "WorldRankingPlayerGames.PageSizeNotWhole",
    field: "pageSize",
    message: `The page size is a whole number, up to ${String(mostGamesInAPage)}.`,
  },
  "WorldRankingPlayerGamesForApps.PageSizeOutOfRange": {
    status: 400,
    code: "WorldRankingPlayerGames.PageSizeOutOfRange",
    field: "pageSize",
    message: "A page holds at least one game.",
  },
  "WorldRankingPlayerGamesForApps.PlayerNotFound": {
    status: 404,
    code: "WorldRankingPlayers.NotFound",
    message: "There is no such world ranking player.",
  },
};

const refusedAs = (reply: FastifyReply, refused: string): FastifyReply => {
  const { status, code, field, message } = refusals[refused]!;
  return refusal(reply, status, code, message, field);
};

const said = (
  page: WorldRankingPlayerGamesForAppsPage,
): Record<string, unknown> => ({
  games: page.games.map((each) =>
    marked({
      id: each.id,
      tournamentId: each.tournamentId,
      competitionId: each.competitionId,
      won: each.won,
      score: each.score,
      opponentScore: each.opponentScore,
      opponentId: each.opponentId ?? null,
      opponentName: each.opponentName,
      drawn: each.drawn,
      archived: each.archived,
      withdrawn: each.withdrawn,
      addedAt: each.addedAt?.toISOString() ?? null,
      changedAt: each.changedAt.toISOString(),
    }),
  ),
  total: page.total,
  page: page.page,
  pageSize: page.pageSize,
  next: page.next ?? null,
});

export const worldRankingPlayerGamesOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Params: { id: string }; Querystring: Asked }>(
    "/ac/world-ranking-players/:id/games",
    async (request, reply) => {
      // As the list of the players is: a key that was sent and does not work
      // is refused, and having none is not.
      const caller = callerOf(request);
      if (caller.carriedKey && caller.key === undefined) {
        return refuseKey(reply, true);
      }

      const { changedSince, page, pageSize } = request.query;
      let since: ReadOnlyDate | undefined;
      if (changedSince !== undefined) {
        since = momentOf(changedSince);
        if (since === undefined) {
          return refusal(
            reply,
            400,
            "WorldRankingPlayerGames.ChangedSinceNotAMoment",
            "changedSince is a moment, written as 2026-03-01T10:00:00Z.",
            "changedSince",
          );
        }
      }
      if (page !== undefined && !wholeNumber.test(page)) {
        return refusedAs(reply, "WorldRankingPlayerGamesForApps.PageNotWhole");
      }
      if (pageSize !== undefined && !wholeNumber.test(pageSize)) {
        return refusedAs(
          reply,
          "WorldRankingPlayerGamesForApps.PageSizeNotWhole",
        );
      }

      let answer: WorldRankingPlayerGamesForAppsPage;
      try {
        answer = await request.server.mediator.query(
          new WorldRankingPlayerGamesForApps(
            `ac-world-ranking-id/${request.params.id}`,
            since,
            page === undefined ? 1 : Number(page),
            pageSize === undefined ? mostGamesInAPage : Number(pageSize),
          ),
        );
      } catch (failure) {
        const code =
          failure instanceof ValidationError ? String(failure.code) : undefined;
        if (code === undefined || refusals[code] === undefined) throw failure;
        return refusedAs(reply, code);
      }

      return sendConditionally(request, reply, said(answer), answer.changedAt, {
        byDate: false,
      });
    },
  );
  return Promise.resolve();
};
