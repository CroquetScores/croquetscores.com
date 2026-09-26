// /api/v1 — JSON, and the same endpoints whether a mobile app or the admin SPA
// is asking. Operations arrive here as features are accepted.
import type {
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { ArchiveTournament } from "../../../application/operations/tournaments/ArchiveTournament.js";
import { CreateTournament } from "../../../application/operations/tournaments/CreateTournament.js";
import type { TournamentRequest } from "../../../application/operations/tournaments/tournamentOperations.js";
import { RestoreTournament } from "../../../application/operations/tournaments/RestoreTournament.js";
import { TournamentsOfAccount } from "../../../application/operations/tournaments/TournamentsOfAccount.js";
import { TournamentYearsOfAccount } from "../../../application/operations/tournaments/TournamentYearsOfAccount.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Countries } from "../../../domain/aggregates/tournaments/value-objects/Countries.js";
import {
  croquetScoresSports,
  gateballScoresSports,
} from "../../../domain/aggregates/tournaments/value-objects/sports.js";
import {
  croquetScoresFormats,
  gateballScoresFormats,
} from "../../../domain/aggregates/tournaments/value-objects/tournamentFormats.js";
import { readerOf } from "../../common/reader.js";
import { websiteOf } from "../../common/site.js";

// A year as an address writes one: four digits, the first not a nought.
const aYear = /^[1-9]\d{3}$/;

// Only what the reader is signed in to can be asked about, so nobody signed in
// is refused before anything is looked up, rather than shown an empty list
// that says they have no tournaments.
const signedInOrRefused = (
  request: FastifyRequest,
  reply: FastifyReply,
): AccountId | undefined => {
  const reader = readerOf(request);
  if (reader === undefined) {
    void reply
      .code(401)
      .header("cache-control", "no-store")
      .send({ error: "NotSignedIn" });
  }
  return reader;
};

// What a caller sent under `field`, where it is text, and nothing typed where
// it is not: a value of any other kind was not typed into anything, and is
// refused as nothing typed would be rather than failing on the way in.
const textOf = (body: unknown, field: string): string => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "string" ? value : "";
};

// Yes or no where it was said, and unsaid otherwise, which the tournament
// decides for itself (create.feature).
const yesOrNoOf = (body: unknown, field: string): boolean | undefined => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "boolean" ? value : undefined;
};

export const apiV1: FastifyPluginCallback = (server, _options, done) => {
  server.get("/health", () => ({ status: "ok" }));

  // The reader's own, which is who "my" is. Nothing a caller sends can name
  // another account.
  server.get<{ Querystring: { year?: string } }>(
    "/my/tournaments",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const year = request.query.year ?? "";
      if (!aYear.test(year)) {
        return reply
          .code(400)
          .header("cache-control", "no-store")
          .send({ error: "YearUnreadable" });
      }
      const tournaments = await request.server.mediator.query(
        new TournamentsOfAccount(
          reader.value,
          websiteOf(request).host,
          Number(year),
        ),
      );
      return reply.header("cache-control", "no-store").send({ tournaments });
    },
  );

  server.get("/my/tournament-years", async (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const years = await request.server.mediator.query(
      new TournamentYearsOfAccount(reader.value, websiteOf(request).host),
    );
    return reply.header("cache-control", "no-store").send({ years });
  });

  // What a new tournament can be on the website asked: the sports and formats
  // its site offers, in the site's order, and every country with its regions.
  // Asked of the domain rather than written out again here, so that the form
  // offers exactly what creating a tournament accepts.
  server.get("/tournaments/new", (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const gateball = websiteOf(request).site === "gateballScores";
    return reply.header("cache-control", "no-store").send({
      sports: (gateball ? gateballScoresSports : croquetScoresSports).map(
        (sport) => ({ code: sport.code, name: sport.name }),
      ),
      formats: (gateball ? gateballScoresFormats : croquetScoresFormats).map(
        (format) => format.name,
      ),
      countries: Countries.thereAre.all.map((country) => ({
        code: country.code,
        name: country.name,
        regions: country.regions.map((region) => ({
          code: region.code,
          name: region.name,
        })),
      })),
    });
  });

  // A tournament created by the reader, on the website asked, and answered
  // with where it is found. What breaks a rule is refused with every rule it
  // breaks, and what the tournament refuses with its code (errors.ts).
  server.post("/tournaments", async (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const body = request.body;
    const notes = textOf(body, "notes");
    const tournament: TournamentRequest = {
      name: textOf(body, "name"),
      starts: textOf(body, "starts"),
      finishes: textOf(body, "finishes"),
      format: textOf(body, "format"),
      sport: textOf(body, "sport"),
      country: textOf(body, "country"),
      region: textOf(body, "region"),
      ...(notes === "" ? {} : { notes }),
      handicap: yesOrNoOf(body, "handicap"),
      worldRankings: yesOrNoOf(body, "worldRankings"),
      national: yesOrNoOf(body, "national"),
      international: yesOrNoOf(body, "international"),
    };
    const created = await request.server.mediator.send(
      new CreateTournament(
        reader.value,
        websiteOf(request).host,
        tournament,
        request.requestedAt,
      ),
    );
    return reply
      .code(201)
      .header("cache-control", "no-store")
      .send({ id: created.id.value, address: created.address.toString() });
  });

  // The tournament by the part of its id after "tournament/", so that the id
  // is one segment of the address rather than two.
  for (const [action, making] of [
    ["archive", ArchiveTournament],
    ["restore", RestoreTournament],
  ] as const) {
    server.post<{ Params: { id: string } }>(
      `/tournaments/:id/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        await request.server.mediator.send(
          new making(
            reader.value,
            `tournament/${request.params.id}`,
            request.requestedAt,
          ),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  done();
};
