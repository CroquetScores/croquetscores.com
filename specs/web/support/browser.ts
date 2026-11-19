// A real browser for the scenarios tagged @browser, and the site for it to talk
// to. Both are started by the first scenario that needs them and not before:
// Cucumber runs BeforeAll ahead of any tag filtering, so starting them there
// would make every run, including the ones that want neither, pay for them.
import { After, AfterAll, Before, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium, type Browser } from "playwright";

import { settingUpAtTheUsualMoment } from "./control.js";
import { standInForRecaptcha } from "./recaptcha.js";
import { endAnotherSite, forget, markTheLog, site, stop } from "./site.js";
import type { WebWorld } from "./world.js";

// Starting the site, and making its database, take more than Cucumber's five
// seconds, and the first scenario of each worker pays for both.
setDefaultTimeout(180_000);

let browser: Browser | undefined;

export const theBrowser = async (): Promise<Browser> => {
  browser ??= await chromium.launch();
  return browser;
};

Before(async function (this: WebWorld) {
  this.baseUrl = (await site()).baseUrl;
  await forget();
  settingUpAtTheUsualMoment();
  this.logFrom = markTheLog();
});

Before({ tags: "@browser" }, async function (this: WebWorld) {
  // Scripting off by default, because what these scenarios are mostly here to
  // say is that the public side does not need it. A scenario about the admin
  // asks for it back.
  this.browserContext = await (
    await theBrowser()
  ).newContext({
    javaScriptEnabled: false,
  });
  await standInForRecaptcha(this.browserContext, this);
  this.page = await this.browserContext.newPage();
});

// The site a scenario started with settings of its own is stopped with it, with
// or without a browser: a scenario that talks to the site by plain requests is
// told settings too, and the next scenario would otherwise be answered by it.
After(async function () {
  await endAnotherSite();
});

// Whatever closing has to say is nothing the scenario's own verdict should be
// overturned by.
After({ tags: "@browser" }, async function (this: WebWorld) {
  await Promise.allSettled([
    this.browserContext?.close(),
    ...this.otherBrowsers.map((other) => other.close()),
  ]);
  this.otherBrowsers = [];
  // The site the scenario started with settings of its own is stopped with it.
  await endAnotherSite();
  this.browserContext = undefined;
  this.page = undefined;
});

AfterAll(async () => {
  await browser?.close();
  browser = undefined;
  await stop();
});

/**
 * Makes the scenario's browser one with scripting switched on, for a page that
 * cannot be used without it. A browser's scripting is fixed when it is made, so
 * this makes another, asked everything the scenario asked of the first, its
 * width, its colour scheme, its languages and whatever it was given to keep,
 * and closes the first.
 */
export const withScripting = async (
  world: WebWorld,
  /** The region the browser is set to, such as "de-DE", where a scenario says. */
  locale?: string,
): Promise<void> => {
  const context = world.browserContext;
  const page = world.page;
  if (context === undefined || page === undefined) {
    throw new Error(
      "This scenario has no browser. Tag it @browser if it needs one.",
    );
  }

  const scripted = await (
    await theBrowser()
  ).newContext({
    javaScriptEnabled: true,
    viewport: page.viewportSize(),
    ...(locale === undefined ? {} : { locale }),
    ...(world.colourScheme === undefined
      ? {}
      : { colorScheme: world.colourScheme }),
    extraHTTPHeaders: world.extraHeaders,
  });
  // The cookies the scenario has the first browser keep are as much a part of
  // what it asked for as its width is: the theme it chose, and the reader it is
  // signed in as.
  await scripted.addCookies(await context.cookies());

  await standInForRecaptcha(scripted, world);
  world.browserContext = scripted;
  world.page = await scripted.newPage();
  await context.close();
};

/**
 * Closes the scenario's browser and opens another that has kept what a browser
 * keeps between visits: its cookies and what pages stored in it. It is asked
 * for everything the scenario asked of the first, scripting included, since a
 * reader who comes back has not changed their browser.
 */
export const reopenedBrowser = async (world: WebWorld): Promise<void> => {
  const context = world.browserContext;
  const page = world.page;
  if (context === undefined || page === undefined) {
    throw new Error(
      "This scenario has no browser. Tag it @browser if it needs one.",
    );
  }

  const reopened = await (
    await theBrowser()
  ).newContext({
    javaScriptEnabled: true,
    storageState: await context.storageState(),
    viewport: page.viewportSize(),
    ...(world.colourScheme === undefined
      ? {}
      : { colorScheme: world.colourScheme }),
    extraHTTPHeaders: world.extraHeaders,
  });

  await standInForRecaptcha(reopened, world);
  world.browserContext = reopened;
  world.page = await reopened.newPage();
  await context.close();
};
