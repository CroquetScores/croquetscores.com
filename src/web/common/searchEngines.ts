// Whether search engines are asked to index the site, which is a setting and
// not a page's own business: a site being tried by a few people first should
// not be found by anybody who has not been sent there, and a result once
// indexed is slow to be forgotten.
//
// Said twice, because each covers what the other does not. The robots file is
// what a crawler reads before it reads anything else. The header is on every
// answer, so a page linked to from somewhere before the crawler read the file,
// and a file that is no page, say the same.
import { ValidationError } from "../../domain/common/validation/ValidationError.js";
import { Website } from "../../domain/common/Website.js";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const keepAway = "User-agent: *\nDisallow: /\n";

// What is not for readers, and so not for a search engine to list even where
// the rest is welcome. The admin and sign-in have nothing to be found in, and
// the API is for the admin and the apps.
const welcome =
  "User-agent: *\nDisallow: /admin\nDisallow: /api/\nDisallow: /auth/\n";

// The websites a reader is sent to, which are the two that are neither a try
// website nor development. The setting is the server's, and one
// server answers for them all; a try website says on every page that whatever
// is entered there may be removed at any time, so a result indexed from one
// would put somebody's practice in front of the world, and is slow to be
// forgotten. So the setting is not enough, and only these are ever found,
// however it is set. Decided by the address a request was reached at, which is
// request.host as the rest of the site reads it, so that a proxy's word for it
// is believed only where the proxy is trusted. An address that is none of the
// websites is kept away rather than guessed at.
const isForReaders = (request: FastifyRequest): boolean => {
  try {
    const website = Website.addressedTo(request.host);
    return !website.isTry && website.equals(website.countsAs);
  } catch (refusal) {
    if (refusal instanceof ValidationError) return false;
    throw refusal;
  }
};

export const isWelcomed = (
  request: FastifyRequest,
  searchEnginesWelcome: boolean,
): boolean => searchEnginesWelcome && isForReaders(request);

// What an answer says depends on the host it was asked at, so a cache that
// serves more than one host must not give one's answer for another's.
export const varyByHost = (reply: FastifyReply): void => {
  const already = String(reply.getHeader("vary") ?? "");
  if (/(^|,)\s*(host|\*)\s*(,|$)/i.test(already)) return;
  reply.header("vary", already === "" ? "Host" : `${already}, Host`);
};

export const registerSearchEngines = (
  server: FastifyInstance,
  searchEnginesWelcome: boolean,
): void => {
  server.get("/robots.txt", (request, reply) => {
    const found = isWelcomed(request, searchEnginesWelcome);
    // A website that is found says where its pages are listed. The address is
    // the website's own and never the request's host, which is whatever its
    // sender wrote.
    varyByHost(reply);
    const sitemap = found
      ? `Sitemap: ${Website.addressedTo(request.host).address}/sitemap.xml\n`
      : "";
    return (
      reply
        // Asked again each time, since the file is small and a site that has
        // just been told it is welcome should not be kept out by a copy of
        // this one.
        .header("cache-control", "public, no-cache")
        .type("text/plain; charset=utf-8")
        .send(`${found ? welcome : keepAway}${sitemap}`)
    );
  });

  server.addHook("onSend", (request, reply, payload, done) => {
    varyByHost(reply);
    if (!isWelcomed(request, searchEnginesWelcome)) {
      reply.header("x-robots-tag", "noindex, nofollow");
    }
    done(null, payload);
  });
};
