import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { deployAgain } from "../support/browser.js";
import { unmarked } from "../support/languages.js";
import { wordsFor } from "../support/newMarks.js";
import type { SpecWorld } from "../../support/world.js";

Given("the site is deployed again", function (this: SpecWorld) {
  deployAgain(this);
});

const offer = (world: SpecWorld) =>
  world.browserPage.locator("[data-newer-build]");

// The offer comes a moment after the answer that brings it, so it is waited
// for, and its absence is read once the page has settled on what it was shown.
Then("the page offers to reload", async function (this: SpecWorld) {
  await offer(this).waitFor({ timeout: 5000 });
});

Then("the page does not offer to reload", async function (this: SpecWorld) {
  await this.browserPage.waitForLoadState();
  assert.equal(await offer(this).count(), 0, "The page offers to reload.");
});

Then(
  "the offer to reload says the words for {string}",
  async function (this: SpecWorld, key: string) {
    await offer(this).waitFor({ timeout: 5000 });
    const said = unmarked(await offer(this).innerText());
    assert.ok(
      said.includes(wordsFor(key)),
      `The offer says ${said}, and not the words for ${key}.`,
    );
  },
);

When("the offer to reload is accepted", async function (this: SpecWorld) {
  await offer(this).locator("button").click();
});
