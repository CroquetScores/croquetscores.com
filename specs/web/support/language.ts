// What a scenario says about the language a page is in, and how the test
// locale is read: every phrase marked, so that an unmarked word is one that did
// not come from a catalogue.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { telling } from "./headers.js";
import { unmarkedWithin } from "./marks.js";
import type { WebWorld } from "./world.js";

// What the browser says its reader reads, on every request from here on. The
// browser's own is replaced rather than added to, so the scenario says all of
// it.
Given(
  "a browser that asks for {string}",
  async function (this: WebWorld, asked: string) {
    // The browser's own is replaced. A scenario that only reads pages has no
    // browser to tell, and tells its requests instead.
    await telling(this, "accept-language", asked);
  },
);

// What the page says it is in, which is what a screen reader and a browser
// offering to translate go by.
Then("the page is in {string}", async function (this: WebWorld, tag: string) {
  assert.equal(
    await this.browserPage.evaluate<string>("document.documentElement.lang"),
    tag,
  );
});

Then(
  "every word in the page's content is in the test locale",
  async function (this: WebWorld) {
    assert.deepEqual(
      await unmarkedWithin(this, "main"),
      [],
      "These words did not come from a catalogue.",
    );
  },
);
