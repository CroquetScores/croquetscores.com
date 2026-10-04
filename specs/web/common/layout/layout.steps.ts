import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { Website } from "../../../../src/domain/common/Website.js";
import { english } from "../../../../src/web/languages/english.js";
import { anApplicationServedAs, siteNameFor } from "../../support/browser.js";
import { unmarked } from "../../support/languages.js";
import type { SpecWorld } from "../../../support/world.js";

const banner = ".try-banner";

// A site of this scenario's own, served as the website it names, so that what
// the shell puts round a page can be seen to follow the website rather than
// anything else about the application every other scenario shares.
Given(
  "a site served as {string}",
  async function (this: SpecWorld, host: string) {
    this.baseUrl = await anApplicationServedAs(this, Website.from(host));
  },
);

// Read against the English words, with the site's name filled in as the site
// is called, so that a banner saying something else — or holding a place the
// name was never put in — is not taken for this one. The name is asked of the
// application rather than read off the header, because the admin draws its
// header itself and a page looked at with no scripting has none.
Then(
  "the page carries the try website's banner",
  async function (this: SpecWorld) {
    const siteName = siteNameFor(this);
    const words = english.words["tryWebsite.banner"];
    assert.ok(words !== undefined, "English has no words for the banner.");

    const shown = unmarked(
      await this.browserPage.locator(banner).innerText(),
    ).trim();
    assert.equal(shown, words.replace("{siteName}", siteName));
  },
);

Then(
  "the page carries no try website's banner",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(banner).count(), 0);
  },
);

// The tournament named in the header -------------------------------------------------

const tournamentInHeader = (world: SpecWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-tournament");

const siteNameInHeader = (world: SpecWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-name");

Then(
  "the header names the tournament {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal((await tournamentInHeader(this).innerText()).trim(), name);
  },
);

Then("the header names no tournament", async function (this: SpecWorld) {
  assert.equal(await tournamentInHeader(this).count(), 0);
});

Then(
  "the tournament named in the header is beneath the site's name",
  async function (this: SpecWorld) {
    const site = await siteNameInHeader(this).boundingBox();
    const tournament = await tournamentInHeader(this).boundingBox();
    assert.ok(
      site !== null && tournament !== null,
      "One of them is not shown.",
    );
    assert.ok(
      tournament.y >= site.y + site.height,
      `It starts ${String(tournament.y)} pixels down.`,
    );
  },
);

// What a page's own scripting would see of an element, which the specs are
// not compiled to know.
interface InThePage {
  getComputedStyle(element: unknown): {
    readonly fontFamily: string;
    readonly fontSize: string;
    readonly fontWeight: string;
  };
}

const setIn = (found: Locator): Promise<string> =>
  found.evaluate((element: unknown) => {
    const { fontFamily, fontSize, fontWeight } = (
      globalThis as unknown as InThePage
    ).getComputedStyle(element);
    return `${fontFamily} ${fontSize} ${fontWeight}`;
  });

Then(
  "the tournament named in the header is set as the site's name is",
  async function (this: SpecWorld) {
    assert.equal(
      await setIn(tournamentInHeader(this)),
      await setIn(siteNameInHeader(this)),
    );
  },
);

When(
  "the tournament named in the header is pressed",
  async function (this: SpecWorld) {
    await tournamentInHeader(this).click();
    await this.browserPage.waitForLoadState();
  },
);
