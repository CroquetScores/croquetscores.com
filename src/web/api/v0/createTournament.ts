// POST /api/v0/tournaments: a tournament created (createTournament.feature).
// What the new tournament page sends, and the same for an app. It was at
// /api/site/tournaments, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { CreateTournament } from "../../../application/operations/tournaments/CreateTournament.js";
import { tournamentFrom } from "../../common/requestBody.js";
import { websiteOf } from "../../common/site.js";
import { writerOf } from "./writer.js";

export const createTournamentOfApps: FastifyPluginAsync = (server) => {
  server.post("/tournaments", async (request, reply) => {
    const writer = writerOf(request, reply);
    if (writer === undefined) return reply;
    const created = await request.server.mediator.send(
      new CreateTournament(
        writer.value,
        websiteOf(request).host,
        tournamentFrom(request.body),
        request.requestedAt,
      ),
    );
    return reply
      .code(201)
      .header("cache-control", "no-store")
      .send({ id: created.id.value, address: created.address.toString() });
  });
  return Promise.resolve();
};
