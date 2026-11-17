// A reader coming back, in a real browser, and a second browser standing in
// for another device.
//
// What a scenario asks of the session is asked of the browser and of the
// table: whether the browser is signed in is what its cookie is worth, and
// what is kept is looked at directly, since the whole point of keeping a hash
// is that what is kept is not what is sent.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { BrowserContext, Cookie } from "playwright";

import type { WebWorld } from "../../support/world.js";
import {
  accountOfSession,
  detailsOfAccount,
  sessionsHold,
  sessionsOf,
} from "../../support/control.js";
import { anotherBrowser } from "../../support/sessions.js";
import { passes } from "../../support/time.js";

const home = "/";
const sessionCookie = "session";

const A_DAY = 24 * 60 * 60 * 1000;

const otherOf = (world: WebWorld): { readonly context: BrowserContext } => {
  const found = world.otherBrowsers[world.otherBrowsers.length - 1];
  assert.ok(found !== undefined, "This scenario has only one browser.");
  return { context: found };
};

/** The account the browser's session cookie belongs to, as the site says. */
const signedInAccount = async (
  _world: WebWorld,
  context: BrowserContext,
): Promise<string | undefined> => {
  const cookie = (await context.cookies()).find(
    (each) => each.name === "session",
  );
  return cookie === undefined ? undefined : accountOfSession(cookie.value);
};

const accountIdFor = async (
  _world: WebWorld,
  address: string,
): Promise<string> => (await detailsOfAccount(address)).id;

/** The session cookie this browser holds, if any. */
const cookieOf = async (context: BrowserContext): Promise<Cookie | undefined> =>
  (await context.cookies()).find((each) => each.name === sessionCookie);

const openHome = async (world: WebWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${home}`);
};

const setCookies = new WeakMap<WebWorld, string>();

// Asked of the application directly, carrying the session the browser holds.
// Not through the page, because what a page was shown says nothing about what
// the answer to it said: a browser keeps what it is given and shows neither
// the header nor, over plain HTTP, a Secure cookie it declines to send back.
When("the home page is asked for again", async function (this: WebWorld) {
  const context = this.browserContext;
  assert.ok(context !== undefined, "This scenario has no browser.");
  const cookie = await cookieOf(context);
  assert.ok(cookie !== undefined, "The browser holds no session.");

  const answer = await fetch(`${this.baseUrl!}${home}`, {
    headers: { cookie: `${cookie.name}=${cookie.value}`, ...this.extraHeaders },
    redirect: "manual",
  });
  const said = answer.headers.getSetCookie();
  setCookies.set(this, said.join("\n"));
});

const signInOn = async (
  world: WebWorld,
  context: BrowserContext,
  address: string,
  password: string,
): Promise<void> => {
  const page = await context.newPage();
  await page.goto(`${world.baseUrl!}/account/sign-in`);
  await page.fill('section.dialog input[name="emailAddress"]', address);
  await page.fill('section.dialog input[name="password"]', password);
  await page.click('section.dialog button[type="submit"]');
  await page.waitForLoadState();
  await page.close();
};

// Another device -------------------------------------------------------------------

Given(
  "the reader has signed in on another browser as {string} with the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    const context = await anotherBrowser(this);
    await signInOn(this, context, address, password);
  },
);

When(
  "the reader signs in on another browser as {string} with the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    const context = await anotherBrowser(this);
    await signInOn(this, context, address, password);
  },
);

Then("the other browser is signed out", async function (this: WebWorld) {
  assert.equal(
    await signedInAccount(this, otherOf(this).context),
    undefined,
    "The other browser still has a session.",
  );
});

Then(
  "the reader is signed in on the other browser to the account for {string}",
  async function (this: WebWorld, address: string) {
    assert.equal(
      await signedInAccount(this, otherOf(this).context),
      await accountIdFor(this, address),
    );
  },
);

// Coming back ------------------------------------------------------------------------

// Once every so many days for a stretch of them, each visit starting the
// session's life again: what a reader who keeps coming back does.
Given(
  "the home page has been opened every {int} days for {int} days",
  async function (this: WebWorld, every: number, stretch: number) {
    // Until the stretch is behind it rather than until the next visit would
    // pass it: a loop that stopped short would say 400 days and try 360.
    for (let passed = 0; passed < stretch; passed += every) {
      await passes(every * A_DAY);
      await openHome(this);
    }
  },
);

// A browser closed and opened again keeps what it was given to keep, and
// forgets what it was not: a cookie with no life of its own goes with the
// window it was given in.
When("the browser is closed and opened again", async function (this: WebWorld) {
  const context = this.browserContext;
  assert.ok(context !== undefined, "This scenario has no browser.");
  const kept = (await context.cookies()).filter((cookie) => cookie.expires > 0);
  const opened = await anotherBrowser(this);
  await opened.addCookies(kept);
  await context.close();
  this.browserContext = opened;
  this.page = await opened.newPage();
});

// What is kept -------------------------------------------------------------------------

Then(
  "no row of the sessions table contains the session's id",
  async function (this: WebWorld) {
    const context = this.browserContext;
    assert.ok(context !== undefined, "This scenario has no browser.");
    const cookie = await cookieOf(context);
    assert.ok(cookie !== undefined, "The browser holds no session.");
    assert.equal(
      await sessionsHold(cookie.value),
      false,
      "A row of the sessions holds the session's id.",
    );
  },
);

Then(
  "the account for {string} has {int} session(s)",
  async function (this: WebWorld, address: string, count: number) {
    assert.equal(await sessionsOf(address), count);
  },
);

// An id of somebody else's making, planted in the browser before anybody signs
// in: signing in must not carry it on.
Given(
  "the browser holds a session id it was given before signing in",
  async function (this: WebWorld) {
    const context = this.browserContext;
    assert.ok(context !== undefined, "This scenario has no browser.");
    const url = new URL(this.baseUrl ?? "http://127.0.0.1");
    planted.set(this, "an id somebody else chose");
    await context.addCookies([
      {
        name: sessionCookie,
        value: "an id somebody else chose",
        domain: url.hostname,
        path: "/",
      },
    ]);
  },
);

const planted = new WeakMap<WebWorld, string>();

Then(
  "the browser's session id is not the one it held before",
  async function (this: WebWorld) {
    const context = this.browserContext;
    assert.ok(context !== undefined, "This scenario has no browser.");
    const now = await cookieOf(context);
    assert.ok(now !== undefined, "The browser holds no session.");
    assert.notEqual(now.value, planted.get(this));
  },
);

// Signing out ----------------------------------------------------------------------------

// From the menu, as a reader does: the menu is opened, and the button in it
// pressed. It is a form that posts, never a link, so that another site cannot
// sign a reader out by putting the link in an image.
When("the reader signs out", async function (this: WebWorld) {
  await openHome(this);
  await this.browserPage.locator("details.account-menu > summary").click();
  const button = this.browserPage.locator(
    'details.account-menu form[action="/account/sign-out"] button[type="submit"]',
  );
  await button.waitFor({ state: "visible" });
  await button.click();
  await this.browserPage.waitForLoadState();
});

Given(
  "a copy of the session's cookie has been taken",
  async function (this: WebWorld) {
    const context = this.browserContext;
    assert.ok(context !== undefined, "This scenario has no browser.");
    const cookie = await cookieOf(context);
    assert.ok(cookie !== undefined, "The browser holds no session.");
    copies.set(this, cookie);
  },
);

const copies = new WeakMap<WebWorld, Cookie>();

When(
  "the home page is opened with the copy of the cookie",
  async function (this: WebWorld) {
    const context = this.browserContext;
    const copy = copies.get(this);
    assert.ok(context !== undefined, "This scenario has no browser.");
    assert.ok(copy !== undefined, "No copy was taken.");
    await context.addCookies([copy]);
    await openHome(this);
  },
);

// Said of the answer rather than of the jar: a browser counts a cookie's life
// from when it was given it, so a cookie sent again with its whole life is the
// only thing that keeps a reader who comes back signed in.
Then(
  "the answer gives the session's cookie its 90 days again",
  function (this: WebWorld) {
    const said = setCookies.get(this) ?? "";
    assert.ok(
      said.includes(`${sessionCookie}=`),
      `The answer set no session cookie: ${said}`,
    );
    assert.ok(
      said.includes(`Max-Age=${90 * 24 * 60 * 60}`),
      `The cookie was not given its 90 days: ${said}`,
    );
  },
);
