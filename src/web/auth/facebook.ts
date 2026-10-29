// Registering and signing in with Facebook: sending the reader there, and
// taking them back. It does what Google's routes do (google.ts), for the same
// reasons, with what Facebook does differently.
//
// The way back is a request anybody can make, and a page elsewhere could send
// a reader's browser along it carrying a code of its own choosing, leaving the
// reader signed in to somebody else's account without knowing it. So the way
// back is taken only from a browser this site sent to Facebook a moment ago:
// sending it there leaves a cookie, signed with the site's secret, holding the
// state it was sent with; the way back must carry the same state, and uses the
// cookie up. A way back with no cookie, another state, or one followed a second
// time signs nobody in. Facebook has no nonce or PKCE verifier to add to the
// state, as Google has: the code is what ties its answer to this sign-in, and
// Facebook gives a token for it once, to this site, for this return address.
//
// The cookie also holds which page sent the reader, the register page or the
// sign in page, and so which one a reader Facebook did not let in is brought
// back to, and where a reader signed in goes next.
import { randomBytes } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { SignInWithFacebook } from "../../application/operations/accounts/SignInWithFacebook.js";
import { SignInWithFacebookRefused } from "../../application/operations/accounts/SignInWithFacebookHandler.js";
import type { Sessions } from "../../application/services/Sessions.js";
import { Website } from "../../domain/common/Website.js";
import type { InTransaction } from "../common/database.js";
import { startSession } from "../common/session.js";
import { servedAsOf } from "../common/site.js";
import { facebookPath } from "../public/facebookOffer.js";
import type { SentFrom } from "../public/googleOffer.js";
import { registerPath } from "../public/register.js";
import { notAgreed, termsOfUseField } from "../public/termsOfUse.js";
import { goBackTo, signInPath } from "../public/signIn.js";

const callbackPath = `${facebookPath}/callback`;

/**
 * Where a reader who registered with Facebook is taken. A reader who signed in
 * with Facebook goes back where the sign in page would have sent them instead.
 */
const landing = "/admin/";

/** Who Facebook says the reader is. */
export interface FacebookIdentity {
  readonly facebookId: string;
  readonly emailAddress: string | undefined;
  readonly name: string;
}

/** Facebook could not be asked, so nobody can say who the reader is. */
export class FacebookUnreachable extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FacebookUnreachable";
  }
}

/** What these routes want of Facebook. */
export interface FacebookSignIn {
  whereToSend(asking: {
    readonly redirectUri: string;
    readonly state: string;
  }): string;

  /**
   * Who came back with `code`. Throws `FacebookUnreachable` when Facebook could
   * not be asked, and anything else when its answer was not to be believed.
   */
  whoCameBack(returned: {
    readonly code: string;
    readonly redirectUri: string;
  }): Promise<FacebookIdentity>;
}

export interface FacebookRoutesOptions {
  readonly facebook: FacebookSignIn;
  readonly sessions: Sessions;
  readonly inTransaction: InTransaction;
}

const pendingCookie = "facebook-sign-in";

/** How long a reader has at Facebook before the way back stops being taken. */
const PENDING_SECONDS = 10 * 60;

interface Pending {
  readonly state: string;
  readonly sentFrom: SentFrom;
  /** Where the reader goes once signed in, already judged safe to go to. */
  readonly goBack: string;
  /** When the reader was sent, in milliseconds, for the cookie not to outlive. */
  readonly sentAt: number;
}

const aSecret = (): string => randomBytes(32).toString("base64url");

const cookieOptions = {
  path: facebookPath,
  httpOnly: true,
  // Lax, so that the cookie comes back with Facebook sending the reader here,
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
    new Error("A way back from Facebook this site did not send the reader on."),
    { statusCode: 400, code: "Facebook.NotSentFromHere" },
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

// A way to Facebook that names no page is the register page's, as it is for
// Google.
const sentFromOf = (given: unknown): SentFrom =>
  given === "sign-in" ? "sign-in" : "register";

export const registerFacebookRoutes = (
  server: FastifyInstance,
  options: FacebookRoutesOptions,
): void => {
  // The website's own address, which Facebook is told to send the reader back
  // to. Development is the exception: it is reached on whatever port is free,
  // so the address the reader asked by is the truth, as it is on a machine
  // nothing sits in front of.
  const redirectUriFor = (request: FastifyRequest): string => {
    const website = servedAsOf(request);
    const address = website.equals(Website.development)
      ? `${request.protocol}://${request.host}`
      : website.address;
    return `${address}${callbackPath}`;
  };

  server.get<{
    Querystring: { from?: string; return?: string; [termsOfUseField]?: string };
  }>(facebookPath, (request, reply) => {
    const sentFrom = sentFromOf(request.query.from);
    // Registering is agreeing to the terms of use for those who write, by
    // Facebook as by email address (register.ts). A reader sent from the
    // register page without the box ticked is brought back to tick it,
    // before Facebook is asked anything.
    if (
      sentFrom === "register" &&
      request.query[termsOfUseField] === undefined
    ) {
      return reply.redirect(
        `${registerPath}?refused=${encodeURIComponent(notAgreed.code)}`,
        303,
      );
    }
    const pending: Pending = {
      state: aSecret(),
      sentFrom,
      // Judged by the sign in page's own rule, so that which page is gone back
      // to does not depend on which way the reader came in.
      goBack: sentFrom === "sign-in" ? goBackTo(request.query.return) : landing,
      sentAt: Date.now(),
    };
    reply.setCookie(pendingCookie, JSON.stringify(pending), {
      ...cookieOptions,
      maxAge: PENDING_SECONDS,
    });
    return reply.redirect(
      options.facebook.whereToSend({
        redirectUri: redirectUriFor(request),
        state: pending.state,
      }),
      303,
    );
  });

  server.get<{
    Querystring: { state?: string; code?: string; error?: string };
  }>(callbackPath, async (request, reply) => {
    const pending = pendingFrom(request);
    // Used up whatever comes of it, so that the same way back followed again
    // finds nothing to be taken with.
    reply.clearCookie(pendingCookie, { path: facebookPath });

    const { state, code, error } = request.query;
    if (
      pending === undefined ||
      Date.now() - pending.sentAt > PENDING_SECONDS * 1000 ||
      typeof state !== "string" ||
      state !== pending.state
    ) {
      return notSentFromHere();
    }

    // The reader said no to Facebook, or Facebook said no to them. Either way
    // they chose not to come in by Facebook, and are brought back to the page
    // they came from to come in the other way; there is nothing to tell them
    // they do not know.
    if (error !== undefined || typeof code !== "string" || code === "") {
      return backToWhereSent(reply, pending);
    }

    let identity: FacebookIdentity;
    try {
      identity = await options.facebook.whoCameBack({
        code,
        redirectUri: redirectUriFor(request),
      });
    } catch (failure) {
      if (failure instanceof FacebookUnreachable) {
        request.log.warn({ err: failure }, "Facebook could not be reached");
        return backToWhereSent(reply, pending, "Facebook.Unreachable");
      }
      throw failure;
    }

    let account;
    try {
      account = await request.server.mediator.send(
        new SignInWithFacebook(
          identity.facebookId,
          identity.emailAddress,
          identity.name,
          request.requestedAt,
        ),
      );
    } catch (failure) {
      if (!(failure instanceof SignInWithFacebookRefused)) throw failure;
      return backToWhereSent(reply, pending, failure.code);
    }

    await options.inTransaction(() =>
      startSession(request, reply, options.sessions, account),
    );
    return reply.redirect(pending.goBack, 303);
  });
};
