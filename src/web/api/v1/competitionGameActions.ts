// What is done to one of a competition's games by asking, with no more said
// than which (competitionGameActions.feature):
// POST /api/v1/tournaments/{id}/competitions/{competition}/games/{game}/{action},
// with the tournament, the competition and the game each named by the part of
// its id after its kind, so that each is one segment of the address. Each was
// at /api/site/tournaments/{id}/competitions/{competition}/games/{game}, and
// is only here now.
import type { FastifyPluginAsync } from "fastify";

import { ArchiveGame } from "../../../application/operations/competitions/ArchiveGame.js";
import { MoveGame } from "../../../application/operations/competitions/MoveGame.js";
import { RestoreGame } from "../../../application/operations/competitions/RestoreGame.js";
import { ReverseGameWithdrawal } from "../../../application/operations/competitions/ReverseGameWithdrawal.js";
import { WithdrawGame } from "../../../application/operations/competitions/WithdrawGame.js";
import { writerOf } from "./writer.js";

export const competitionGameActionsOfApps: FastifyPluginAsync = (server) => {
  // A test's score moved a place, up or down, by the part of its id after
  // "game/".
  for (const direction of ["up", "down"] as const) {
    server.post<{ Params: { id: string; competition: string; game: string } }>(
      `/tournaments/:id/competitions/:competition/games/:game/${direction}`,
      async (request, reply) => {
        const tournament = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, tournament);
        if (writer === undefined) return reply;
        await request.server.mediator.send(
          new MoveGame(
            writer.value,
            tournament,
            `competition/${request.params.competition}`,
            `game/${request.params.game}`,
            direction,
            request.requestedAt,
          ),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A game's score archived or restored, withdrawn or its withdrawal reversed,
  // by the part of its id after "game/". Unwithdraw, as a player's withdrawal is
  // reversed.
  const gameActions = {
    archive: ArchiveGame,
    restore: RestoreGame,
    withdraw: WithdrawGame,
    unwithdraw: ReverseGameWithdrawal,
  } as const;
  for (const action of Object.keys(
    gameActions,
  ) as (keyof typeof gameActions)[]) {
    server.post<{ Params: { id: string; competition: string; game: string } }>(
      `/tournaments/:id/competitions/:competition/games/:game/${action}`,
      async (request, reply) => {
        const tournament = `tournament/${request.params.id}`;
        const writer = writerOf(request, reply, tournament);
        if (writer === undefined) return reply;
        const asked = [
          writer.value,
          tournament,
          `competition/${request.params.competition}`,
          `game/${request.params.game}`,
          request.requestedAt,
        ] as const;
        await request.server.mediator.send(new gameActions[action](...asked));
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }
  return Promise.resolve();
};
