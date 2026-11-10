// The sitemap: one file listing the pages a search engine should find, at
// "/sitemap.xml", or an index of files of their own where there are more pages
// than a search engine reads from one (sitemap.feature). Only for a website
// that is found (searchEngines.ts); anywhere else it is a page that is not
// there, since a list of what to find on a website that is not to be found
// would say the opposite of the robots file.
//
// Every address is made from the website's own and never from the request's
// host, which is whatever its sender wrote.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AddressesOfWebsite } from "../../application/operations/tournaments/AddressesOfWebsite.js";
import { escape } from "./escape.js";
import { isWelcomed, varyByHost } from "./searchEngines.js";
import { websiteOf } from "./site.js";

/** The most addresses a search engine reads from one sitemap. */
export const mostAddressesInASitemap = 50000;

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
const namespace = "http://www.sitemaps.org/schemas/sitemap/0.9";

// The home page, each year with a tournament, each sport in a year with one,
// and each tournament, each once and in an order that does not change while
// nothing does. A tournament's own sections are not listed: a search for a
// player's name is answered by the tournament.
export const pagesOf = (addresses: readonly string[]): readonly string[] => {
  const pages = new Set<string>(["/"]);
  for (const address of addresses) {
    const [year, sport] = address.split("/");
    if (year === undefined || sport === undefined) continue;
    pages.add(`/${year}`);
    pages.add(`/${year}/${sport}`);
    pages.add(`/${address}`);
  }
  return [...pages];
};

const urlset = (origin: string, paths: readonly string[]): string =>
  `${xml}<urlset xmlns="${namespace}">\n${paths
    .map(
      (path) =>
        `  <url><loc>${escape(`${origin}${encodeURI(path)}`)}</loc></url>\n`,
    )
    .join("")}</urlset>\n`;

const index = (origin: string, parts: number): string =>
  `${xml}<sitemapindex xmlns="${namespace}">\n${Array.from(
    { length: parts },
    (_, at) =>
      `  <sitemap><loc>${origin}/sitemap-${String(at + 1)}.xml</loc></sitemap>\n`,
  ).join("")}</sitemapindex>\n`;

export const registerSitemap = (
  server: FastifyInstance,
  searchEnginesWelcome: boolean,
): void => {
  const send = (reply: FastifyReply, body: string): FastifyReply => {
    varyByHost(reply);
    return (
      reply
        // Asked again each time, as the robots file is, and for the same reason.
        .header("cache-control", "public, no-cache")
        .type("application/xml; charset=utf-8")
        .send(body)
    );
  };

  const pagesAsked = async (request: FastifyRequest): Promise<string[]> =>
    pagesOf(
      await request.server.mediator.query(
        new AddressesOfWebsite(websiteOf(request).host),
      ),
    ) as string[];

  server.get("/sitemap.xml", async (request, reply) => {
    if (!isWelcomed(request, searchEnginesWelcome)) {
      return reply.callNotFound();
    }
    const origin = request.servedAs!.address;
    const pages = await pagesAsked(request);
    if (pages.length <= mostAddressesInASitemap) {
      return send(reply, urlset(origin, pages));
    }
    return send(
      reply,
      index(origin, Math.ceil(pages.length / mostAddressesInASitemap)),
    );
  });

  server.get<{ Params: { part: string } }>(
    "/sitemap-:part(^[1-9]\\d*$).xml",
    async (request, reply) => {
      if (!isWelcomed(request, searchEnginesWelcome)) {
        return reply.callNotFound();
      }
      const pages = await pagesAsked(request);
      const part = Number(request.params.part);
      const these = pages.slice(
        (part - 1) * mostAddressesInASitemap,
        part * mostAddressesInASitemap,
      );
      // A part there is none of is a page that is not there.
      if (these.length === 0 || pages.length <= mostAddressesInASitemap) {
        return reply.callNotFound();
      }
      return send(reply, urlset(request.servedAs!.address, these));
    },
  );
};
