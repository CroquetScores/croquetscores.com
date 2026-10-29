import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { unmarkedWithin } from "../../support/marks.js";

// A player's page, drawn by the server with no scripting
// (`websitePlayer.feature`): a table of the tournaments they are in.

const rows = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .player-tournaments tbody tr");

const headings = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .player-tournaments th");

const escaped = (words: string): string =>
  words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const exactly = (words: string): RegExp => new RegExp(`^${escaped(words)}$`);

// A heading by its words, which an arrow may stand before when the table is
// sorted by it.
const withArrow = (words: string): RegExp =>
  new RegExp(`^[↑↓]?\\s*${escaped(words)}$`);

const heading = (world: SpecWorld, name: string): Locator =>
  headings(world).filter({ hasText: withArrow(name) });

// A row's two cells, the days it runs and then the tournament.
const datesOf = (one: Locator): Locator => one.locator("td").nth(0);
const tournamentOf = (one: Locator): Locator => one.locator("td").nth(1);

const row = (world: SpecWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator("td:nth-child(2)", {
      hasText: exactly(name),
    }),
  });

const place = ["first", "second", "third", "fourth"];

const ways: Readonly<Record<string, string>> = {
  "A to Z": "ascending",
  "Z to A": "descending",
  "oldest to newest": "ascending",
  "newest to oldest": "descending",
};

Then(
  /^the table's headings are "(.*)" and "(.*)"$/,
  async function (this: SpecWorld, first: string, second: string) {
    const all = headings(this);
    assert.equal(await all.count(), 2);
    assert.match((await all.nth(0).innerText()).trim(), withArrow(first));
    assert.match((await all.nth(1).innerText()).trim(), withArrow(second));
  },
);

Then(
  /^the (first|second|third|fourth) row is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    const at = place.indexOf(which);
    assert.equal(
      (await tournamentOf(rows(this).nth(at)).innerText()).trim(),
      name,
    );
  },
);

Then(
  /^the first row is dated "(.*)"$/,
  async function (this: SpecWorld, dates: string) {
    assert.equal((await datesOf(rows(this).first()).innerText()).trim(), dates);
  },
);

// A line of words that wrapped is drawn as more than one box, one to a line.
Then(
  "the dates of the first row are on one line",
  async function (this: SpecWorld) {
    const lines = await datesOf(rows(this).first()).evaluate<number>(
      `(cell) => {
        const words = document.createRange();
        words.selectNodeContents(cell);
        return words.getClientRects().length;
      }`,
    );
    assert.equal(lines, 1);
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
  "the first row says nothing but its dates and {string}",
  async function (this: SpecWorld, name: string) {
    const first = rows(this).first();
    assert.equal(await first.locator("td").count(), 2);
    assert.equal((await tournamentOf(first).innerText()).trim(), name);
    assert.notEqual((await datesOf(first).innerText()).trim(), "");
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
      heading(this, name).locator("a").click(),
    ]);
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the heading {string} leads to {string}",
  async function (this: SpecWorld, name: string, path: string) {
    assert.equal(
      await heading(this, name).locator("a").getAttribute("href"),
      path,
    );
  },
);

Then(
  /^the table is sorted by "(.*)", from (A to Z|Z to A|oldest to newest|newest to oldest)$/,
  async function (this: SpecWorld, name: string, way: string) {
    const sorted = heading(this, name);
    assert.equal(await sorted.count(), 1, `${name} is not a heading.`);
    assert.equal(await sorted.getAttribute("aria-sort"), ways[way]);
    // The only one of them that is.
    assert.equal(
      await this.browserPage
        .locator("main .player-tournaments th[aria-sort]")
        .count(),
      1,
    );
  },
);

Then(
  "every word in the page's content but the names is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main", [
      "h1",
      ".player-tournaments td a",
      ".player-tournaments td.tournament-dates",
    ]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);
