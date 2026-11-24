// A competition's games, recorded and changed by asking
// (competitionGames.feature):
// POST /api/v1/tournaments/{id}/competitions/{competition}/games..., with the
// tournament, the competition and the game each named by the part of its id
// after its kind, so that each is one segment of the address. Each was at
// /api/site/tournaments/{id}/competitions/{competition}/games, and is only
// here now.
import type { FastifyPluginAsync } from "fastify";

import { CorrectGame } from "../../../application/operations/competitions/CorrectGame.js";
import { AddGame } from "../../../application/operations/competitions/AddGame.js";
import { gamePlayerOf, textOf, typedOf } from "../../common/requestBody.js";
import { writerOf } from "./writer.js";

export const competitionGamesOfApps: FastifyPluginAsync = (server) => {
  // A game's score added, as the score dialog sends it, its players by the
  // part of their ids after "competition-player/", or a test's by their whole
  // ids (gamePlayerOf), and answered with the game's id. What was left empty is
  // left out, for the game to refuse.
  server.post<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/games",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const player = (field: string): string | undefined =>
        gamePlayerOf(textOf(request.body, field));
      const score = (field: string): string | undefined => {
        const said = textOf(request.body, field);
        return said === "" ? undefined : said;
      };
      const added = await request.server.mediator.send(
        new AddGame(
          writer.value,
          tournament,
          `competition/${request.params.competition}`,
          {
            winner: player("winner"),
            winnerScore: score("winnerScore"),
            loser: player("loser"),
            loserScore: score("loserScore"),
            winnerHoops: typedOf(request.body, "winnerHoops"),
            winnerTarget: typedOf(request.body, "winnerTarget"),
            loserHoops: typedOf(request.body, "loserHoops"),
            loserTarget: typedOf(request.body, "loserTarget"),
          },
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added });
    },
  );

  // A game's scores corrected, as the score dialog sends them, by the part of
  // its id after "game/", and its players where they are sent, as adding a
  // game sends them. A player not sent is the game's own. A score left empty is
  // left out, for the command to refuse.
  server.post<{ Params: { id: string; competition: string; game: string } }>(
    "/tournaments/:id/competitions/:competition/games/:game/correct",
    async (request, reply) => {
      const tournament = `tournament/${request.params.id}`;
      const writer = writerOf(request, reply, tournament);
      if (writer === undefined) return reply;
      const score = (field: string): string | undefined => {
        const said = textOf(request.body, field);
        return said === "" ? undefined : said;
      };
      const player = (field: string): string | undefined =>
        gamePlayerOf(textOf(request.body, field));
      await request.server.mediator.send(
        new CorrectGame(
          writer.value,
          tournament,
          `competition/${request.params.competition}`,
          `game/${request.params.game}`,
          {
            winnerScore: score("winnerScore"),
            loserScore: score("loserScore"),
            winnerHoops: typedOf(request.body, "winnerHoops"),
            winnerTarget: typedOf(request.body, "winnerTarget"),
            loserHoops: typedOf(request.body, "loserHoops"),
            loserTarget: typedOf(request.body, "loserTarget"),
            winner: player("winner"),
            loser: player("loser"),
          },
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );
  return Promise.resolve();
};
