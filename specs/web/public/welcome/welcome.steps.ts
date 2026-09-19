import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { englishForScenarios } from "../../support/languages.js";

const welcome = "/accounts/welcome";

// What the browser was last answered with, since a page that is "shown" is one
// the site answered, not one it refused or could not find.
const answered = new WeakMap<SpecWorld, number | undefined>();

When("the welcome page is opened", async function (this: SpecWorld) {
  const response = await this.browserPage.goto(`${this.baseUrl!}${welcome}`);
  answered.set(this, response?.status());
});

// Shown to a reader with no scripting — the scenarios' browser has none — and
// nobody signed in, since nobody can be yet.
Then("the welcome page is shown", function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, welcome);
  assert.equal(answered.get(this), 200, "The welcome page was not answered.");
});

Then(
  "the reader is told to check their email",
  async function (this: SpecWorld) {
    const said = englishForScenarios.words["welcome.checkEmail"];
    assert.ok(said !== undefined);
    const content =
      (await this.browserPage.locator("main").textContent()) ?? "";
    assert.ok(content.includes(said), "The page does not say to check email.");
  },
);
