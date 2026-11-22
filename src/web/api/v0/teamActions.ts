// What is done to one of a tournament's teams by asking, with no more said than which
// (teamActions.feature): POST /api/v0/tournaments/{id}/teams/{team}/{action},
// with each part named by the part of its id after its kind, so that each is
// one segment of the address. Each was at /api/site, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { MoveTeam } from "../../../application/operations/tournaments/MoveTeam.js";
import { writerOf } from "./writer.js";

export const teamActionsOfApps: FastifyPluginAsync = (server) => {
  for (const action of ["up"] as const) {
    server.post<{ Params: { id: string; team: string } }>(
      `/tournaments/:id/teams/:team/${action}`,
      async (request, reply) => {
        const tournament = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, tournament);
        if (writer === undefined) return reply;
        const asked = [
          writer.value,
          tournament,
          `team/${request.params.team}`,
        ] as const;
        const at = request.requestedAt;
        await request.server.mediator.send(new MoveTeam(...asked, action, at));
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }
  return Promise.resolve();
};
