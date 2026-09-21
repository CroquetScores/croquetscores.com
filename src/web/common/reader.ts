// Who the reader of a request is, which the account menu asks so that it can
// offer the ways in or the account's own pages, and which every page that is
// somebody's own asks before it shows anything.
//
// The way of telling is given to the application rather than found here. In
// life it reads the session cookie (session.ts); a scenario that has no
// database to keep sessions in hands in one of its own, and says with it that
// a reader is signed in without anybody having signed in.
//
// It is asked once, as a request arrives, so that a page asking twice asks the
// database once.
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";

/**
 * What says which account the reader of a request is signed in to, if any. It
 * is given the reply as well as the request, because reading a session is
 * using one: what says so may want to say it back to the browser.
 */
export type Reader = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<AccountId | undefined> | AccountId | undefined;

declare module "fastify" {
  interface FastifyRequest {
    /** Which account is asking, if any. Read it through readerOf or signedIn. */
    readonly readerAccount: AccountId | undefined;
  }
}

/** Has every request say who its reader is, as `reader` decides. */
export const knowTheReader = (
  server: FastifyInstance,
  reader: Reader,
): void => {
  server.decorateRequest("readerAccount", undefined);
  server.addHook("onRequest", async (request, reply) => {
    (request as { readerAccount: AccountId | undefined }).readerAccount =
      await reader(request, reply);
  });
};

/** The account `request` is signed in to, or nothing. */
export const readerOf = (request: FastifyRequest): AccountId | undefined =>
  request.readerAccount;

/** Whether the reader of `request` is signed in to anything. */
export const signedIn = (request: FastifyRequest): boolean =>
  request.readerAccount !== undefined;

/** Nobody is signed in, which is so wherever there is nothing to tell by. */
export const nobodySignedIn: Reader = () => undefined;
