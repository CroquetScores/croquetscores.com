// A tournament's teams, added by asking (tournamentTeams.feature):
// POST /api/v0/tournaments/{id}/teams..., with the tournament and the team each
// named by the part of its id after its kind, so that each is one segment of
// the address. Each was at /api/site/tournaments/{id}/teams, and is only here
// now.
import type { FastifyPluginAsync } from "fastify";

import { AddTeam } from "../../../application/operations/tournaments/AddTeam.js";
import { teamFrom } from "../../common/requestBody.js";
import { writerOf } from "./writer.js";

export const tournamentTeamsOfApps: FastifyPluginAsync = (server) => {
  // A team added, and answered with its id.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/teams",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const added = await request.server.mediator.send(
        new AddTeam(
          writer.value,
          tournament,
          teamFrom(request.body),
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
