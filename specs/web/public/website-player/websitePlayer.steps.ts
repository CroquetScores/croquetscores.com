import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { unmarkedWithin } from "../../support/marks.js";

// A player's page, drawn by the server with no scripting
// (`websitePlayer.feature`): a table of the tournaments they are in.

const rows = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .player-tournaments tbody tr");

const heading = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .player-tournaments th");

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const row = (world: SpecWorld, name: string): Locator =>
  rows(world).filter({ hasText: exactly(name) });

const place = ["first", "second"];

Then(
  "the table's heading is {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal((await heading(this).innerText()).trim(), name);
  },
);

Then(
  /^the (first|second) row is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    const at = place.indexOf(which);
    assert.equal((await rows(this).nth(at).innerText()).trim(), name);
  },
);

Then(
  /^there (is|is not) a row of "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(await row(this, name).count(), which === "is" ? 1 : 0);
  },
);

Then(
  /^the table has (\d+) rows?$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(await rows(this).count(), Number(count));
  },
);

Then(
  "the first row says nothing but {string}",
  async function (this: SpecWorld, name: string) {
    const first = rows(this).first();
    assert.equal((await first.innerText()).trim(), name);
    assert.equal(await first.locator("td").count(), 1);
  },
);

Then(
  "the first row's tournament leads to {string}",
  async function (this: SpecWorld, path: string) {
    assert.equal(
      await rows(this).first().locator("a").getAttribute("href"),
      path,
    );
  },
);

When(
  "the tournament of the first row is pressed",
  async function (this: SpecWorld) {
    await Promise.all([
      this.browserPage.waitForNavigation(),
      rows(this).first().locator("a").click(),
    ]);
    await this.browserPage.waitForLoadState();
  },
);

When(
  "the heading {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await Promise.all([
      this.browserPage.waitForNavigation(),
      heading(this)
        .locator("a", { hasText: exactly(name) })
        .click(),
    ]);
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the heading {string} leads to {string}",
  async function (this: SpecWorld, name: string, path: string) {
    assert.equal(
      await heading(this)
        .locator("a", { hasText: exactly(name) })
        .getAttribute("href"),
      path,
    );
  },
);

Then(
  /^the table is sorted by "(.*)", from (A to Z|Z to A)$/,
  async function (this: SpecWorld, name: string, way: string) {
    assert.equal((await heading(this).innerText()).trim(), name);
    assert.equal(
      await heading(this).getAttribute("aria-sort"),
      way === "A to Z" ? "ascending" : "descending",
    );
  },
);

Then("the table is not said to be sorted", async function (this: SpecWorld) {
  assert.equal(await heading(this).getAttribute("aria-sort"), null);
});

Then(
  "every word in the page's content but the names is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main", [
      "h1",
      ".player-tournaments td a",
    ]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);
