// Whether the reader of a request is signed in, which the account menu asks so
// that it can offer the ways in or the account's own pages.
//
// Nothing signs anybody in yet: sessions are specified in session.feature and
// not built, so the application is started without a way of telling and every
// reader is a reader who is not signed in. The way of telling is given to the
// application rather than found here, so that the scenarios about a reader who
// is signed in have something to say it with, and so that when sessions arrive
// there is one place that changes: what is handed in here reads the session
// cookie instead, and everything asking goes on asking the same question.
import type { FastifyInstance, FastifyRequest } from "fastify";

/** What says whether the reader of a request is signed in. */
export type Reader = (request: FastifyRequest) => boolean;

declare module "fastify" {
  interface FastifyRequest {
    /** Whether whoever is asking is signed in. Read it through signedIn. */
    readonly readerIsSignedIn: boolean;
  }
}

/** Has every request say whether its reader is signed in, as `reader` decides. */
export const knowTheReader = (
  server: FastifyInstance,
  reader: Reader,
): void => {
  server.decorateRequest("readerIsSignedIn", false);
  server.addHook("onRequest", (request, _reply, done) => {
    (request as { readerIsSignedIn: boolean }).readerIsSignedIn =
      reader(request);
    done();
  });
};

/** Whether the reader of `request` is signed in. */
export const signedIn = (request: FastifyRequest): boolean =>
  request.readerIsSignedIn;

/** Nobody is signed in, which is so until sessions are built. */
export const nobodySignedIn: Reader = () => false;
