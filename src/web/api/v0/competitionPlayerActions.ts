// What is done to one of a competition's players by asking, with no more said
// than which (competitionPlayerActions.feature):
// POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/{action},
// with the tournament, the competition and the player each named by the part
// of its id after its kind, so that each is one segment of the address. Each
// was at /api/site/tournaments/{id}/competitions/{competition}/players/{player},
// and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { MoveCompetitionPlayer } from "../../../application/operations/competitions/MoveCompetitionPlayer.js";
import { writerOf } from "./writer.js";

export const competitionPlayerActionsOfApps: FastifyPluginAsync = (server) => {
  for (const action of ["up"] as const) {
    server.post<{
      Params: { id: string; competition: string; player: string };
      Querystring: { order?: string };
    }>(
      `/tournaments/:id/competitions/:competition/players/:player/${action}`,
      async (request, reply) => {
        const tournament = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, tournament);
        if (writer === undefined) return reply;
        const asked = [
          writer.value,
          tournament,
          `competition/${request.params.competition}`,
          `competition-player/${request.params.player}`,
        ] as const;
        // Every bye has the same id, so a bye is named by its order too.
        const { order } = request.query;
        const byeOrder = order === undefined ? undefined : Number(order);
        await request.server.mediator.send(
          new MoveCompetitionPlayer(
            ...asked,
            action,
            request.requestedAt,
            byeOrder,
          ),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }
  return Promise.resolve();
};
