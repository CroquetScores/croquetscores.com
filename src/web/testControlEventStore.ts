// What lets a scenario hold the public API to the read models: while it is
// told to, a read of the event store made for a request to /api/v0 fails that
// request, so that an endpoint that goes back to the events is seen to rather
// than quietly working. Only the API's requests are held to it, and only reads
// are refused, so the site goes on writing as it does and the scenario can set
// up what it asks about through the site's own pages.
//
// The store that refuses is `EventStoreWithRefusableReads`, which a site with
// the test control is given and a site in production is not. What is here says
// which requests are the API's, and lets a scenario say whether to refuse.
import type { FastifyInstance } from "fastify";

import { sameToken, testControlHeader } from "./testControl.js";

/** What the site asks of a store whose reads can be refused. */
export interface ReadsRefusable {
  refuse(refused: boolean): void;
  marked(work: () => void): void;
}

/** Marks each request to the API, for everything it goes on to do. */
export const markRequestsToTheApi = (
  server: FastifyInstance,
  store: ReadsRefusable,
): void => {
  server.addHook("onRequest", (request, _reply, done) => {
    // The path alone, and whole segments of it: /api/v0-notes is not the API,
    // and a query string does not make a request something else.
    const path = request.url.split("?")[0] ?? "";
    if (path === "/api/v0" || path.startsWith("/api/v0/")) {
      store.marked(done);
      return;
    }
    done();
  });
};

/** Mounts what says whether the API may read the events, answering only to `token`. */
export const registerTestControlEventStore = (
  server: FastifyInstance,
  token: string,
  store: ReadsRefusable,
): void => {
  void server.register(
    (scope, _options, done) => {
      scope.addHook("onRequest", async (request, reply) => {
        if (!sameToken(request.headers[testControlHeader], token)) {
          return reply.callNotFound();
        }
        return undefined;
      });

      scope.post("/event-store/api-reads", async (request, reply) => {
        const body = (request.body ?? {}) as { refused?: unknown };
        if (typeof body.refused !== "boolean") {
          return reply
            .code(400)
            .send({ code: "TestControl.NotWhetherRefused" });
        }
        store.refuse(body.refused);
        return reply.code(200).send();
      });

      done();
    },
    { prefix: "/__test" },
  );
};
