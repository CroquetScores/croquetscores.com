// The people who have a part in a tournament, made and taken off by asking
// (tournamentPeople.feature): POST /api/v0/tournaments/{id}/scorers and
// /api/v0/tournaments/{id}/managers, and the removal of one at
// .../{account}/remove, with the tournament and the account each named by the
// part of its id after its kind, so that each is one segment of the address.
// Each was at /api/site/tournaments/{id}, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { AddScorer } from "../../../application/operations/tournaments/AddScorer.js";
import { textOf } from "../../common/requestBody.js";
import { RemoveScorer } from "../../../application/operations/tournaments/RemoveScorer.js";
import { AddManager } from "../../../application/operations/tournaments/AddManager.js";
import { RemoveManager } from "../../../application/operations/tournaments/RemoveManager.js";
import { writerOf } from "./writer.js";

export const tournamentPeopleOfApps: FastifyPluginAsync = (server) => {
  // Somebody made a scorer, by their email address.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/scorers",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      await request.server.mediator.send(
        new AddScorer(
          writer.value,
          tournament,
          textOf(request.body, "emailAddress"),
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A scorer taken off, by the part of their account's id after "account/".
  server.post<{ Params: { id: string; account: string } }>(
    "/tournaments/:id/scorers/:account/remove",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      await request.server.mediator.send(
        new RemoveScorer(
          writer.value,
          tournament,
          `account/${request.params.account}`,
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // Somebody made a manager, by their email address.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/managers",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      await request.server.mediator.send(
        new AddManager(
          writer.value,
          tournament,
          textOf(request.body, "emailAddress"),
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A manager taken off, by the part of their account's id after "account/".
  server.post<{ Params: { id: string; account: string } }>(
    "/tournaments/:id/managers/:account/remove",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      await request.server.mediator.send(
        new RemoveManager(
          writer.value,
          tournament,
          `account/${request.params.account}`,
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );
  return Promise.resolve();
};
