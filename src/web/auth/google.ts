// Registering and signing in with Google: sending the reader there, and taking
// them back.
//
// The way back is a request anybody can make, and a page elsewhere could send
// a reader's browser along it carrying a code of its own choosing, leaving the
// reader signed in to somebody else's account without knowing it. So the way
// back is taken only from a browser this site sent to Google a moment ago:
// sending it there leaves a cookie, signed with the site's secret, holding the
// state it was sent with, the nonce Google must put in its token, and the PKCE
// verifier; the way back must carry the same state, and uses the cookie up.
// A way back with no cookie, another state, or one followed a second time
// signs nobody in.
//
// The cookie also holds which page sent the reader, the register page or the
// sign in page, and so which one a reader Google did not let in is brought
// back to, and where a reader signed in goes next. It is kept in the cookie
// rather than in the address Google is told to come back to, because that
// address has to be the one Google was given beforehand, and because what is
// in the signed cookie is what this site put there.
import { createHash, randomBytes } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { SignInWithGoogle } from "../../application/operations/accounts/SignInWithGoogle.js";
import { SignInWithGoogleRefused } from "../../application/operations/accounts/SignInWithGoogleHandler.js";
import type { Sessions } from "../../application/services/Sessions.js";
import type { InTransaction } from "../common/database.js";
import { startSession } from "../common/session.js";
import { googlePath, type SentFrom } from "../public/googleOffer.js";
import { registerPath } from "../public/register.js";
import { goBackTo, signInPath } from "../public/signIn.js";

const callbackPath = `${googlePath}/callback`;

/**
 * Where a reader who registered with Google is taken. A reader who signed in
 * with Google goes back where the sign in page would have sent them instead.
 */
const landing = "/admin/";

/** Who Google says the reader is. */
export interface GoogleIdentity {
  readonly subject: string;
  readonly emailAddress: string;
  readonly emailAddressVerified: boolean;
  readonly name: string | undefined;
}

/** Google could not be asked, so nobody can say who the reader is. */
export class GoogleUnreachable extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleUnreachable";
  }
}

/** What these routes want of Google. */
export interface GoogleSignIn {
  whereToSend(asking: {
    readonly redirectUri: string;
    readonly state: string;
    readonly nonce: string;
    readonly codeChallenge: string;
  }): string;

  /**
   * Who came back with `code`. Throws `GoogleUnreachable` when Google could not
   * be asked, and anything else when its answer was not to be believed.
   */
  whoCameBack(returned: {
    readonly code: string;
    readonly codeVerifier: string;
    readonly redirectUri: string;
    readonly nonce: string;
  }): Promise<GoogleIdentity>;
}

export interface GoogleRoutesOptions {
  readonly google: GoogleSignIn;
  readonly sessions: Sessions;
  readonly inTransaction: InTransaction;
  /**
   * The site's own address, where it has been given one, which Google is told
   * to send the reader back to. Where it has none — development, and the
   * scenarios — the address the reader asked by is used, as it is the truth on
   * a machine nothing sits in front of.
   */
  readonly siteAddress: string | undefined;
}

const pendingCookie = "google-sign-in";

/** How long a reader has at Google before the way back stops being taken. */
const PENDING_SECONDS = 10 * 60;

interface Pending {
  readonly state: string;
  readonly nonce: string;
  readonly codeVerifier: string;
  readonly sentFrom: SentFrom;
  /** Where the reader goes once signed in, already judged safe to go to. */
  readonly goBack: string;
  /** When the reader was sent, in milliseconds, for the cookie not to outlive. */
  readonly sentAt: number;
}

const aSecret = (): string => randomBytes(32).toString("base64url");

const challengeOf = (verifier: string): string =>
  createHash("sha256").update(verifier).digest("base64url");

const cookieOptions = {
  path: googlePath,
  httpOnly: true,
  // Lax, so that the cookie comes back with Google sending the reader here,
  // which is a navigation from another site; Strict would leave it behind.
  sameSite: "lax",
  secure: true,
  signed: true,
} as const;

const pendingFrom = (request: FastifyRequest): Pending | undefined => {
  const kept = request.cookies[pendingCookie];
  if (kept === undefined) return undefined;
  const unsigned = request.unsignCookie(kept);
  if (!unsigned.valid || unsigned.value === null) return undefined;
  try {
    const pending = JSON.parse(unsigned.value) as Partial<Pending>;
    if (
      typeof pending.state !== "string" ||
      typeof pending.nonce !== "string" ||
      typeof pending.codeVerifier !== "string" ||
      (pending.sentFrom !== "register" && pending.sentFrom !== "sign-in") ||
      typeof pending.goBack !== "string" ||
      typeof pending.sentAt !== "number"
    ) {
      return undefined;
    }
    return pending as Pending;
  } catch {
    return undefined;
  }
};

// A way back that is not taken is answered as a request that could not be dealt
// with, and signs nobody in: there is nothing a reader can be told that would
// help, and nothing a forger should be told at all.
const notSentFromHere = (): never => {
  throw Object.assign(
    new Error("A way back from Google this site did not send the reader on."),
    { statusCode: 400, code: "Google.NotSentFromHere" },
  );
};

// Back to the page that sent the reader. The sign in page is told again where
// the reader was going back to, so that signing in with a password from there
// still goes there.
const backToWhereSent = (
  reply: FastifyReply,
  pending: Pending,
  refused?: string,
): FastifyReply => {
  const said: string[] = [];
  if (refused !== undefined)
    said.push(`refused=${encodeURIComponent(refused)}`);
  if (pending.sentFrom === "sign-in") {
    said.push(`return=${encodeURIComponent(pending.goBack)}`);
  }
  const page = pending.sentFrom === "sign-in" ? signInPath : registerPath;
  return reply.redirect(
    said.length === 0 ? page : `${page}?${said.join("&")}`,
    303,
  );
};

// A way to Google that names no page is the register page's, which offered it
// before the sign in page did and still sends it so.
const sentFromOf = (given: unknown): SentFrom =>
  given === "sign-in" ? "sign-in" : "register";

export const registerGoogleRoutes = (
  server: FastifyInstance,
  options: GoogleRoutesOptions,
): void => {
  const redirectUriFor = (request: FastifyRequest): string =>
    `${options.siteAddress ?? `${request.protocol}://${request.host}`}${callbackPath}`;

  server.get<{ Querystring: { from?: string; return?: string } }>(
    googlePath,
    (request, reply) => {
      const sentFrom = sentFromOf(request.query.from);
      const pending: Pending = {
        state: aSecret(),
        nonce: aSecret(),
        codeVerifier: aSecret(),
        sentFrom,
        // Judged by the sign in page's own rule, so that which page is gone back
        // to does not depend on which way the reader came in.
        goBack:
          sentFrom === "sign-in" ? goBackTo(request.query.return) : landing,
        sentAt: Date.now(),
      };
      reply.setCookie(pendingCookie, JSON.stringify(pending), {
        ...cookieOptions,
        maxAge: PENDING_SECONDS,
      });
      return reply.redirect(
        options.google.whereToSend({
          redirectUri: redirectUriFor(request),
          state: pending.state,
          nonce: pending.nonce,
          codeChallenge: challengeOf(pending.codeVerifier),
        }),
        303,
      );
    },
  );

  server.get<{
    Querystring: { state?: string; code?: string; error?: string };
  }>(callbackPath, async (request, reply) => {
    const pending = pendingFrom(request);
    // Used up whatever comes of it, so that the same way back followed again
    // finds nothing to be taken with.
    reply.clearCookie(pendingCookie, { path: googlePath });

    const { state, code, error } = request.query;
    if (
      pending === undefined ||
      Date.now() - pending.sentAt > PENDING_SECONDS * 1000 ||
      typeof state !== "string" ||
      state !== pending.state
    ) {
      return notSentFromHere();
    }

    // The reader said no to Google, or Google said no to them. Either way they
    // chose not to come in by Google, and are brought back to the page they
    // came from to come in the other way; there is nothing to tell them they
    // do not know.
    if (error !== undefined || typeof code !== "string" || code === "") {
      return backToWhereSent(reply, pending);
    }

    let identity: GoogleIdentity;
    try {
      identity = await options.google.whoCameBack({
        code,
        codeVerifier: pending.codeVerifier,
        redirectUri: redirectUriFor(request),
        nonce: pending.nonce,
      });
    } catch (failure) {
      if (failure instanceof GoogleUnreachable) {
        request.log.warn({ err: failure }, "Google could not be reached");
        return backToWhereSent(reply, pending, "Google.Unreachable");
      }
      throw failure;
    }

    let account;
    try {
      account = await request.server.mediator.send(
        new SignInWithGoogle(
          identity.subject,
          identity.emailAddress,
          identity.emailAddressVerified,
          identity.name,
          request.requestedAt,
        ),
      );
    } catch (failure) {
      if (!(failure instanceof SignInWithGoogleRefused)) throw failure;
      return backToWhereSent(reply, pending, failure.code);
    }

    await options.inTransaction(() =>
      startSession(request, reply, options.sessions, account),
    );
    return reply.redirect(pending.goBack, 303);
  });
};
