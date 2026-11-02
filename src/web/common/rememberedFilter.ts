// What a reader narrowed the lists of tournaments by, which the next visit to
// a page of them begins from: the country, a region of it and a sport. It is
// kept as the sorting is (rememberedSorting.ts), in a cookie the server reads
// before it draws the page, and for the same reason: with it kept where only a
// script could read it, the reader would be shown everything first and watch
// it narrow.
//
// It differs from the sorting in who may set it. A link from another site can
// set a reader's sorting, since all that changes is an order they put back with
// one press. A filter changes which tournaments they are shown at all, and a
// reader who does not see one has no reason to look for the form that took it
// away. So it is remembered only from a request the browser says came from
// this website, as pressing the form or a flag does, and not from one that
// came from another site, from a bookmark or from an address typed in, however
// they are worded. The page is still drawn as such an address says, for that
// visit: only the remembering is refused.
import type { FastifyReply, FastifyRequest } from "fastify";

import { Countries } from "../../domain/aggregates/tournaments/value-objects/Countries.js";
import { sportsOffered } from "../../domain/aggregates/tournaments/value-objects/sports.js";
import { keep, namesIn } from "./rememberedSorting.js";
import { websiteOf } from "./site.js";
import { aYear, keptByTheServer } from "./theme.js";

export const filterCookie = "filter";

/**
 * What a page asks, beside the sorting of its lists, to have the filter
 * remembered: the name the filter is kept under in the page's address, as a
 * list's sorting is.
 */
export const filterList = "filter";

/** The country, region and sport chosen, each only where it was. */
export interface Filter {
  readonly country?: string | undefined;
  readonly region?: string | undefined;
  readonly sport?: string | undefined;
}

// A region is only a region of the country it is in.
export const isRegionOf = (
  country: string | undefined,
  region: string,
): boolean =>
  country !== undefined &&
  Countries.thereAre.find(country)?.findRegion(region) !== undefined;

// `chosen` less whatever this website cannot mean by it: a country, region or
// sport it does not offer would be refused as a mistake. What the device
// remembers is held to this both ways, so that a filter is never stored that
// would not be shown, and one stored before the website changed is left out
// rather than refused, since the reader made no mistake.
const meaningful = (request: FastifyRequest, chosen: Filter): Filter => {
  const country =
    chosen.country !== undefined &&
    Countries.thereAre.find(chosen.country) !== undefined
      ? chosen.country
      : undefined;
  const sport = sportsOffered[websiteOf(request).site].some(
    ({ code }) => code === chosen.sport,
  )
    ? chosen.sport
    : undefined;
  return {
    country,
    region:
      chosen.region !== undefined && isRegionOf(country, chosen.region)
        ? chosen.region
        : undefined,
    sport,
  };
};

const written = (request: FastifyRequest): Filter => {
  const stored = new URLSearchParams(request.cookies[filterCookie] ?? "");
  return {
    country: stored.get("country") ?? undefined,
    region: stored.get("region") ?? undefined,
    sport: stored.get("sport") ?? undefined,
  };
};

/**
 * The filter the device remembers, less what this website no longer offers.
 * Whether the sport is one the page honours is for the page to say.
 */
export const rememberedFilterOf = (request: FastifyRequest): Filter =>
  meaningful(request, written(request));

/**
 * Whether the reader pressed something that asks for the filter to be
 * remembered, and the browser says it was on this website that they did.
 * A request that says nothing of where it came from is not taken to have
 * come from here: a reader's browser says, and anything else has no cookies
 * of a reader's to be set.
 */
export const asksToRememberFilter = (request: FastifyRequest): boolean => {
  const query = (request.query ?? {}) as Readonly<Record<string, unknown>>;
  return (
    namesIn(query[keep]).includes(filterList) &&
    request.headers["sec-fetch-site"] === "same-origin"
  );
};

/**
 * Remembers `chosen`, or forgets the filter where there is nothing in it to
 * remember: "any" is not recorded, so a field left at it forgets what was
 * remembered of it. A page that has no sport to choose passes `keepSport` and
 * leaves what was remembered of the sport as it was.
 */
export const rememberFilter = (
  request: FastifyRequest,
  reply: FastifyReply,
  chosen: Filter,
  { keepsSport = false }: { readonly keepsSport?: boolean } = {},
): void => {
  const now = meaningful(request, {
    ...chosen,
    sport: keepsSport ? written(request).sport : chosen.sport,
  });
  const stored = new URLSearchParams(
    Object.entries(now).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );
  if (stored.size === 0) reply.clearCookie(filterCookie, keptByTheServer);
  else
    reply.setCookie(filterCookie, stored.toString(), {
      ...keptByTheServer,
      maxAge: aYear,
    });
};
