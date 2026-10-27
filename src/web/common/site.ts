// Which website a request is for, and so what the site it is served by is
// called, both read from the host the request was addressed to. One server
// answers for every website (Website.feature), so neither is set once for the
// server: a page asks for them where it needs them.
//
// What the site is called is the site's own name rather than a word of
// anybody's language: it is in no catalogue, and it is what the site's emails
// call it too (emailWriter.ts). A catalogue that spelled it out would be a
// second place the site is called something, and the two would come to
// disagree.
//
// Read from the request rather than passed down from each route, the way the
// reader's language is, so that a page asks for it where it needs it.
import type { FastifyInstance, FastifyRequest } from "fastify";

import { Website, type Site } from "../../domain/common/Website.js";
import { ValidationError } from "../../domain/common/validation/ValidationError.js";

declare module "fastify" {
  interface FastifyRequest {
    /** Which website this request is for. Read it through websiteOf. */
    website: Website | undefined;
    /** Which it was addressed to. Read it through servedAsOf. */
    servedAs: Website | undefined;
  }
}

// Where the health check is (maintenance.ts says why it is let through).
const healthCheck = "/api/site/health";

const names: Readonly<Record<Site, string>> = {
  croquetScores: "Croquet Scores",
  gateballScores: "Gateball Scores",
};

/** What the site `website` serves is called. */
export const siteNameFor = (website: Website): string => names[website.site];

/** What the site serving `request` is called. */
export const siteNameOf = (request: FastifyRequest): string =>
  siteNameFor(websiteOf(request));

/**
 * Which website `request` was addressed to: the beta site where it was, and
 * otherwise {@link websiteOf}. Asked for what a reader is shown or sent of the
 * address they came by, such as the link in an email; what is kept and read is
 * websiteOf's.
 */
export const servedAsOf = (request: FastifyRequest): Website => {
  if (request.servedAs === undefined) {
    throw new Error("The request has not been placed on a website.");
  }
  return request.servedAs;
};

/**
 * Which website `request` is for, as far as what is kept and read: the beta
 * site is for croquetscores.com. Every request that reaches a route has one,
 * because {@link placeRequests} answers the rest before they get there.
 */
export const websiteOf = (request: FastifyRequest): Website => {
  if (request.website === undefined) {
    throw new Error("The request has not been placed on a website.");
  }
  return request.website;
};

// Not a page of any website, and so not drawn with a website's shell, its name
// or its words: there is none to speak for it, which is the whole of what is
// wrong with the request.
const misdirectedPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Misdirected request</title>
  </head>
  <body>
    <h1>Misdirected request</h1>
    <p>This server does not answer for the address you asked for.</p>
  </body>
</html>
`;

/**
 * Places every request on the website its host names, and answers 421
 * Misdirected Request to one that names none, before anything else is done
 * for it (unknownHost.feature). Registered ahead of every hook that reads the
 * website, which includes the ones that refuse a request.
 */
export const placeRequests = (server: FastifyInstance): void => {
  server.decorateRequest("website", undefined);
  server.decorateRequest("servedAs", undefined);
  server.addHook("onRequest", async (request, reply) => {
    try {
      request.servedAs = Website.addressedTo(request.host);
      request.website = request.servedAs.countsAs;
      return;
    } catch (refusal) {
      if (!(refusal instanceof ValidationError)) throw refusal;
    }
    // Answered whoever asks and placed on nothing: it reads no website, and a
    // probe that calls the instance by its address is not misdirected.
    if (request.url.split("?")[0] === healthCheck) return;
    reply.header("cache-control", "no-store").code(421);
    if (request.url.startsWith("/api/")) {
      return reply.send({ error: "Request.Misdirected" });
    }
    return reply.type("text/html; charset=utf-8").send(misdirectedPage);
  });
};
