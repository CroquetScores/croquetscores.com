import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call } from "../support/control.js";
import { unmarked } from "../support/languages.js";
import type { WebWorld } from "../support/world.js";
import { wordsFor } from "../support/words.js";

// The build the admin was built to is no longer the one the site names.
Given("the site is deployed again", async function () {
  const answer = await call("POST", "/build", {});
  assert.equal(answer.status, 200, await answer.text());
});

const offer = (world: WebWorld) =>
  world.browserPage.locator("[data-newer-build]");

// The offer comes a moment after the answer that brings it, so it is waited
// for, and its absence is read once the page has settled on what it was shown.
Then("the page offers to reload", async function (this: WebWorld) {
  await offer(this).waitFor({ timeout: 15000 });
});

Then("the page does not offer to reload", async function (this: WebWorld) {
  await this.browserPage.waitForLoadState();
  assert.equal(await offer(this).count(), 0, "The page offers to reload.");
});

Then(
  "the offer to reload says the words for {string}",
  async function (this: WebWorld, key: string) {
    await offer(this).waitFor({ timeout: 15000 });
    const said = unmarked(await offer(this).innerText());
    assert.ok(
      said.includes(wordsFor(key)),
      `The offer says ${said}, and not the words for ${key}.`,
    );
  },
);

When("the offer to reload is accepted", async function (this: WebWorld) {
  await offer(this).locator("button").click();
});
