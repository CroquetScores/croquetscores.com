// A reader who is signed in, and what the site makes of that, as a scenario about
// signing out asks it: of the pages, which draw the way out of the account menu for
// a reader who is signed in and the ways in for one who is not, and of the
// session the site holds, counted. A second browser stands in for another device.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { BrowserContext } from "playwright";

import { sessionsOf } from "./control.js";
import { theBrowser } from "./browser.js";
import type { WebWorld } from "./world.js";

// By what the menu offers: the way out is there for a reader who is signed in, and
// the ways in for one who is not. The person in the summary is drawn for everybody,
// so it says nothing about who is reading.
const signOutForm = 'details.account-menu form[action="/account/sign-out"]';

// Asked of the page the reader is on, where it carries the account menu. The admin
// carries none, so a reader who has landed there is asked about on the home page
// instead, in another tab of the same browser, which leaves the page the scenario
// is on where it was.
const theSiteSaysSignedIn = async (world: WebWorld): Promise<boolean> => {
  if ((await world.browserPage.locator("details.account-menu").count()) > 0) {
    return (await world.browserPage.locator(signOutForm).count()) > 0;
  }
  return signedInOn(world, world.browserPage.context());
};

const signedInOn = async (
  world: WebWorld,
  context: BrowserContext,
): Promise<boolean> => {
  const home = await context.newPage();
  try {
    await home.goto(`${world.baseUrl!}/`);
    return (await home.locator(signOutForm).count()) > 0;
  } finally {
    await home.close();
  }
};

Then("the reader is signed out", async function (this: WebWorld) {
  assert.equal(
    await theSiteSaysSignedIn(this),
    false,
    "The site says somebody is signed in.",
  );
});

// What another device is to these scenarios: a browser of its own, with none of
// this one's cookies.
const anotherBrowser = async (world: WebWorld): Promise<BrowserContext> => {
  const context = await (
    await theBrowser()
  ).newContext({
    javaScriptEnabled: false,
    extraHTTPHeaders: world.extraHeaders,
  });
  world.otherBrowsers.push(context);
  return context;
};

Given(
  "the reader has signed in on another browser as {string} with the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    const page = await (await anotherBrowser(this)).newPage();
    await page.goto(`${this.baseUrl!}/account/sign-in`);
    await page.fill('section.dialog input[name="emailAddress"]', address);
    await page.fill('section.dialog input[name="password"]', password);
    await page.click('section.dialog button[type="submit"]');
    await page.waitForLoadState();
    await page.close();
  },
);

Then("the other browser is signed out", async function (this: WebWorld) {
  const other = this.otherBrowsers[this.otherBrowsers.length - 1];
  assert.ok(other !== undefined, "This scenario has only one browser.");
  assert.equal(
    await signedInOn(this, other),
    false,
    "The other browser is still signed in.",
  );
});

Then(
  /^the account for "([^"]*)" has (\d+) sessions?$/,
  async function (this: WebWorld, address: string, count: string) {
    assert.equal(await sessionsOf(address), Number(count));
  },
);

Then("the page is on the panel", async function (this: WebWorld) {
  assert.equal(await this.browserPage.locator(".panel").count(), 1);
});
