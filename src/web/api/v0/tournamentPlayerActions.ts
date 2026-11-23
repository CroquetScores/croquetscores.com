// What is done to one of a tournament's players by asking, with no more said than which
// (tournamentPlayerActions.feature): POST /api/v0/tournaments/{id}/players/{player}/{action},
// with each part named by the part of its id after its kind, so that each is
// one segment of the address. Each was at /api/site, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { ArchivePlayer } from "../../../application/operations/tournaments/ArchivePlayer.js";
import { MovePlayer } from "../../../application/operations/tournaments/MovePlayer.js";
import { RestorePlayer } from "../../../application/operations/tournaments/RestorePlayer.js";
import { writerOf } from "./writer.js";

export const tournamentPlayerActionsOfApps: FastifyPluginAsync = (server) => {
  for (const action of ["up", "down", "archive", "restore"] as const) {
    server.post<{ Params: { id: string; player: string } }>(
      `/tournaments/:id/players/:player/${action}`,
      async (request, reply) => {
        const tournament = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, tournament);
        if (writer === undefined) return reply;
        const asked = [
          writer.value,
          tournament,
          `tournament-player/${request.params.player}`,
        ] as const;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchivePlayer(...asked, at)
            : action === "restore"
              ? new RestorePlayer(...asked, at)
              : new MovePlayer(...asked, action, at),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }
  return Promise.resolve();
};
