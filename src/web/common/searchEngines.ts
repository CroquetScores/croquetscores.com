// Whether search engines are asked to index the site, which is a setting and
// not a page's own business: a site being tried by a few people first should
// not be found by anybody who has not been sent there, and a result once
// indexed is slow to be forgotten.
//
// Said twice, because each covers what the other does not. The robots file is
// what a crawler reads before it reads anything else. The header is on every
// answer, so a page linked to from somewhere before the crawler read the file,
// and a file that is no page, say the same.
import { Website } from "../../domain/common/Website.js";
import type { FastifyInstance, FastifyRequest } from "fastify";

const keepAway = "User-agent: *\nDisallow: /\n";

// What is not for readers, and so not for a search engine to list even where
// the rest is welcome. The admin and sign-in have nothing to be found in, and
// the API is for the admin and the apps.
const welcome =
  "User-agent: *\nDisallow: /admin\nDisallow: /api/\nDisallow: /auth/\n";

// The two websites a reader is sent to. The setting is the server's, and one
// server answers for these, a try website under each, and the beta; a try
// website says on every page that whatever is entered there may be removed at
// any time, so a result indexed from one would put somebody's practice in
// front of the world, and is slow to be forgotten. So the setting is not
// enough: only these two are ever found, however it is set. Decided by the
// address a request was reached at, as the beta notice is (betaSite.ts), and
// an address that is none of the five is kept away rather than guessed at.
const found: readonly string[] = [
  Website.croquetScores.host,
  Website.gateballScores.host,
];

const isWelcomed = (
  request: FastifyRequest,
  searchEnginesWelcome: boolean,
): boolean =>
  searchEnginesWelcome &&
  found.includes(Website.spelled(request.headers.host ?? ""));

export const registerSearchEngines = (
  server: FastifyInstance,
  searchEnginesWelcome: boolean,
): void => {
  server.get("/robots.txt", (request, reply) =>
    reply
      // Asked again each time, since the file is small and a site that has just
      // been told it is welcome should not be kept out by a copy of this one.
      .header("cache-control", "public, no-cache")
      .type("text/plain; charset=utf-8")
      .send(isWelcomed(request, searchEnginesWelcome) ? welcome : keepAway),
  );

  server.addHook("onSend", (request, reply, payload, done) => {
    if (!isWelcomed(request, searchEnginesWelcome)) {
      reply.header("x-robots-tag", "noindex, nofollow");
    }
    done(null, payload);
  });
};
