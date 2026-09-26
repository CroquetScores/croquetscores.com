import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

// Named rather than left as "header summary" and "header a": the header also
// holds the account menu, which has a summary and links of its own, and a step
// about the primary navigation that lands on the first match in the page is one
// the order of the markup decides.
const menuButton = "header details.menu > summary";
const link = (label: string): string => `.menu-links a:text-is("${label}")`;
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

// How the page being read is marked -----------------------------------------------

Then(
  "the link {string} is marked as the page being read",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(link(label), "aria-current"),
      "page",
    );
  },
);

Then(
  "the link {string} is not marked as the page being read",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(link(label), "aria-current"),
      null,
    );
  },
);

// What the stylesheet draws the link `label` with, found by its place among
// the navigation's links and read as an expression, as the other steps read
// what they run in the page, since the specs are typed without the browser's
// own types.
const drawn = async (
  world: SpecWorld,
  label: string,
  property: string,
): Promise<string> => {
  const at = (
    await world.browserPage.locator(".menu-links a").allTextContents()
  ).indexOf(label);
  assert.ok(at >= 0, `The navigation has no link ${label}.`);
  return world.browserPage.evaluate<string>(
    `getComputedStyle(document.querySelectorAll(".menu-links a")[${String(at)}]).${property}`,
  );
};

Then(
  "the link {string} is on black",
  async function (this: SpecWorld, label: string) {
    assert.equal(await drawn(this, label, "backgroundColor"), "rgb(0, 0, 0)");
  },
);

Then(
  "the link {string} is on the colour the current section is on",
  async function (this: SpecWorld, label: string) {
    const section = await this.browserPage.evaluate<string>(
      `getComputedStyle(document.querySelector('.site-sections a[aria-current="page"]')).backgroundColor`,
    );
    assert.equal(await drawn(this, label, "backgroundColor"), section);
  },
);

Then(
  "the link {string} is not underlined",
  async function (this: SpecWorld, label: string) {
    assert.ok(
      !(await drawn(this, label, "textDecorationLine")).includes("underline"),
    );
  },
);
