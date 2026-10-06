// Which of a tournament's notes and commentaries a reader has read, as each
// was when they read it, kept in their browser rather than by their account:
// most readers never sign in, and what is new to a player is new on the phone
// in their hand (notes.feature, commentaries.feature). A note or a commentary
// is read once its page is opened (note.ts, commentary.ts), and is new again
// once it changes, since what was read is no longer all it says.
//
// Each kind is kept in a cookie of its own, holding a short entry for each
// thing read: the first twelve hex digits of its id, which tell one from
// another as surely as a reader needs, and when it last changed, in
// milliseconds written in base 36. A browser keeps no more than about 4,000
// characters of a cookie, so only the most recently read are kept: one read
// so long ago that it was forgotten is marked as new again, which is no harm.
import type { FastifyReply, FastifyRequest } from "fastify";

import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/** Something a reader reads: a note or a commentary, as a page knows it. */
export interface Readable {
  /** Its id, as "manager-note/0d1e2f3a-…" or "commentary/0d1e2f3a-…". */
  readonly id: string;
  readonly changedAt: ReadOnlyDate;
}

/** What a reader has read of one kind, as each was when they read it. */
export interface Read {
  readonly cookie: string;
  readonly entries: readonly string[];
}

/** What a reader has read of each kind a tournament's pages mark. */
export interface Reads {
  readonly notes: Read;
  readonly commentaries: Read;
}

const notesCookie = "notes-read";
const commentariesCookie = "commentaries-read";

// Each entry is at most 21 characters with its separator, so this many is a
// little over 3,000 of them.
const MOST_REMEMBERED = 150;

const SEPARATOR = "~";

// An entry as this writes one. Anything else in the cookie is not, and is
// left out rather than trusted.
const anEntry = /^[0-9a-f]{12}\.[0-9a-z]{1,11}$/;

const aYear = 60 * 60 * 24 * 365;

const keyOf = (id: string): string =>
  id
    .slice(id.indexOf("/") + 1)
    .replaceAll("-", "")
    .slice(0, 12);

const entryOf = (read: Readable): string =>
  `${keyOf(read.id)}.${read.changedAt.toDate().getTime().toString(36)}`;

const readOf = (request: FastifyRequest, cookie: string): Read => ({
  cookie,
  entries: (request.cookies[cookie] ?? "")
    .split(SEPARATOR)
    .filter((entry) => anEntry.test(entry)),
});

/** What the reader's browser says they have read of notes. */
export const notesReadOf = (request: FastifyRequest): Read =>
  readOf(request, notesCookie);

/** What the reader's browser says they have read of commentaries. */
export const commentariesReadOf = (request: FastifyRequest): Read =>
  readOf(request, commentariesCookie);

/** What the reader's browser says they have read of every kind. */
export const readsOf = (request: FastifyRequest): Reads => ({
  notes: notesReadOf(request),
  commentaries: commentariesReadOf(request),
});

/** Whether the reader has read `thing` as it is now. */
export const hasRead = (read: Read, thing: Readable): boolean =>
  read.entries.includes(entryOf(thing));

/** Whether any of `things` is one the reader has not read as it is now. */
export const anyUnread = (read: Read, things: readonly Readable[]): boolean =>
  things.some((thing) => !hasRead(read, thing));

/**
 * That the reader has read `thing` as it is now, kept in their browser along
 * with what they had read before of its kind, its earlier entry, if it had
 * one, taken out.
 */
export const rememberRead = (
  reply: FastifyReply,
  read: Read,
  thing: Readable,
): Read => {
  const key = `${keyOf(thing.id)}.`;
  const entries = [
    ...read.entries.filter((entry) => !entry.startsWith(key)),
    entryOf(thing),
  ].slice(-MOST_REMEMBERED);
  reply.setCookie(read.cookie, entries.join(SEPARATOR), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // Always, for the reason the theme's cookie is (theme.ts).
    secure: true,
    maxAge: aYear,
  });
  return { cookie: read.cookie, entries };
};
