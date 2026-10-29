// What the routes that send a reader to another service to sign in, and take
// them back, have in common (google.ts, facebook.ts). Here so that a fix to one
// is a fix to both: the address the service is told to send the reader back to,
// where a reader the service did not let in is brought back to, and what is
// said of a way back this site did not send the reader on.
import type { FastifyReply, FastifyRequest } from "fastify";

import { Website } from "../../domain/common/Website.js";
import { servedAsOf } from "../common/site.js";
import type { SentFrom } from "../public/googleOffer.js";
import { registerPath } from "../public/register.js";
import { signInPath } from "../public/signIn.js";

/**
 * The website's own address with `callbackPath`, which the service is told to
 * send the reader back to. Development is the exception: it is reached on
 * whatever port is free, so the address the reader asked by is the truth, as it
 * is on a machine nothing sits in front of.
 */
export const redirectUriFor = (
  request: FastifyRequest,
  callbackPath: string,
): string => {
  const website = servedAsOf(request);
  const address = website.equals(Website.development)
    ? `${request.protocol}://${request.host}`
    : website.address;
  return `${address}${callbackPath}`;
};

/** Which page sent the reader, and where they go once signed in. */
export interface SentOn {
  readonly sentFrom: SentFrom;
  readonly goBack: string;
}

/**
 * Back to the page that sent the reader. The sign in page is told again where
 * the reader was going back to, so that signing in with a password from there
 * still goes there.
 */
export const backToWhereSent = (
  reply: FastifyReply,
  sent: SentOn,
  refused?: string,
): FastifyReply => {
  const said: string[] = [];
  if (refused !== undefined)
    said.push(`refused=${encodeURIComponent(refused)}`);
  if (sent.sentFrom === "sign-in") {
    said.push(`return=${encodeURIComponent(sent.goBack)}`);
  }
  const page = sent.sentFrom === "sign-in" ? signInPath : registerPath;
  return reply.redirect(
    said.length === 0 ? page : `${page}?${said.join("&")}`,
    303,
  );
};

/**
 * A way to the service that names no page is the register page's, which
 * offered it before the sign in page did and still sends it so.
 */
export const sentFromOf = (given: unknown): SentFrom =>
  given === "sign-in" ? "sign-in" : "register";

/**
 * A way back that is not taken is answered as a request that could not be dealt
 * with, and signs nobody in: there is nothing a reader can be told that would
 * help, and nothing a forger should be told at all.
 */
export const notSentFromHere = (service: string): never => {
  throw Object.assign(
    new Error(
      `A way back from ${service} this site did not send the reader on.`,
    ),
    { statusCode: 400, code: `${service}.NotSentFromHere` },
  );
};
