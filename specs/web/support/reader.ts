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
// over a database of its own, and signs in for real. So does one that says a
// reader is signed in to an account with no password, which can only be
// signed in to with Google: it signs in with Google, as its reader would.
import type { FastifyRequest } from "fastify";

import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import type { Reader } from "../../../src/web/common/reader.js";
import { googleSaysFor } from "../../support/google.js";
import type { SpecWorld } from "../../support/world.js";
import { calledByGoogle, googleSubjectOf } from "./accounts.js";

const cookie = "spec-signed-in-as";
// Set beside it for a reader whose account has no password, which the menu
// asks as well as whether anybody is signed in.
const noPassword = "spec-has-no-password";

// The addresses a scenario says have no password, so that signing in as one
// says so too.
const withoutPasswords = new WeakMap<SpecWorld, Set<string>>();

/** Says that the account for `address` has no password. */
export const hasNoPassword = (world: SpecWorld, address: string): void => {
  const addresses = withoutPasswords.get(world) ?? new Set<string>();
  addresses.add(address);
  withoutPasswords.set(world, addresses);
};

// An account of its own for the scenario's reader, since a scenario that has
// no database has no account either: what the menu asks is whether anybody is
// signed in, and this says so without there being anyone.
const somebody = AccountId.create();

/** What the scenarios' application is given: a reader the scenarios set. */
export const readerTheScenariosSet: Reader = (request: FastifyRequest) =>
  (request.cookies[cookie] ?? "") === ""
    ? undefined
    : {
        account: somebody,
        hasPassword: (request.cookies[noPassword] ?? "") === "",
      };

/** Has this scenario's browser ask as a reader signed in as `address`. */
export const signInAs = async (
  world: SpecWorld,
  address: string,
): Promise<void> => {
  const context = world.browserContext;
  if (context === undefined) throw new Error("This scenario has no browser.");
  if (world.pool !== undefined) {
    await signInWithGoogleAs(world, address);
    return;
  }
  const url = new URL(world.baseUrl ?? "http://127.0.0.1");
  await context.addCookies([
    { name: cookie, value: address, domain: url.hostname, path: "/" },
  ]);
  if (withoutPasswords.get(world)?.has(address) === true) {
    await context.addCookies([
      { name: noPassword, value: "yes", domain: url.hostname, path: "/" },
    ]);
  }
};

// Straight to the way to Google, with the stand-in saying who the reader is
// as it said when the account was made, and followed back to wherever the
// site sends a reader who has signed in.
const signInWithGoogleAs = async (
  world: SpecWorld,
  address: string,
): Promise<void> => {
  const says = googleSaysFor(world);
  says.subject = googleSubjectOf(address);
  says.emailAddress = address;
  says.verified = true;
  says.name = calledByGoogle;
  await world.browserPage.goto(`${world.baseUrl!}/auth/google?from=sign-in`);
  // What the page it landed on asks for itself renews the session cookie, and
  // must be done before the scenario goes on.
  await world.browserPage.waitForLoadState("networkidle");
};

/**
 * Has this scenario's browser ask as a reader who is signed in to nothing:
 * neither this cookie nor a real session's, since a scenario with a database
 * of its own signs in for real, and a reader who is signed in to nothing holds
 * neither.
 */
export const signOutOf = async (world: SpecWorld): Promise<void> => {
  const context = world.browserContext;
  if (context === undefined) throw new Error("This scenario has no browser.");
  await context.clearCookies({ name: cookie });
  await context.clearCookies({ name: noPassword });
  await context.clearCookies({ name: "session" });
};
