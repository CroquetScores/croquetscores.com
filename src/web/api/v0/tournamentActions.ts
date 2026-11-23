// What is done to a tournament by asking, with no more said than which
// (tournamentActions.feature): POST /api/v0/tournaments/{id}/{action}, with
// the tournament named by the part of its id after "tournament/" so that the
// id is one segment of the address. Each was at /api/site/tournaments, and
// is only here now.
import type { FastifyPluginAsync } from "fastify";

import { ArchiveTournament } from "../../../application/operations/tournaments/ArchiveTournament.js";
import { RestoreTournament } from "../../../application/operations/tournaments/RestoreTournament.js";
import { RemoveNotableStatus } from "../../../application/operations/tournaments/RemoveNotableStatus.js";
import { DeleteTournament } from "../../../application/operations/tournaments/DeleteTournament.js";
import { textOf } from "../../common/requestBody.js";
import { writerOf } from "./writer.js";

export const tournamentActionsOfApps: FastifyPluginAsync = (server) => {
  for (const [action, making] of [
    ["archive", ArchiveTournament],
    ["restore", RestoreTournament],
    // An administrator's, who judges it neither national nor international.
    ["remove-notable-status", RemoveNotableStatus],
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

  // A test tournament deleted, as an administrator judges it: its managers
  // told what was written, and the tournament archived where `archive` is
  // true. Only the administrator's words are taken from the body, and the
  // tournament is the address's.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/delete",
    async (request, reply) => {
      const id = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, id);
      if (writer === undefined) return reply;
      const body = request.body as Record<string, unknown> | null;
      await request.server.mediator.send(
        new DeleteTournament(
          writer.value,
          id,
          textOf(body, "message"),
          body?.["archive"] === true,
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );
  return Promise.resolve();
};
