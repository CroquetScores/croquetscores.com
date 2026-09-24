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

// Each value, and the label that names it, by the words a scenario uses for it.
const shownAs: Readonly<Record<string, { label: string; value: string }>> = {
  name: { label: "#profile-name-label", value: "#profile-name" },
  "email address": {
    label: "#profile-email-address-label",
    value: "#profile-email-address",
  },
};

const partsOf = (value: string): { label: string; value: string } => {
  const parts = shownAs[value];
  assert.ok(parts !== undefined, `The profile shows no ${value}.`);
  return parts;
};

Then(
  /^the label for the (name|email address) says "([^"]*)"$/,
  async function (this: SpecWorld, value: string, said: string) {
    const shown = await this.browserPage
      .locator(partsOf(value).label)
      .textContent();
    assert.equal(unmarked(shown ?? "").trim(), said);
  },
);

// Read from what the browser drew, since bold is what the reader sees.
Then(
  /^the label for the (name|email address) is bold$/,
  async function (this: SpecWorld, value: string) {
    const weight = await this.browserPage.evaluate<string>(
      `getComputedStyle(document.querySelector(${JSON.stringify(partsOf(value).label)})).fontWeight`,
    );
    assert.ok(Number(weight) >= 700, `The label is drawn at ${weight}.`);
  },
);

// Beside it: starting on the same line, and to its right rather than beneath.
Then(
  /^the (name|email address) is on the same row as its label$/,
  async function (this: SpecWorld, value: string) {
    const parts = partsOf(value);
    const label = await this.browserPage.locator(parts.label).boundingBox();
    const shown = await this.browserPage.locator(parts.value).boundingBox();
    assert.ok(label !== null && shown !== null, "It is not drawn.");
    assert.ok(
      Math.abs(label.y - shown.y) <= 1,
      `The label starts at ${label.y} and the ${value} at ${shown.y}.`,
    );
    assert.ok(
      shown.x >= label.x + label.width - 0.5,
      `The ${value} does not start to the right of its label.`,
    );
  },
);
