// A competition's players, entered by asking (competitionPlayers.feature):
// POST /api/v0/tournaments/{id}/competitions/{competition}/players..., with the
// tournament and the competition each named by the part of its id after its
// kind, so that each is one segment of the address. Each was at
// /api/site/tournaments/{id}/competitions/{competition}/players, and is only
// here now.
import type { FastifyPluginAsync } from "fastify";

import { EnterPlayers } from "../../../application/operations/competitions/EnterPlayers.js";
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

  // Several of the tournament's players entered at once, by the parts of their
  // ids after "tournament-player/", and answered with their ids in the
  // competition, in the order they were given. Whole or nothing unless
  // "enterWhatCan" is true, which is sent once the manager has been told which
  // of them cannot be and has chosen to enter the rest.
  server.post<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/players/many",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const body = request.body as {
        players?: unknown;
        enterWhatCan?: unknown;
      } | null;
      const entered = await request.server.mediator.send(
        new EnterPlayers(
          writer.value,
          tournament,
          `competition/${request.params.competition}`,
          // Whatever is not a list of text is as good as nobody listed, and is
          // refused as that is.
          Array.isArray(body?.players)
            ? (body.players as unknown[]).map(
                (each) =>
                  `tournament-player/${typeof each === "string" ? each : ""}`,
              )
            : [],
          body?.enterWhatCan === true,
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ ids: entered.entered, refused: entered.refused });
    },
  );
  return Promise.resolve();
};
