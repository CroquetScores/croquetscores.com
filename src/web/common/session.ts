// How a reader stays signed in between one page and the next.
//
// Signing in starts a session: a cookie holding an id that means nothing by
// itself, and a row kept against the account with a hash of that id (the
// hashing and the keeping are the session store's). The cookie is HttpOnly,
// Secure and SameSite=Lax, for the reasons the theme's cookie is, and is given
// the session's own 90 days each time it is set, so that it outlives closing
// the browser and goes when the session does.
//
// Every signing in starts a new session with a new id, and carries on nothing
// the browser already held: an id planted in a reader's browser before they
// signed in would otherwise be shared with whoever planted it.
//
// Signing out ends the session of the browser it is asked from and no other,
// and its row is deleted, so a copy of the cookie taken beforehand stops
// working too. It is asked for by a form posted to /account/sign-out rather
// than by a link, so that another site cannot sign a reader out by putting the
// link in an image.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type { Sessions } from "../../application/services/Sessions.js";
import type { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import { signOutPath } from "./accountMenu.js";
import { assetsPath } from "./assets.js";
import type { InTransaction } from "./database.js";

export const sessionCookie = "session";

/** How long a session lasts from its last use, which its cookie is given too. */
const LASTS_SECONDS = 90 * 24 * 60 * 60;

const options = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  // Always, rather than worked out from the request, for the reason the
  // theme's cookie says.
  secure: true,
  maxAge: LASTS_SECONDS,
} as const;

/**
 * Whoever the session cookie on `request` signs in, if anybody.
 *
 * A request carrying no session costs nothing: there is nothing to look up, so
 * no connection is taken and no transaction begun. One that does is looked up
 * in a transaction of its own, as every other read is.
 *
 * A session found is given its 90 days again, in the table and in the cookie
 * alike, so that a reader who keeps coming back is never asked to sign in
 * again. The cookie has to be set afresh for that: a browser counts a
 * cookie's life from when it was given it, and would otherwise drop it 90 days
 * after signing in however often its reader came back.
 *
 * A request for one of the site's own files is not asked at all. Nothing under
 * /assets/ is drawn for a reader, so there is nothing there to know — and the
 * answer is sent as public and kept for a year, so renewing the cookie on it
 * would hang a reader's session id on a reply that a cache between the site
 * and its readers is invited to hand to somebody else.
 */
export const readerFromSessions =
  (sessions: Sessions, inTransaction: InTransaction) =>
  async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<AccountId | undefined> => {
    if (request.url.startsWith(assetsPath)) return undefined;

    const id = request.cookies[sessionCookie];
    if (id === undefined || id === "") return undefined;

    const account = await inTransaction(() =>
      sessions.readerOf(id, request.requestedAt),
    );
    if (account !== undefined) reply.setCookie(sessionCookie, id, options);
    return account;
  };

/**
 * Starts a session for `account` and has `reply` keep it. The browser is given
 * a new id whatever it held: nothing of an earlier session is carried on.
 */
export const startSession = async (
  request: FastifyRequest,
  reply: FastifyReply,
  sessions: Sessions,
  account: AccountId,
): Promise<void> => {
  const id = await sessions.start(account, request.requestedAt);
  reply.setCookie(sessionCookie, id, options);
};

/** Ends the session `request` came with, and takes its cookie away. */
export const endSession = async (
  request: FastifyRequest,
  reply: FastifyReply,
  sessions: Sessions,
): Promise<void> => {
  const id = request.cookies[sessionCookie];
  if (id !== undefined && id !== "") await sessions.end(id);
  reply.clearCookie(sessionCookie, { path: "/" });
};

/**
 * Signing out, from the form the account menu draws. It answers with the home
 * page rather than the page the reader was on: a page they could see signed in
 * may not be one they can see signed out.
 */
export const registerSignOut = (
  server: FastifyInstance,
  sessions: Sessions,
  inTransaction: InTransaction,
): void => {
  server.post(signOutPath, async (request, reply) => {
    await inTransaction(() => endSession(request, reply, sessions));
    return reply.redirect("/", 303);
  });
};
