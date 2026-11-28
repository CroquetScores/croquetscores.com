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

import { SignInWithGoogle } from "../../../src/application/operations/accounts/SignInWithGoogle.js";
import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { Reader } from "../../../src/web/common/reader.js";
import { sessionCookie } from "../../../src/web/common/session.js";
import { googleSaysFor } from "../../support/google.js";
import type { SpecWorld } from "../../support/world.js";
import { calledByGoogle, googleSubjectOf } from "./accounts.js";
import { applicationFor } from "./browser.js";
import { clockFor } from "./clock.js";

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
        // A role is given to an account, and a scenario with no database has
        // none to give it to: one about an administrator signs in for real.
        isAdministrator: false,
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

/**
 * Has the scenario's browser hold a new session of `account`, started as the
 * site starts one, with its id in the cookie the site sets it in.
 *
 * The browser is taken out of the page it was on first. The site renews the
 * session cookie on every request that carries one, with the id the request
 * came with, so a request of the old page still under way when the new cookie
 * is added is answered with the old id, which then replaces the new one: a
 * scenario that signed in as a second reader after its background signed in as
 * a first came out as the first, one run in a few hundred. The browser is left
 * on a blank page, so a step that acts on the page in front of it has to open
 * one first.
 */
export const holdSessionOf = async (
  world: SpecWorld,
  account: AccountId,
): Promise<void> => {
  const application = applicationFor(world);
  const at = ReadOnlyDate.from(new Date(clockFor(world).now.getTime()));
  const context = world.browserPage.context();
  // The session the browser held is ended first, as the site ends it
  // (startSession in src/web/common/session.ts), so that a scenario signing in
  // as a second reader does not leave the first one's session worth something.
  const held = (await context.cookies()).find(
    (each) => each.name === sessionCookie,
  )?.value;
  const id = await application.unitOfWork.inTransaction(async () => {
    if (held !== undefined && held !== "") await application.sessions.end(held);
    return application.sessions.start(account, at);
  });
  await world.browserPage.goto("about:blank");
  // As the site sets it (src/web/common/session.ts), 90 days and all: a cookie
  // with no end is one a browser drops when it is closed. Counted from the
  // machine's clock, not the scenario's, because that is the clock the browser
  // counts it by.
  await context.addCookies([
    {
      name: sessionCookie,
      value: id,
      url: world.baseUrl!,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      expires: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60,
    },
  ]);
};

// Signed in with Google as the callback does it: the same command, so the
// account is made or found as signing in would, and then a session. The way
// there and back is not gone through, nor is the page it ends on loaded, which
// was most of what this step took and which the next step nearly always left at
// once by opening a page of its own. That the way works is what the scenarios
// of signing in with Google say. The stand-in is still told who Google says the
// reader is, as it was, for a later step that goes through it.
const signInWithGoogleAs = async (
  world: SpecWorld,
  address: string,
): Promise<void> => {
  const says = googleSaysFor(world);
  says.subject = googleSubjectOf(address);
  says.emailAddress = address;
  says.verified = true;
  says.name = calledByGoogle;
  const application = applicationFor(world);
  const account = await application.mediator.send(
    new SignInWithGoogle(
      says.subject,
      address,
      true,
      calledByGoogle,
      ReadOnlyDate.from(new Date(clockFor(world).now.getTime())),
    ),
  );
  await holdSessionOf(world, account);
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
