// A tournament's players, added by asking (tournamentPlayers.feature):
// POST /api/v0/tournaments/{id}/players, with the tournament named by the part
// of its id after "tournament/", so that it is one segment of the address. It
// was at /api/site/tournaments/{id}/players, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { AddPlayer } from "../../../application/operations/tournaments/AddPlayer.js";
import { playerFrom } from "../../common/requestBody.js";
import { writerOf } from "./writer.js";

export const tournamentPlayersOfApps: FastifyPluginAsync = (server) => {
  // A player added, and answered with their id.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/players",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const added = await request.server.mediator.send(
        new AddPlayer(
          writer.value,
          tournament,
          playerFrom(request.body),
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added.value });
    },
  );
  return Promise.resolve();
};
