// The change name page, in a real browser. The name is typed as a reader types
// it, and the dialog submitted by its button.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const changeName = "/account/change-name";
const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const open = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${changeName}`);
};

Given("the change name page is open", async function (this: SpecWorld) {
  await open(this);
});

When("the change name page is opened", async function (this: SpecWorld) {
  await open(this);
});

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
When(
  "the change name page is opened with scripting off",
  async function (this: SpecWorld) {
    await open(this);
  },
);

Then("the change name page is shown", async function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, changeName);
  const title = unmarked(
    (await this.browserPage.locator(".dialog-title").textContent()) ?? "",
  );
  assert.equal(title, words("changeName.title"));
});

Given(
  "the name {string} is typed",
  async function (this: SpecWorld, name: string) {
    await this.browserPage.fill(`${dialog} input[name="name"]`, name);
  },
);
