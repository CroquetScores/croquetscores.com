// A tournament's manager notes, added by asking (managerNotes.feature):
// POST /api/v1/tournaments/{id}/notes, with the tournament named by the part
// of its id after "tournament/", so that the id is one segment of the address.
// It was at /api/site/tournaments/{id}/notes, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { AddManagerNote } from "../../../application/operations/tournaments/AddManagerNote.js";
import { noteBodyLimit, noteFrom } from "../../common/requestBody.js";
import { writerOf } from "./writer.js";

export const managerNotesOfApps: FastifyPluginAsync = (server) => {
  // A note added, and answered with its id.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/notes",
    { bodyLimit: noteBodyLimit },
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const { title, description } = noteFrom(request.body);
      const added = await request.server.mediator.send(
        new AddManagerNote(
          writer.value,
          tournament,
          title,
          description,
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
