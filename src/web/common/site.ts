// What the site is called, which is the site's own name rather than a word of
// anybody's language: it is configured, it is in no catalogue, and it is what
// the site's emails call it too (emailWriter.ts). A catalogue that spelled it
// out would be a second place the site is called something, and the two would
// come to disagree the day a site serving from this repository is called
// something else.
//
// Read from the server rather than passed down from each route, the way the
// reader's language is, so that a page asks for it where it needs it.
import type { FastifyInstance, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    /** What this site is called. Read it through siteNameOf. */
    readonly siteName: string;
  }
}

export const nameTheSite = (server: FastifyInstance, name: string): void => {
  server.decorate("siteName", name);
};

/** What the site serving `request` is called. */
export const siteNameOf = (request: FastifyRequest): string =>
  request.server.siteName;
