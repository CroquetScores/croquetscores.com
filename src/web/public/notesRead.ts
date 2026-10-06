// Which of the tournaments' notes a reader has read, as each was when they
// read it, kept in their browser rather than by their account: most readers
// never sign in, and what is new to a player is new on the phone in their
// hand (notes.feature). A note is read once its page is opened (note.ts), and
// is new again once it is edited, since what was read is no longer what it
// says.
//
// The cookie holds a short entry for each note read: the first twelve hex
// digits of its id, which tell one note from another as surely as a reader
// needs, and when it last changed, in milliseconds written in base 36. A
// browser keeps no more than about 4,000 characters of a cookie, so only the
// most recently read are kept: one read so long ago that it was forgotten is
// marked as new again, which is no harm.
import type { FastifyReply, FastifyRequest } from "fastify";

import type { ManagerNoteChanged } from "../../application/operations/tournaments/tournamentForReaders.js";

export const notesReadCookie = "notes-read";

// Each entry is at most 21 characters with its separator, so this many is a
// little over 3,000 of them.
const MOST_REMEMBERED = 150;

const SEPARATOR = "~";

// An entry as this writes one. Anything else in the cookie is not, and is
// left out rather than trusted.
const anEntry = /^[0-9a-f]{12}\.[0-9a-z]{1,11}$/;

const aYear = 60 * 60 * 24 * 365;

/** Which notes a reader has read, as each was when they read it. */
export interface NotesRead {
  readonly entries: readonly string[];
}

const keyOf = (id: string): string =>
  id
    .slice(id.indexOf("/") + 1)
    .replaceAll("-", "")
    .slice(0, 12);

const entryOf = (note: ManagerNoteChanged): string =>
  `${keyOf(note.id)}.${note.changedAt.toDate().getTime().toString(36)}`;

/** What the reader's browser says they have read. */
export const notesReadOf = (request: FastifyRequest): NotesRead => ({
  entries: (request.cookies[notesReadCookie] ?? "")
    .split(SEPARATOR)
    .filter((entry) => anEntry.test(entry)),
});

/** Whether the reader has read `note` as it is now. */
export const hasRead = (read: NotesRead, note: ManagerNoteChanged): boolean =>
  read.entries.includes(entryOf(note));

/** Whether any of `notes` is one the reader has not read as it is now. */
export const anyUnread = (
  read: NotesRead,
  notes: readonly ManagerNoteChanged[],
): boolean => notes.some((note) => !hasRead(read, note));

/**
 * That the reader has read `note` as it is now, kept in their browser along
 * with what they had read before, the note's earlier entry, if it had one,
 * taken out.
 */
export const rememberRead = (
  reply: FastifyReply,
  read: NotesRead,
  note: ManagerNoteChanged,
): NotesRead => {
  const key = `${keyOf(note.id)}.`;
  const entries = [
    ...read.entries.filter((entry) => !entry.startsWith(key)),
    entryOf(note),
  ].slice(-MOST_REMEMBERED);
  reply.setCookie(notesReadCookie, entries.join(SEPARATOR), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // Always, for the reason the theme's cookie is (theme.ts).
    secure: true,
    maxAge: aYear,
  });
  return { entries };
};
