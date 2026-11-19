// GET /api/v0/tournaments/{id}: a tournament, its competitions and its players,
// for apps (tournament.feature). Follows the list's conventions
// (tournaments.ts): the tournament is named by the part of its id after
// "tournament/", and the answer says whether it has changed.
import type { FastifyPluginAsync } from "fastify";

import { TournamentOperationRefused } from "../../../application/operations/tournaments/tournamentOperations.js";
import { TournamentForApps } from "../../../application/operations/tournaments/TournamentForApps.js";
import { websiteOf } from "../../common/site.js";
import { refuseKey } from "./apiKey.js";
import { sendConditionally } from "./conditional.js";
import { refusal } from "./errors.js";
import { competitionHref, tournamentHref } from "./hrefs.js";
import { callerOf } from "./rateLimit.js";

export const tournamentOfApps: FastifyPluginAsync = (server) => {
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id",
    async (request, reply) => {
      // A key that was sent and does not work is refused, and having none is
      // not, as the list's is (tournaments.ts).
      const { key, carriedKey } = callerOf(request);
      if (carriedKey && key === undefined) return refuseKey(reply, true);

      const id = `tournament/${request.params.id}`;
      // A key made for one tournament reads that one and no other, as it
      // writes to no other (permissions.feature).
      if (key?.tournament !== undefined && key.tournament !== id) {
        return refusal(
          reply,
          403,
          "ApiKey.LimitedToAnotherTournament",
          "The API key was made for another tournament.",
        );
      }

      try {
        const read = await request.server.mediator.query(
          new TournamentForApps(websiteOf(request).host, id),
        );
        return sendConditionally(
          request,
          reply,
          {
            id: read.id,
            name: read.name,
            starts: read.starts,
            finishes: read.finishes,
            country: read.country,
            region: read.region ?? null,
            sport: read.sport,
            address: read.address,
            href: tournamentHref(read.id),
            national: read.national,
            international: read.international,
            changedAt: read.changedAt.toISOString(),
            competitions: read.competitions.map((each) => ({
              id: each.id,
              name: each.name,
              kind: each.kind,
              address: each.address,
              href: competitionHref(read.id, each.id),
              changedAt: each.changedAt.toISOString(),
            })),
            players: read.players.map((each) => ({
              id: each.id,
              name: each.name,
              worldRankingName: each.worldRankingName,
              handicap: each.handicap ?? null,
              representing: each.representing ?? null,
            })),
            teams: read.teams,
          },
          read.changedAt,
        );
      } catch (failure) {
        if (
          failure instanceof TournamentOperationRefused &&
          failure.code === "TournamentForApps.NoSuchTournament"
        ) {
          return refusal(
            reply,
            404,
            "Tournament.NotFound",
            "There is no such tournament.",
          );
        }
        throw failure;
      }
    },
  );
  return Promise.resolve();
};
