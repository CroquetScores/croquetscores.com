// Whether search engines are asked to index the site, which is a setting and
// not a page's own business: a site being tried by a few people first should
// not be found by anybody who has not been sent there, and a result once
// indexed is slow to be forgotten.
//
// Said twice, because each covers what the other does not. The robots file is
// what a crawler reads before it reads anything else. The header is on every
// answer, so a page linked to from somewhere before the crawler read the file,
// and a file that is no page, say the same.
import type { FastifyInstance } from "fastify";

const keepAway = "User-agent: *\nDisallow: /\n";

// What is not for readers, and so not for a search engine to list even where
// the rest is welcome. The admin and sign-in have nothing to be found in, and
// the API is for the admin and the apps.
const welcome =
  "User-agent: *\nDisallow: /admin\nDisallow: /api/\nDisallow: /auth/\n";

export const registerSearchEngines = (
  server: FastifyInstance,
  searchEnginesWelcome: boolean,
): void => {
  server.get("/robots.txt", (_request, reply) =>
    reply
      // Asked again each time, since the file is small and a site that has just
      // been told it is welcome should not be kept out by a copy of this one.
      .header("cache-control", "public, no-cache")
      .type("text/plain; charset=utf-8")
      .send(searchEnginesWelcome ? welcome : keepAway),
  );

  if (searchEnginesWelcome) return;
  server.addHook("onSend", (_request, reply, payload, done) => {
    reply.header("x-robots-tag", "noindex, nofollow");
    done(null, payload);
  });
};
