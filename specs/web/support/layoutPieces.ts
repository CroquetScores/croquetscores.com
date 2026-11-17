// What the shell puts round a page, as a reader sees it: the site's name in the
// header and the banner a try website carries.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { unmarked } from "./languages.js";
import type { WebWorld } from "./world.js";

const banner = ".try-banner";

Then(
  "the header names the site {string}",
  async function (this: WebWorld, name: string) {
    assert.equal(
      (
        await this.browserPage.locator("header.site-bar .site-name").innerText()
      ).trim(),
      name,
    );
  },
);

// Read against the English words, with the name of the site the scenario's
// browser addressed filled in, so that a banner saying something else, or
// holding a place the name was never put in, is not taken for this one.
Then(
  "the page carries the try website's banner",
  async function (this: WebWorld) {
    const host = this.extraHeaders["x-forwarded-host"] ?? "";
    const siteName = host.includes("gateballscores")
      ? "Gateball Scores"
      : "Croquet Scores";
    const shown = unmarked(
      await this.browserPage.locator(banner).innerText(),
    ).trim();
    assert.equal(
      shown,
      `This is a safe place to learn ${siteName}. Anything entered here may be removed at any time.`,
    );
  },
);

Then(
  "the page carries no try website's banner",
  async function (this: WebWorld) {
    assert.equal(await this.browserPage.locator(banner).count(), 0);
  },
);
