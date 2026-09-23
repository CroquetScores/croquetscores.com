import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Website } from "../../../../src/domain/common/Website.js";
import { english } from "../../../../src/web/languages/english.js";
import { anApplicationServedAs } from "../../support/browser.js";
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

// Read against the English words, with the site's name filled in as the header
// shows it, so that a banner saying something else — or holding a place the
// name was never put in — is not taken for this one.
Then(
  "the page carries the try website's banner",
  async function (this: SpecWorld) {
    const siteName = (
      await this.browserPage.locator("header .site-name").innerText()
    ).trim();
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
