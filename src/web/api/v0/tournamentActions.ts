// What is done to a tournament by asking, with no more said than which
// (tournamentActions.feature): POST /api/v0/tournaments/{id}/{action}, with
// the tournament named by the part of its id after "tournament/" so that the
// id is one segment of the address. Each was at /api/site/tournaments, and
// is only here now. An administrator's judgements, taking notable status away
// and deleting a test tournament, are not: they are for the website's own
// pages, and are at /api/site (administratorActions.feature).
import type { FastifyPluginAsync } from "fastify";

import { ArchiveTournament } from "../../../application/operations/tournaments/ArchiveTournament.js";
import { RestoreTournament } from "../../../application/operations/tournaments/RestoreTournament.js";
import { writerOf } from "./writer.js";

export const tournamentActionsOfApps: FastifyPluginAsync = (server) => {
  for (const [action, making] of [
    ["archive", ArchiveTournament],
    ["restore", RestoreTournament],
  ] as const) {
    server.post<{ Params: { id: string } }>(
      `/tournaments/:id/${action}`,
      async (request, reply) => {
        const id = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, id);
        if (writer === undefined) return reply;
        await request.server.mediator.send(
          new making(writer.value, id, request.requestedAt),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  return Promise.resolve();
};
