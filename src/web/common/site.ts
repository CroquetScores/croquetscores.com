// What the site is called, which is the site's own name rather than a word of
// anybody's language: it is configured, it is in no catalogue, and it is what
// the site's emails call it too (emailWriter.ts). A catalogue that spelled it
// out would be a second place the site is called something, and the two would
// come to disagree the day a site serving from this repository is called
// something else.
//
// Which website the site is served as is read the same way, and for the same
// reason: a page asks whether it is on a try website where it needs to know.
//
// Read from the server rather than passed down from each route, the way the
// reader's language is, so that a page asks for it where it needs it.
import type { FastifyInstance, FastifyRequest } from "fastify";

import type { Website } from "../../domain/common/Website.js";

declare module "fastify" {
  interface FastifyInstance {
    /** What this site is called. Read it through siteNameOf. */
    readonly siteName: string;
    /** Which website this is. Read it through websiteOf. */
    readonly website: Website;
  }
}

export const nameTheSite = (
  server: FastifyInstance,
  name: string,
  website: Website,
): void => {
  server.decorate("siteName", name);
  server.decorate("website", website);
};

/** What the site serving `request` is called. */
export const siteNameOf = (request: FastifyRequest): string =>
  request.server.siteName;

/** Which website the site serving `request` is. */
export const websiteOf = (request: FastifyRequest): Website =>
  request.server.website;
