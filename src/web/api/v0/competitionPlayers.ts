// A competition's players, entered by asking (competitionPlayers.feature):
// POST /api/v0/tournaments/{id}/competitions/{competition}/players..., with the
// tournament and the competition each named by the part of its id after its
// kind, so that each is one segment of the address. Each was at
// /api/site/tournaments/{id}/competitions/{competition}/players, and is only
// here now. Entering several at once is not: the website's own dialog asks
// for it at /api/site (competitionPlayers.feature).
import type { FastifyPluginAsync } from "fastify";

import { EnterPlayer } from "../../../application/operations/competitions/EnterPlayer.js";
import { textOf } from "../../common/requestBody.js";
import { writerOf } from "./writer.js";

export const competitionPlayersOfApps: FastifyPluginAsync = (server) => {
  // One of the tournament's players entered, by the part of their id after
  // "tournament-player/", and answered with their id in the competition.
  server.post<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/players",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const entered = await request.server.mediator.send(
        new EnterPlayer(
          writer.value,
          tournament,
          `competition/${request.params.competition}`,
          `tournament-player/${textOf(request.body, "player")}`,
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: entered });
    },
  );
  return Promise.resolve();
};
