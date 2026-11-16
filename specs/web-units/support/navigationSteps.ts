import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import { withScripting } from "./browser.js";
import { menuLink } from "./menuLink.js";
const link = menuLink;

Given(
  "a viewport {int} pixels wide",
  async function (this: SpecWorld, width: number) {
    // The height is not what any of these scenarios are about, so it is the same
    // for all of them and says nothing.
    await this.browserPage.setViewportSize({ width, height: 800 });
  },
);

const openHomePage = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/`);
};

Given("the home page is open", openHomePage);
When("the home page is opened", openHomePage);

Given("scripting is switched on", async function (this: SpecWorld) {
  await withScripting(this);
});

Then(
  "the link {string} is visible",
  async function (this: SpecWorld, label: string) {
    assert.equal(await this.browserPage.isVisible(link(label)), true);
  },
);
