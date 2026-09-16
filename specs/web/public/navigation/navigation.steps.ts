import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

const menuButton = "header summary";
const link = (label: string): string => `header a:text-is("${label}")`;
const section = (label: string): string =>
  `.site-sections a:text-is("${label}")`;

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

When("the menu button is pressed", async function (this: SpecWorld) {
  await this.browserPage.click(menuButton);
});

Then(
  "the link {string} is visible",
  async function (this: SpecWorld, label: string) {
    assert.equal(await this.browserPage.isVisible(link(label)), true);
  },
);

Then(
  "the link {string} is not visible",
  async function (this: SpecWorld, label: string) {
    assert.equal(await this.browserPage.isVisible(link(label)), false);
  },
);

Then("the menu button is visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible(menuButton), true);
});

Then("the menu button is not visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible(menuButton), false);
});

Then(
  "the link {string} is at least {int} pixels tall",
  async function (this: SpecWorld, label: string, height: number) {
    const box = await this.browserPage.locator(link(label)).boundingBox();
    assert.ok(box !== null, `The link ${label} has no box to measure.`);
    assert.ok(
      box.height >= height,
      `The link ${label} is ${Math.round(box.height)} pixels tall, and wanted ${height}.`,
    );
  },
);

Then(
  "the section {string} is visible",
  async function (this: SpecWorld, label: string) {
    assert.equal(await this.browserPage.isVisible(section(label)), true);
  },
);

Then(
  "the section {string} is marked as current",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(section(label), "aria-current"),
      "page",
    );
  },
);

Then(
  "the section {string} is not marked as current",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(section(label), "aria-current"),
      null,
    );
  },
);
