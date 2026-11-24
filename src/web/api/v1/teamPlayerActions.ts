// What is done to one of a team's players by asking, with no more said than which
// (teamPlayerActions.feature): POST /api/v1/tournaments/{id}/teams/{team}/players/{player}/{action},
// with each part named by the part of its id after its kind, so that each is
// one segment of the address. Each was at /api/site, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { ArchiveTeamPlayer } from "../../../application/operations/tournaments/ArchiveTeamPlayer.js";
import { MoveTeamPlayer } from "../../../application/operations/tournaments/MoveTeamPlayer.js";
import { RestoreTeamPlayer } from "../../../application/operations/tournaments/RestoreTeamPlayer.js";
import { writerOf } from "./writer.js";

export const teamPlayerActionsOfApps: FastifyPluginAsync = (server) => {
  for (const action of ["up", "down", "archive", "restore"] as const) {
    server.post<{ Params: { id: string; team: string; player: string } }>(
      `/tournaments/:id/teams/:team/players/:player/${action}`,
      async (request, reply) => {
        const tournament = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, tournament);
        if (writer === undefined) return reply;
        const asked = [
          writer.value,
          tournament,
          `team/${request.params.team}`,
          `team-player/${request.params.player}`,
        ] as const;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchiveTeamPlayer(...asked, at)
            : action === "restore"
              ? new RestoreTeamPlayer(...asked, at)
              : new MoveTeamPlayer(...asked, action, at),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }
  return Promise.resolve();
};
