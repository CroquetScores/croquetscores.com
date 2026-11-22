// What is done to one of a tournament's competitions by asking, with no more
// said than which (competitionActions.feature):
// POST /api/v0/tournaments/{id}/competitions/{competition}/{action}, with the
// tournament and the competition named by the part of each id after its kind,
// so that each is one segment of the address. Each was at
// /api/site/tournaments/{id}/competitions/{competition}, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { ArchiveCompetition } from "../../../application/operations/tournaments/ArchiveCompetition.js";
import { MoveCompetition } from "../../../application/operations/tournaments/MoveCompetition.js";
import { writerOf } from "./writer.js";

export const competitionActionsOfApps: FastifyPluginAsync = (server) => {
  for (const action of ["up", "down", "archive"] as const) {
    server.post<{ Params: { id: string; competition: string } }>(
      `/tournaments/:id/competitions/:competition/${action}`,
      async (request, reply) => {
        const tournament = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, tournament);
        if (writer === undefined) return reply;
        const asked = [
          writer.value,
          tournament,
          `competition/${request.params.competition}`,
        ] as const;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchiveCompetition(...asked, at)
            : new MoveCompetition(...asked, action, at),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }
  return Promise.resolve();
};
