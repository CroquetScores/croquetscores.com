import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

// A group's Summary and tests, offered above the heading of the group's page
// and of each of its tests' pages (group.feature, test.feature).

const places = ["first", "second", "third"];

const links = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .group-links a");

const linkTo = (world: SpecWorld, label: string): Locator =>
  world.browserPage.locator(`main .group-links a:text-is("${label}")`);

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

Then(
  /^the (first|second|third) of the group's links is "(.*)"$/,
  async function (this: SpecWorld, which: string, label: string) {
    assert.equal(await said(links(this).nth(places.indexOf(which))), label);
  },
);

Then(
  "the group offers {int} links",
  async function (this: SpecWorld, count: number) {
    assert.equal(await links(this).count(), count);
  },
);

// Asked once the page's heading is there, so that links looked for too soon
// are not taken for none.
Then("the group offers no links", async function (this: SpecWorld) {
  await this.browserPage.locator("main h1").first().waitFor();
  assert.equal(await links(this).count(), 0);
});

Then(
  "the group's link {string} leads to {string}",
  async function (this: SpecWorld, label: string, href: string) {
    assert.equal(await linkTo(this, label).getAttribute("href"), href);
  },
);

Then(
  "the group's link {string} is marked as the one being read",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await linkTo(this, label).getAttribute("aria-current"),
      "page",
    );
  },
);

Then(
  "the group's link {string} is not marked as the one being read",
  async function (this: SpecWorld, label: string) {
    assert.equal(await linkTo(this, label).getAttribute("aria-current"), null);
  },
);
