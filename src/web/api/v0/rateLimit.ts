// What every request under /api/v0 is counted against (rateLimit.feature).
//
// Two counts are made, each in a scope of its own, since the plugin keeps one
// count and one allowance for each time it is registered: a day's and a
// minute's. Every request counts the same, a list as much as a read of one
// tournament: the allowance is the one set on the key, so that raising it for
// a partner changes the key and nothing else, and a second, hidden allowance
// for lists would make what the key says untrue. A request is let through
// only if both allow it, and the headers it is answered with are those of the
// minute's.
//
// Counted by the key where the request carries one that works, and by the
// address otherwise, with a smaller allowance: a key that does not work is
// counted by address as well, since making keys up must not be a way to an
// allowance. Counts are kept in this process, as the site's other limits are
// (helpSearch.ts). A second process would count for itself, which the issue
// that decided this (#684) accepts while there is one.
import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { IdentifyApiKey } from "../../../application/operations/accounts/IdentifyApiKey.js";
import type { ApiKeyIdentified } from "../../../application/operations/accounts/IdentifyApiKey.js";
import { loggedAsInformation } from "../../common/errors.js";
import { readerOf } from "../../common/reader.js";
import { ipAddressOf } from "../../common/trustedProxy.js";
import { keyOf } from "./apiKey.js";

// The methods that change something, as crossSite.ts counts them.
const changing: ReadonlySet<string> = new Set([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

// The lists a form of the website offers its choices from, by the address each
// is registered at under /api/v0.
const listsFormsChooseFrom: ReadonlySet<string> = new Set([
  "/tournaments/sports",
  "/tournaments/formats",
  "/countries",
]);

const formsChooseFrom = (request: FastifyRequest): boolean => {
  const url = request.routeOptions.url ?? "";
  return [...listsFormsChooseFrom].some((list) =>
    url.endsWith(`/api/v0${list}`),
  );
};

/** What a caller with no key may ask for, a minute and, unless the site is told less, a day. */
export const requestsAMinuteWithNoKey = 10;
export const requestsADayWithNoKeyUsually = 500;

/** Who a request comes from: a key that works, or only an address. */
export interface Caller {
  /** What the key it carries is, where it works. */
  readonly key: ApiKeyIdentified | undefined;
  /** Whether it carried a key at all, which may not work. */
  readonly carriedKey: boolean;
}

const callers = new WeakMap<FastifyRequest, Caller>();

/** The caller of a request under /api/v0, as it was found before the request was counted. */
export const callerOf = (request: FastifyRequest): Caller => {
  const caller = callers.get(request);
  if (caller === undefined) {
    throw new Error("The request's caller has not been found.");
  }
  return caller;
};

/**
 * Finds who each request is from, before any is counted, so that the counts
 * and the routes agree about it and the key is looked up once.
 */
export const findingCallers = (server: FastifyInstance): void => {
  server.addHook("onRequest", async (request) => {
    const sent = keyOf(request);
    const key =
      sent === undefined
        ? undefined
        : await request.server.mediator.query(new IdentifyApiKey(sent));
    callers.set(request, { key, carriedKey: sent !== undefined });
  });
};

const minuteOf = (caller: Caller): number =>
  caller.key?.perMinute ?? requestsAMinuteWithNoKey;

const dayOf = (caller: Caller, withNoKey: number): number =>
  caller.key?.perDay ?? withNoKey;

// Two callers count apart, so a key and an address that look alike do not.
const countedAs = (request: FastifyRequest): string => {
  const { key } = callerOf(request);
  return key === undefined
    ? `address:${ipAddressOf(request)}`
    : `key:${key.keyId}`;
};

type Count = "day" | "minute";

/**
 * Counts what is registered in `server` from here on, against the day's or
 * the minute's allowance of whoever sent it.
 */
export const counting = async (
  server: FastifyInstance,
  count: Count,
  requestsADayWithNoKey: number,
): Promise<void> => {
  await server.register(rateLimit, {
    max: (request) => {
      const caller = callerOf(request);
      return count === "day"
        ? dayOf(caller, requestsADayWithNoKey)
        : minuteOf(caller);
    },
    timeWindow: count === "day" ? "1 day" : "1 minute",
    keyGenerator: countedAs,
    // What a reader signed in to the website changes is the website's own
    // pages at work, which /api/site was never counted for, so moving a route
    // here does not start counting it. A request that sends a key is counted
    // whoever is signed in, and what only reads is counted as ever.
    // Only the methods that change something, and not what answers an address
    // there is nothing at, which is for any caller to ask of and is counted.
    // The three lists the website's forms choose from are the one read that
    // is let through the same way, since a form asks for them each time it is
    // opened, as it asked /api/site before; no other read is.
    allowList: (request) =>
      (changing.has(request.method)
        ? request.routeOptions.url?.endsWith("/*") !== true
        : request.method === "GET" && formsChooseFrom(request)) &&
      !callerOf(request).carriedKey &&
      readerOf(request) !== undefined,
    cache: 100_000,
    // The day's count says nothing until it refuses, since the minute's
    // headers are the ones a caller reads the allowance by.
    ...(count === "day"
      ? {
          addHeadersOnExceeding: {
            "ratelimit-limit": false,
            "ratelimit-remaining": false,
            "ratelimit-reset": false,
          },
        }
      : {}),
    // The headers the issue names, which say what the allowance was, what is
    // left of it and when it is made again, and how long to wait once it is
    // used.
    enableDraftSpec: true,
    errorResponseBuilder: (_request, context) =>
      Object.assign(
        new Error(`Too many requests. Try again in ${context.after}.`),
        {
          statusCode: 429,
          code: count === "day" ? "RateLimit.PerDay" : "RateLimit.PerMinute",
          // A caller that has used its allowance is nothing to look at.
          [loggedAsInformation]: true,
        },
      ),
  });
};
