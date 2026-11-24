// GET /api/v0/ac/world-ranking-players: the association croquet players the
// world rankings know, for apps (worldRankingPlayers.feature). Asked and
// answered as the tournaments' list is (tournaments.ts), so that an app that
// reads one reads the other.
import type { FastifyPluginAsync, FastifyReply } from "fastify";

import {
  mostPlayersInAPage,
  WorldRankingPlayersForApps,
  type WorldRankingPlayersForAppsPage,
} from "../../../application/operations/world-rankings/WorldRankingPlayersForApps.js";
import { RefreshAssociationCroquetPlayerNames } from "../../../application/operations/world-rankings/RefreshAssociationCroquetPlayerNames.js";
import { websiteOf } from "../../common/site.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { marked, sendConditionally } from "./conditional.js";
import { worldRankingPlayerGamesHref } from "./hrefs.js";
import { refusal } from "./errors.js";
import { refuseKey } from "./apiKey.js";
import { callerOf } from "./rateLimit.js";
import { momentOf, wholeNumber } from "./tournaments.js";

interface Asked {
  readonly changedSince?: string;
  readonly page?: string;
  readonly pageSize?: string;
}

// Each refusal of what was asked, written once, as the tournaments' are: the
// code the application refuses it as, and what the API answers.
const refusals: Readonly<
  Record<
    string,
    { readonly code: string; readonly field: string; readonly message: string }
  >
> = {
  "WorldRankingPlayersForApps.PageNotWhole": {
    code: "WorldRankingPlayers.PageNotWhole",
    field: "page",
    message: "The page is a whole number, from 1.",
  },
  "WorldRankingPlayersForApps.PageOutOfRange": {
    code: "WorldRankingPlayers.PageOutOfRange",
    field: "page",
    message: "The first page is page 1.",
  },
  "WorldRankingPlayersForApps.PageSizeNotWhole": {
    code: "WorldRankingPlayers.PageSizeNotWhole",
    field: "pageSize",
    message: `The page size is a whole number, up to ${String(mostPlayersInAPage)}.`,
  },
  "WorldRankingPlayersForApps.PageSizeOutOfRange": {
    code: "WorldRankingPlayers.PageSizeOutOfRange",
    field: "pageSize",
    message: "A page holds at least one player.",
  },
};

const refusedAs = (reply: FastifyReply, refused: string): FastifyReply => {
  const { code, field, message } = refusals[refused]!;
  return refusal(reply, 400, code, message, field);
};

const said = (
  page: WorldRankingPlayersForAppsPage,
): Record<string, unknown> => ({
  worldRankingPlayers: page.players.map((each) =>
    marked({
      id: each.id,
      worldRankingId: each.worldRankingId,
      name: each.name,
      games: worldRankingPlayerGamesHref(each.id),
      archivedAt: each.archivedAt?.toISOString() ?? null,
      changedAt: each.changedAt.toISOString(),
    }),
  ),
  total: page.total,
  page: page.page,
  pageSize: page.pageSize,
  next: page.next ?? null,
});

export const worldRankingPlayersOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Querystring: Asked }>(
    "/ac/world-ranking-players",
    async (request, reply) => {
      // As the tournaments' list is: a key that was sent and does not work is
      // refused, and having none is not.
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
            "WorldRankingPlayers.ChangedSinceNotAMoment",
            "changedSince is a moment, written as 2026-03-01T10:00:00Z.",
            "changedSince",
          );
        }
      }
      if (page !== undefined && !wholeNumber.test(page)) {
        return refusedAs(reply, "WorldRankingPlayersForApps.PageNotWhole");
      }
      if (pageSize !== undefined && !wholeNumber.test(pageSize)) {
        return refusedAs(reply, "WorldRankingPlayersForApps.PageSizeNotWhole");
      }

      // Asked for from the start, the names are refreshed first, so that the
      // list an app reads is the rankings' as they are now. Only after the
      // asking has been checked, so that a refused request reads nothing.
      // Not for a HEAD, which is asked only to see what the answer would be.
      // A refresh that fails is logged and the list is answered as it is kept:
      // the app asked for the players, not for the refresh.
      if (page === undefined && request.method === "GET") {
        try {
          await request.server.mediator.send(
            new RefreshAssociationCroquetPlayerNames(
              request.requestedAt,
              websiteOf(request).host,
            ),
          );
        } catch (failure) {
          request.log.error(
            { err: failure },
            "The association croquet names could not be refreshed",
          );
        }
      }

      let answer: WorldRankingPlayersForAppsPage;
      try {
        answer = await request.server.mediator.query(
          new WorldRankingPlayersForApps(
            since,
            page === undefined ? 1 : Number(page),
            pageSize === undefined ? mostPlayersInAPage : Number(pageSize),
          ),
        );
      } catch (failure) {
        // Written as whole numbers but out of the range there is, or too
        // large to be one the site can count.
        const code =
          failure instanceof ValidationError ? String(failure.code) : undefined;
        if (code === undefined || refusals[code] === undefined) throw failure;
        return refusedAs(reply, code);
      }

      // By its mark alone, as the tournaments' list is: a date alone does not
      // say the list is the one the app has, and the mark is exact.
      return sendConditionally(request, reply, said(answer), answer.changedAt, {
        byDate: false,
      });
    },
  );
  return Promise.resolve();
};
