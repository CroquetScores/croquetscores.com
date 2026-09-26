// /api/v1 — JSON, and the same endpoints whether a mobile app or the admin SPA
// is asking. Operations arrive here as features are accepted.
import type {
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { ArchiveTournament } from "../../../application/operations/tournaments/ArchiveTournament.js";
import { RestoreTournament } from "../../../application/operations/tournaments/RestoreTournament.js";
import { TournamentsOfAccount } from "../../../application/operations/tournaments/TournamentsOfAccount.js";
import { TournamentYearsOfAccount } from "../../../application/operations/tournaments/TournamentYearsOfAccount.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
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
