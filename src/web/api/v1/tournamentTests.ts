// A tournament's tests, added by asking (tournamentTests.feature):
// POST /api/v1/tournaments/{id}/tests, with the tournament named by the part of
// its id after "tournament/", so that the id is one segment of the address. It
// was at /api/site/tournaments/{id}/tests, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { AddTest } from "../../../application/operations/tournaments/AddTest.js";
import { advantageOffered } from "../../common/advantageOffered.js";
import { testFrom } from "../../common/requestBody.js";
import { refusal } from "./errors.js";
import { writerOf } from "./writer.js";

export interface TournamentTestsOptions {
  /** Whether croquetscores.com offers Advantage Golf Croquet (the setting). */
  readonly advantageGolfCroquet: boolean;
}

export const tournamentTestsOfApps: FastifyPluginAsync<
  TournamentTestsOptions
> = (server, { advantageGolfCroquet }) => {
  const { makesAdvantageNotOffered } = advantageOffered(advantageGolfCroquet);
  // A test added, and answered with its id, which is a competition's. It is
  // moved, archived and restored as any competition is.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/tests",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      if (
        await makesAdvantageNotOffered(request, writer, tournament, undefined)
      ) {
        return refusal(
          reply,
          422,
          "Advantage.NotOffered",
          "The website does not offer Advantage Golf Croquet.",
          "advantage",
        );
      }
      const added = await request.server.mediator.send(
        new AddTest(
          writer.value,
          tournament,
          testFrom(request.body),
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
