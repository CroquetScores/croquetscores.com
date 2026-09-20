// How a scenario says that its reader is signed in, until sessions are built.
//
// The application is given what says whether a request's reader is signed in
// (src/web/common/reader.ts). Production is given nothing and nobody is signed
// in; the scenarios are given this, which reads a cookie of their own. It is a
// cookie rather than a field because one application serves every @browser
// scenario, each in a browser context of its own: a field would be one answer
// shared by all of them, and two scenarios running in turn would each see the
// other's reader.
//
// Nothing in src reads this cookie. When session.feature is built, the
// application will be given something that reads the session cookie instead,
// and this goes.
import type { FastifyRequest } from "fastify";

import type { Reader } from "../../../src/web/common/reader.js";
import type { SpecWorld } from "../../support/world.js";

const cookie = "spec-signed-in-as";

/** What the scenarios' application is given: a reader the scenarios set. */
export const readerTheScenariosSet: Reader = (request: FastifyRequest) =>
  (request.cookies[cookie] ?? "") !== "";

/** Has this scenario's browser ask as a reader signed in as `address`. */
export const signInAs = async (
  world: SpecWorld,
  address: string,
): Promise<void> => {
  const context = world.browserContext;
  if (context === undefined) throw new Error("This scenario has no browser.");
  const url = new URL(world.baseUrl ?? "http://127.0.0.1");
  await context.addCookies([
    { name: cookie, value: address, domain: url.hostname, path: "/" },
  ]);
};

/** Has this scenario's browser ask as a reader who is signed in to nothing. */
export const signOutOf = async (world: SpecWorld): Promise<void> => {
  const context = world.browserContext;
  if (context === undefined) throw new Error("This scenario has no browser.");
  await context.clearCookies({ name: cookie });
};
