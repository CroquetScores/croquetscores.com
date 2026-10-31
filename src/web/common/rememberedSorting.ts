// How a list was last sorted on a reader's device, which the next visit to its
// page begins from. It is kept in a cookie and not in the browser's own storage
// because the server sorts the page before it sends it: with the order kept
// where only a script could read it, a reader would be shown the page's own
// order first and watch it change, and the public pages need no scripting.
//
// Pressing a heading is a link, and a link followed from an email or a
// bookmark looks the same to the server as one pressed. The two are told apart
// by what the heading's link says beside the sorting: "keep" and the name of
// the list. The server then remembers the sorting, and sends the reader on to
// the same address without it, so that what the reader is left looking at is
// an address that can be linked to, and going back goes to the page before.
import type { FastifyReply, FastifyRequest } from "fastify";

import { aYear, keptByTheServer } from "./theme.js";

export const sortingCookie = "sorting";

// A link from another site can set this cookie, since pressing a heading is a
// GET and the cross-site check is for requests that change something
// (crossSite.ts). What it changes is the order a reader is shown lists of
// public tournaments in, which they put back with one press, so it is not
// refused.

/** What a page asks, beside the sorting of its lists, to have them remembered. */
export const keep = "keep";

/** What a page asks to have the sorting of a list forgotten. */
export const forget = "forget";

/**
 * One list that can be sorted: the name it is remembered under, the parts of
 * a page's address that sort it, and how they are written down when they sort
 * it in a way the page would honour.
 */
export interface Sortable {
  readonly name: string;
  readonly parameters: readonly string[];
  readonly writtenIn: (
    query: Readonly<Record<string, unknown>>,
  ) => string | undefined;
}

// A name is joined to its page's with a stop, which neither has in it, so that
// the lists of one page are never taken for another's.
const keyOf = (page: string, list: string): string => `${page}.${list}`;

const kept = (request: FastifyRequest): URLSearchParams => {
  // A cookie nobody can make sense of is a cookie that remembers nothing,
  // however it came to be: a reader's device is theirs to do what they like
  // with.
  try {
    return new URLSearchParams(request.cookies[sortingCookie] ?? "");
  } catch {
    return new URLSearchParams();
  }
};

/**
 * How each list of `page` was last sorted on the device `request` came from,
 * by the list's name, written as it was by the page. Whether what was written
 * is still a sorting the page honours is for the page to say, since a page
 * that stops offering a column should not be held to what it once offered.
 */
export const rememberedOf = (
  request: FastifyRequest,
  page: string,
): Readonly<Record<string, string | undefined>> => {
  const all = kept(request);
  const prefix = keyOf(page, "");
  return Object.fromEntries(
    [...all.entries()]
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, written]) => [key.slice(prefix.length), written]),
  );
};

const namesIn = (asked: unknown): readonly string[] => {
  const each = Array.isArray(asked) ? asked : [asked];
  return each
    .filter((one): one is string => typeof one === "string")
    .flatMap((one) => one.split(","))
    .filter((name) => name !== "");
};

/**
 * Remembers the sorting a reader pressed and forgets the one they put back,
 * when the address says either, and sends them on to the page without it.
 * Nothing is sent where the address says neither, for the page to be drawn.
 *
 * Only the lists the page has are heard: a name it does not have is not stored,
 * so that a cookie cannot be made to grow by an address. A sorting the page
 * would not honour is not remembered either, since the reader pressed nothing.
 */
export const settleWhatWasPressed = (
  request: FastifyRequest,
  reply: FastifyReply,
  page: string,
  lists: readonly Sortable[],
): FastifyReply | undefined => {
  const query = (request.query ?? {}) as Readonly<Record<string, unknown>>;
  const toKeep = namesIn(query[keep]);
  const toForget = namesIn(query[forget]);
  if (toKeep.length === 0 && toForget.length === 0) return undefined;

  const now = kept(request);
  for (const list of lists) {
    const key = keyOf(page, list.name);
    if (toForget.includes(list.name)) {
      now.delete(key);
    } else if (toKeep.includes(list.name)) {
      const written = list.writtenIn(query);
      if (written !== undefined) now.set(key, written);
    }
  }
  if (now.size === 0) reply.clearCookie(sortingCookie, keptByTheServer);
  else
    reply.setCookie(sortingCookie, now.toString(), {
      ...keptByTheServer,
      maxAge: aYear,
    });

  // What is left of the address: the reader's other choices as they were, and
  // for a list put back, nothing that sorted it.
  const [asked = "/", said = ""] = request.url.split("?");
  // A path starting with two slashes would be taken for another site's address
  // by a browser following the redirect, so it is never sent on as it is.
  const path = asked.startsWith("//") ? `/${asked.replace(/^\/+/, "")}` : asked;
  const left = new URLSearchParams(said);
  left.delete(keep);
  left.delete(forget);
  for (const list of lists) {
    if (toForget.includes(list.name)) {
      for (const parameter of list.parameters) left.delete(parameter);
    }
  }
  const rest = left.toString();
  return reply
    .header("cache-control", "private, no-store")
    .redirect(rest === "" ? path : `${path}?${rest}`, 303);
};
