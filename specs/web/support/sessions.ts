// A reader who is signed in, and what the site makes of that, as a scenario about
// signing out asks it: of the pages, which draw the way out of the account menu for
// a reader who is signed in and the ways in for one who is not, and of the
// session the site holds, counted. A second browser stands in for another device.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { BrowserContext } from "playwright";

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

export const signedInOn = async (
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
export const anotherBrowser = async (
  world: WebWorld,
): Promise<BrowserContext> => {
  const context = await (
    await theBrowser()
  ).newContext({
    javaScriptEnabled: false,
    extraHTTPHeaders: world.extraHeaders,
  });
  world.otherBrowsers.push(context);
  return context;
};

Then("the page is on the panel", async function (this: WebWorld) {
  assert.equal(await this.browserPage.locator(".panel").count(), 1);
});
