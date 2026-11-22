// POST /api/v0/tournaments/{id}/competitions: a competition added to a
// tournament (addCompetition.feature), as the competition dialog sends it: its
// kind, its name, and the shape its kind has. Answered with its id. It was at
// /api/site/tournaments/{id}/competitions, and is only here now.
import type { FastifyPluginAsync } from "fastify";

import { AddBlock } from "../../../application/operations/tournaments/AddBlock.js";
import { AddKnockout } from "../../../application/operations/tournaments/AddKnockout.js";
import { AddLosersKnockout } from "../../../application/operations/tournaments/AddLosersKnockout.js";
import { AddSwiss } from "../../../application/operations/tournaments/AddSwiss.js";
import { advantageOffered } from "../../common/advantageOffered.js";
import {
  losersOf,
  numberOf,
  numbersOf,
  optionalTextOf,
  rulesOf,
  textOf,
} from "../../common/requestBody.js";
import { refusal } from "./errors.js";
import { writerOf } from "./writer.js";

export interface AddCompetitionOptions {
  /** Whether croquetscores.com offers Advantage Golf Croquet (the setting). */
  readonly advantageGolfCroquet: boolean;
}

export const addCompetitionOfApps: FastifyPluginAsync<AddCompetitionOptions> = (
  server,
  { advantageGolfCroquet },
) => {
  const { makesAdvantageNotOffered } = advantageOffered(advantageGolfCroquet);
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/competitions",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const body = request.body;
      const name = textOf(body, "name");
      const at = request.requestedAt;
      const kind = textOf(body, "kind");
      if (
        kind !== "losers-knockout" &&
        (await makesAdvantageNotOffered(request, writer, tournament, undefined))
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
        // The knockout whose losers it takes is named by its bare id, as the
        // competitions of a tournament are everywhere in this API.
        kind === "losers-knockout"
          ? new AddLosersKnockout(
              writer.value,
              tournament,
              name,
              `competition/${textOf(body, "from")}`,
              numberOf(body, "round"),
              at,
            )
          : kind === "knockout"
            ? new AddKnockout(
                writer.value,
                tournament,
                name,
                numberOf(body, "places"),
                numbersOf(body, "rounds"),
                at,
                rulesOf(body),
                losersOf(body),
              )
            : kind === "swiss"
              ? new AddSwiss(
                  writer.value,
                  tournament,
                  name,
                  numberOf(body, "bestOf"),
                  at,
                  rulesOf(body),
                )
              : new AddBlock(
                  writer.value,
                  tournament,
                  name,
                  numberOf(body, "bestOf"),
                  numberOf(body, "rounds"),
                  at,
                  rulesOf(body),
                  optionalTextOf(body, "tieBreak"),
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
