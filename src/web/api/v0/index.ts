// /api/v0 — JSON, for apps: the public API, which is in development and so is
// v0 until everyone concerned accepts it, when it becomes v1 (#684). A breaking
// change after that is a new version beside it, never an edit. Nothing here is
// covered by /api/site's words, which are for the website's own pages, and
// nothing of /api/site is counted by the allowances set here.
import type { FastifyPluginAsync } from "fastify";

import { WhatAKeyMayDoInTournament } from "../../../application/operations/tournaments/WhatAKeyMayDoInTournament.js";
import { TournamentOperationRefused } from "../../../application/operations/tournaments/tournamentOperations.js";
import { keyOf, refuseKey } from "./apiKey.js";
import { refusal } from "./errors.js";
import {
  counting,
  findingCallers,
  requestsADayWithNoKeyUsually,
} from "./rateLimit.js";
import { competitionOfApps } from "./competition.js";
import { tournamentOfApps } from "./tournament.js";
import { archivedTournamentsOfApps } from "./archived.js";
import { tournamentsChangedYearOfApps } from "./changedYear.js";
import { tournamentsOfApps } from "./tournaments.js";
import { createTournamentOfApps } from "./createTournament.js";
import { tournamentActionsOfApps } from "./tournamentActions.js";
import { addCompetitionOfApps } from "./addCompetition.js";
import { competitionActionsOfApps } from "./competitionActions.js";
import { competitionPlayersOfApps } from "./competitionPlayers.js";
import { competitionPlayerActionsOfApps } from "./competitionPlayerActions.js";
import { competitionGamesOfApps } from "./competitionGames.js";
import { competitionGameActionsOfApps } from "./competitionGameActions.js";

export interface ApiV0Options {
  /** What a caller with no key may ask in a day, counted by address. */
  readonly requestsADayWithNoKey?: number;
  /** Whether croquetscores.com offers Advantage Golf Croquet (the setting). */
  readonly advantageGolfCroquet?: boolean;
}

export const apiV0: FastifyPluginAsync<ApiV0Options> = async (
  server,
  {
    requestsADayWithNoKey = requestsADayWithNoKeyUsually,
    advantageGolfCroquet = false,
  },
) => {
  findingCallers(server);

  // Each allowance is a scope inside the one before, so that a request is
  // counted against the minute's and then the day's, whatever it asks for.
  // The minute's comes first so that a request it refuses is not counted
  // against the day, which a caller that keeps trying while it waits would
  // otherwise use up. Every route of the API is registered inside the day's.
  await server.register(async (minute) => {
    await counting(minute, "minute", requestsADayWithNoKey);
    await minute.register(async (day) => {
      await counting(day, "day", requestsADayWithNoKey);

      // What the key sent may do in a tournament, named by the part of its id
      // after "tournament/", so that the id is one segment of an address. Said
      // to the key and nobody else's, so it is neither kept nor shared.
      day.get<{ Params: { id: string } }>(
        "/tournaments/:id/permissions",
        async (request, reply) => {
          const key = keyOf(request);
          if (key === undefined) return refuseKey(reply, false);
          try {
            const may = await request.server.mediator.query(
              new WhatAKeyMayDoInTournament(
                key,
                `tournament/${request.params.id}`,
              ),
            );
            if (may === undefined) return refuseKey(reply, true);
            return reply
              .header("cache-control", "no-store")
              .header("vary", "Authorization")
              .send(may);
          } catch (failure) {
            if (
              failure instanceof TournamentOperationRefused &&
              failure.code === "WhatAKeyMayDoInTournament.NoSuchTournament"
            ) {
              return refusal(
                reply,
                404,
                "Tournament.NotFound",
                "There is no such tournament.",
              );
            }
            throw failure;
          }
        },
      );

      await day.register(tournamentsOfApps);
      await day.register(tournamentsChangedYearOfApps);
      await day.register(archivedTournamentsOfApps);
      await day.register(tournamentOfApps);
      await day.register(competitionOfApps);
      await day.register(createTournamentOfApps);
      await day.register(tournamentActionsOfApps);
      await day.register(addCompetitionOfApps, { advantageGolfCroquet });
      await day.register(competitionActionsOfApps);
      await day.register(competitionPlayersOfApps);
      await day.register(competitionPlayerActionsOfApps);
      await day.register(competitionGamesOfApps);
      await day.register(competitionGameActionsOfApps);

      // An address nothing is at is counted as any other request is, so that
      // asking for what is not there is no way round the allowance.
      day.all("/*", (_request, reply) =>
        refusal(
          reply,
          404,
          "Route.NotFound",
          "There is nothing at that address.",
        ),
      );
    });
  });
};
