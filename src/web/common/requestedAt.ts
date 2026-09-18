// Every command says when it was asked for, and nothing below the web layer
// reads a clock. So the moment is decided here, once, as a request arrives, and
// a route hands it to whatever it sends: request.requestedAt.
//
// Once, rather than wherever a route happens to make a command, because a
// request that sends two commands asked for both at the same moment, however
// long the first took. And as the request arrives, rather than when a route
// gets round to it, because that is when it was asked for.
//
// The clock answers with an instant, and the moment is held as one. Nothing
// here goes by way of the server's local time, so the time zone it is in has
// no bearing on what a request is stamped with.
import type { FastifyInstance } from "fastify";

import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/** What the server reads the time from. The machine's own, unless told otherwise. */
export type Clock = () => Date;

export const machineClock: Clock = () => new Date();

declare module "fastify" {
  interface FastifyRequest {
    /** The moment this request arrived. */
    readonly requestedAt: ReadOnlyDate;
  }
}

export const stampRequests = (server: FastifyInstance, clock: Clock): void => {
  // Declared up front so every request has the same shape, which is how
  // Fastify keeps them fast; the hook gives each its own moment. Null until
  // then, which the type does not admit because no route ever sees it: the
  // hook runs before any of them.
  server.decorateRequest("requestedAt", null as unknown as ReadOnlyDate);

  server.addHook("onRequest", (request, _reply, done) => {
    // The one place the moment is set. Readonly everywhere else, so that no
    // route can re-stamp a request halfway through it.
    (request as { requestedAt: ReadOnlyDate }).requestedAt =
      ReadOnlyDate.from(clock());
    done();
  });
};
