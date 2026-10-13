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

import { DatabaseUnreachable } from "../../application/common/DatabaseUnreachable.js";
import type { AccountId } from "../../domain/aggregates/accounts/AccountId.js";

/**
 * The account a reader is signed in to, whether it has a password, and
 * whether it holds the Administrator role. The account menu asks the second on
 * every page, since what it offers a reader whose account has none leaves out
 * every page that asks for one; the administrator's pages ask the third.
 */
export interface SignedInReader {
  readonly account: AccountId;
  readonly hasPassword: boolean;
  readonly isAdministrator: boolean;
}

/**
 * What says which account the reader of a request is signed in to, if any. It
 * is given the reply as well as the request, because reading a session is
 * using one: what says so may want to say it back to the browser.
 */
export type Reader = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<SignedInReader | undefined> | SignedInReader | undefined;

declare module "fastify" {
  interface FastifyRequest {
    /** Which account is asking, if any. Read it through readerOf or signedIn. */
    readonly readerAccount: AccountId | undefined;
    /** Whether that account has a password. Read it through hasPassword. */
    readonly readerHasPassword: boolean;
    /** Whether that account is an administrator. Read it through isAdministrator. */
    readonly readerIsAdministrator: boolean;
    /** Whether finding out who is asking failed. Read it through readerKnown. */
    readonly readerUnknown: boolean;
  }
}

/** Has every request say who its reader is, as `reader` decides. */
export const knowTheReader = (
  server: FastifyInstance,
  reader: Reader,
): void => {
  server.decorateRequest("readerAccount", undefined);
  server.decorateRequest("readerHasPassword", false);
  server.decorateRequest("readerIsAdministrator", false);
  server.decorateRequest("readerUnknown", false);
  server.addHook("onRequest", async (request, reply) => {
    let found: SignedInReader | undefined;
    try {
      found = await reader(request, reply);
    } catch (failure) {
      // Sessions are in the database, so a database that cannot be reached
      // leaves the site not knowing who is asking, which is not the same as
      // nobody. The failure goes on to be answered as it would be anywhere
      // else; what is kept is that the answer must not say either way.
      if (failure instanceof DatabaseUnreachable) {
        (request as { readerUnknown: boolean }).readerUnknown = true;
      }
      throw failure;
    }
    const told = request as {
      readerAccount: AccountId | undefined;
      readerHasPassword: boolean;
      readerIsAdministrator: boolean;
    };
    told.readerAccount = found?.account;
    told.readerHasPassword = found?.hasPassword ?? false;
    told.readerIsAdministrator = found?.isAdministrator ?? false;
  });
};

/** The account `request` is signed in to, or nothing. */
export const readerOf = (request: FastifyRequest): AccountId | undefined =>
  request.readerAccount;

/**
 * Whether the account the reader of `request` is signed in to has a password.
 * Nobody signed in has none.
 */
export const hasPassword = (request: FastifyRequest): boolean =>
  request.readerHasPassword;

/**
 * Whether the account the reader of `request` is signed in to holds the
 * Administrator role. Nobody signed in holds none.
 */
export const isAdministrator = (request: FastifyRequest): boolean =>
  request.readerIsAdministrator;

/**
 * Whether the site found out who is asking. False only where it tried and the
 * database could not be reached; a request with no session is a reader known
 * to be nobody.
 */
export const readerKnown = (request: FastifyRequest): boolean =>
  !request.readerUnknown;

/** Whether the reader of `request` is signed in to anything. */
export const signedIn = (request: FastifyRequest): boolean =>
  request.readerAccount !== undefined;

/** Nobody is signed in, which is so wherever there is nothing to tell by. */
export const nobodySignedIn: Reader = () => undefined;
