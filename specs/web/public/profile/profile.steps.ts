// The profile page, in a real browser, read as a reader reads it.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const profile = "/account/profile";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

// Scripting is off unless a step asks for it back, so opening the page with it
// off is the same opening, said all the same because it is what the scenario is
// about.
const open = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${profile}`);
};

Given("the profile page is open", async function (this: SpecWorld) {
  await open(this);
});

When("the profile page is opened", async function (this: SpecWorld) {
  await open(this);
});

When(
  "the profile page is opened with scripting off",
  async function (this: SpecWorld) {
    await open(this);
  },
);

Then("the profile page is shown", async function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, profile);
  const heading = unmarked(
    (await this.browserPage.locator("main h1").textContent()) ?? "",
  );
  assert.equal(heading, words("profile.title"));
});

Then(
  "the profile shows the name {string}",
  async function (this: SpecWorld, name: string) {
    const shown = await this.browserPage.locator("#profile-name").textContent();
    assert.equal(shown?.trim(), name);
  },
);

Then(
  "the profile shows the email address {string}",
  async function (this: SpecWorld, address: string) {
    const shown = await this.browserPage
      .locator("#profile-email-address")
      .textContent();
    assert.equal(shown?.trim(), address);
  },
);

// Found by where it goes, and then held to what it says, so that a link that
// went to the right page under the wrong words would show.
Then(
  "the profile links to {string} at {string}",
  async function (this: SpecWorld, page: string, path: string) {
    const link = this.browserPage.locator(`main a[href="${path}"]`);
    assert.equal(await link.count(), 1, `Nothing links to ${path}.`);
    assert.equal(unmarked((await link.textContent()) ?? "").trim(), page);
  },
);
