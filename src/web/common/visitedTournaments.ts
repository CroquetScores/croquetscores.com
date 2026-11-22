// The tournaments a reader's device has visited lately, which the home page
// lists. Each is kept by its address, as "2026/ac/spring-open", and not by its
// name, so that what the page says is what the tournament is called now, and a
// tournament since archived is left out rather than shown stale. It is kept in
// a cookie for the reason the sorting and the filter are (rememberedSorting.ts):
// the server draws the home page before any script could read it.
//
// Unlike the filter it is remembered from any request that opens a
// tournament's page, however the reader came to it, since a link followed from
// an email is a tournament visited all the same. What it changes is a list of
// links to public pages, which nobody is deceived by, and the cookie holds
// nothing of who the reader is.
import type { FastifyReply, FastifyRequest } from "fastify";

import { aYear, keptByTheServer } from "./theme.js";

export const visitedCookie = "visited";

/** How many tournaments are remembered. A sixth pushes the oldest out. */
export const mostVisited = 5;

/**
 * The addresses the device remembers, the one visited latest first. A cookie
 * nobody can make sense of remembers nothing, however it came to be: a
 * reader's device is theirs to do what they like with.
 */
export const visitedOf = (request: FastifyRequest): readonly string[] => {
  let written: string[];
  try {
    written = new URLSearchParams(request.cookies[visitedCookie] ?? "").getAll(
      "tournament",
    );
  } catch {
    return [];
  }
  // Each once, and never more than are kept, whatever the cookie says: it is
  // read on the way in and so is not to be trusted to be as it was written.
  return [...new Set(written.filter((address) => address !== ""))].slice(
    0,
    mostVisited,
  );
};

/**
 * Remembers that the device visited the tournament at `address`: it is put
 * first, taken out of wherever else it was, and the one visited longest ago is
 * dropped where there are now more than are kept.
 */
export const rememberVisit = (
  request: FastifyRequest,
  reply: FastifyReply,
  address: string,
): void => {
  // Sent on every visit, even when the list comes out as it was. A browser
  // counts a cookie's life from when it was given it, so sending it again is
  // what keeps a reader who comes back every week from losing their list a
  // year after the first visit, as the session's cookie is (session.feature).
  const now = [
    address,
    ...visitedOf(request).filter((each) => each !== address),
  ].slice(0, mostVisited);
  reply.setCookie(
    visitedCookie,
    new URLSearchParams(
      now.map((each): [string, string] => ["tournament", each]),
    ).toString(),
    { ...keptByTheServer, maxAge: aYear },
  );
};
