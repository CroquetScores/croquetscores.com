// How a scenario with no database of its own says that its reader is signed in.
//
// The application is given what says who a request's reader is
// (src/web/common/reader.ts). In life that reads the session cookie; a
// scenario that keeps no sessions is given this instead, which reads a cookie
// of its own. It is a cookie rather than a field because one application
// serves every @browser scenario without a database, each in a browser context
// of its own: a field would be one answer shared by all of them, and two
// scenarios running in turn would each see the other's reader.
//
// Nothing in src reads this cookie. A scenario that is about signing in, or
// about staying signed in, is tagged @postgres as well, gets an application
// over a database of its own, and signs in for real.
import type { FastifyRequest } from "fastify";

import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import type { Reader } from "../../../src/web/common/reader.js";
import type { SpecWorld } from "../../support/world.js";

const cookie = "spec-signed-in-as";

// An account of its own for the scenario's reader, since a scenario that has
// no database has no account either: what the menu asks is whether anybody is
// signed in, and this says so without there being anyone.
const somebody = AccountId.create();

/** What the scenarios' application is given: a reader the scenarios set. */
export const readerTheScenariosSet: Reader = (request: FastifyRequest) =>
  (request.cookies[cookie] ?? "") === "" ? undefined : somebody;

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
