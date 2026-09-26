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
import { TournamentToChange } from "../../../application/operations/tournaments/TournamentToChange.js";
import { UpdateTournament } from "../../../application/operations/tournaments/UpdateTournament.js";
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

// What a tournament is to be, as a form sends it to create one or to change
// one. Notes left empty are no notes.
const tournamentFrom = (body: unknown): TournamentRequest => {
  const notes = textOf(body, "notes");
  return {
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
};

// A tournament's address, from the three parts of an API address that carry
// it, so that it reads as the admin's own address does.
interface AtAddress {
  readonly year: string;
  readonly sport: string;
  readonly slug: string;
}
const addressOf = ({ year, sport, slug }: AtAddress): string =>
  `${year}/${sport}/${slug}`;

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
    const tournament = tournamentFrom(request.body);
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

  // The tournament found at an address, now or before, as the reader would
  // change it, with where it is found now. Refused where they do not manage it,
  // where it is archived, and where nothing has been found there.
  server.get<{ Params: AtAddress }>(
    "/tournaments/at/:year/:sport/:slug",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const tournament = await request.server.mediator.query(
        new TournamentToChange(reader.value, addressOf(request.params)),
      );
      return reply.header("cache-control", "no-store").send(tournament);
    },
  );

  // The tournament found at an address changed, and answered with where it is
  // found afterwards, which is somewhere else when its year or its sport
  // changed. Found at the address it was asked at both times, which still
  // leads to it after it has moved.
  server.put<{ Params: AtAddress }>(
    "/tournaments/at/:year/:sport/:slug",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const asked = new TournamentToChange(
        reader.value,
        addressOf(request.params),
      );
      const before = await request.server.mediator.query(asked);
      await request.server.mediator.send(
        new UpdateTournament(
          reader.value,
          before.id,
          tournamentFrom(request.body),
          request.requestedAt,
        ),
      );
      const after = await request.server.mediator.query(asked);
      return reply
        .header("cache-control", "no-store")
        .send({ address: after.address });
    },
  );

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
