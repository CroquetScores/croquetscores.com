// /api/v1 — JSON, and the same endpoints whether a mobile app or the admin SPA
// is asking. Operations arrive here as features are accepted.
import type {
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { ArchiveTournament } from "../../../application/operations/tournaments/ArchiveTournament.js";
import { ArchiveCompetition } from "../../../application/operations/tournaments/ArchiveCompetition.js";
import { CompetitionsOfTournament } from "../../../application/operations/tournaments/CompetitionsOfTournament.js";
import { CreateTournament } from "../../../application/operations/tournaments/CreateTournament.js";
import { MoveCompetition } from "../../../application/operations/tournaments/MoveCompetition.js";
import { AddManager } from "../../../application/operations/tournaments/AddManager.js";
import { AddScorer } from "../../../application/operations/tournaments/AddScorer.js";
import { ManagersOfTournament } from "../../../application/operations/tournaments/ManagersOfTournament.js";
import { RemoveManager } from "../../../application/operations/tournaments/RemoveManager.js";
import { RemoveScorer } from "../../../application/operations/tournaments/RemoveScorer.js";
import { RestoreCompetition } from "../../../application/operations/tournaments/RestoreCompetition.js";
import { ScorersOfTournament } from "../../../application/operations/tournaments/ScorersOfTournament.js";
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
import { speakingOf } from "../../common/language.js";
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
  // offers exactly what creating a tournament accepts. Each is sent back by
  // its code, and named in the reader's language: a format by the name the
  // domain knows it by, since that is what creating one takes. The countries
  // are in order of their names as the reader's language has them, which is
  // the order a reader looks for one in. A region is named as it was recorded,
  // since there are hundreds, most already in their own country's language.
  server.get("/tournaments/new", (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const speaking = speakingOf(request);
    const gateball = websiteOf(request).site === "gateballScores";
    const byName = new Intl.Collator(speaking.language.tag);
    return reply.header("cache-control", "no-store").send({
      sports: (gateball ? gateballScoresSports : croquetScoresSports).map(
        (sport) => ({
          code: sport.code,
          name: speaking.say(`sport.${sport.code}`),
        }),
      ),
      formats: (gateball ? gateballScoresFormats : croquetScoresFormats).map(
        (format) => ({
          code: format.name,
          name: speaking.say(`format.${format.code}`),
        }),
      ),
      countries: Countries.thereAre.all
        .map((country) => ({
          code: country.code,
          name: speaking.say(`country.${country.code}`),
          regions: country.regions.map((region) => ({
            code: region.code,
            name: region.name,
          })),
        }))
        .sort((one, other) => byName.compare(one.name, other.name)),
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

  // A tournament's competitions, as its manager lists them, in the
  // tournament's order.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/competitions",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const competitions = await request.server.mediator.query(
        new CompetitionsOfTournament(
          reader.value,
          `tournament/${request.params.id}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ competitions });
    },
  );

  // A competition moved a place, archived or restored, named by the part of
  // its id after "competition/", as the tournament is by its own.
  for (const action of ["up", "down", "archive", "restore"] as const) {
    server.post<{ Params: { id: string; competition: string } }>(
      `/tournaments/:id/competitions/:competition/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        const tournament = `tournament/${request.params.id}`;
        const competition = `competition/${request.params.competition}`;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchiveCompetition(reader.value, tournament, competition, at)
            : action === "restore"
              ? new RestoreCompetition(
                  reader.value,
                  tournament,
                  competition,
                  at,
                )
              : new MoveCompetition(
                  reader.value,
                  tournament,
                  competition,
                  action,
                  at,
                ),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A tournament's scorers, as its manager lists them.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/scorers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const scorers = await request.server.mediator.query(
        new ScorersOfTournament(
          reader.value,
          `tournament/${request.params.id}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ scorers });
    },
  );

  // Somebody made a scorer, by their email address.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/scorers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new AddScorer(
          reader.value,
          `tournament/${request.params.id}`,
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
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new RemoveScorer(
          reader.value,
          `tournament/${request.params.id}`,
          `account/${request.params.account}`,
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A tournament's managers, as its manager lists them.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/managers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const managers = await request.server.mediator.query(
        new ManagersOfTournament(
          reader.value,
          `tournament/${request.params.id}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ managers });
    },
  );

  // Somebody made a manager, by their email address.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/managers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new AddManager(
          reader.value,
          `tournament/${request.params.id}`,
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
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new RemoveManager(
          reader.value,
          `tournament/${request.params.id}`,
          `account/${request.params.account}`,
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  done();
};
