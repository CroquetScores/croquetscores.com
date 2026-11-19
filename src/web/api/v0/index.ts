// /api/v0 — JSON, for apps: the public API, which is in development and so is
// v0 until everyone concerned accepts it, when it becomes v1 (#684). A breaking
// change after that is a new version beside it, never an edit. Nothing here is
// covered by /api/site's words, which are for the website's own pages.
import type { FastifyPluginCallback } from "fastify";

import { WhatAKeyMayDoInTournament } from "../../../application/operations/tournaments/WhatAKeyMayDoInTournament.js";
import { TournamentOperationRefused } from "../../../application/operations/tournaments/tournamentOperations.js";
import { keyOf, refuseKey } from "./apiKey.js";

export const apiV0: FastifyPluginCallback = (server, _options, done) => {
  // What the key sent may do in a tournament, named by the part of its id
  // after "tournament/", so that the id is one segment of an address. Said to
  // the key and nobody else's, so it is neither kept nor shared.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/permissions",
    async (request, reply) => {
      const key = keyOf(request);
      if (key === undefined) return refuseKey(reply, false);
      try {
        const may = await request.server.mediator.query(
          new WhatAKeyMayDoInTournament(key, `tournament/${request.params.id}`),
        );
        if (may === undefined) return refuseKey(reply, true);
        return reply
          .header("cache-control", "no-store")
          .header("vary", "Authorization")
          .send(may);
      } catch (failure) {
        if (
          failure instanceof TournamentOperationRefused &&
          failure.code === "WhatAKeyMayDoInTournament.NoSuchTournament"
        ) {
          return reply.code(404).header("cache-control", "no-store").send({
            code: "Tournament.NotFound",
            message: "There is no such tournament.",
          });
        }
        throw failure;
      }
    },
  );
  done();
};
