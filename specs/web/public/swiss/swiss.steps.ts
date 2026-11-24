import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  assertAbove,
  assertBelow,
  assertBeside,
  assertOnOneLine,
} from "../../support/placed.js";
import type { WebWorld } from "../../support/world.js";
import {
  isMetaDataStruckThrough,
  isStruckThrough,
} from "../../support/struckThrough.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.
//
// Said here for a Swiss's grid and its summary alike, which are one table, the
// summary's without its results. The views offered are said with a block's
// (block.steps.ts).

const places = ["first", "second", "third", "fourth"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const tableOf = (world: WebWorld): Locator =>
  world.browserPage.locator("main .swiss-table");

const rows = (world: WebWorld): Locator => tableOf(world).locator("tbody > tr");

const headings = (world: WebWorld): Locator =>
  tableOf(world).locator("thead .swiss-heading");

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const rowOf = (world: WebWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".player-name", { hasText: name }),
  });

const resultOf = (world: WebWorld, which: string, name: string): Locator =>
  rowOf(world, name).locator(".swiss-result").nth(placeOf(which));

When(
  "the name of {string} in the Swiss is pressed",
  async function (this: WebWorld, name: string) {
    await rowOf(this, name).locator(".player-name").click();
    await this.browserPage.waitForLoadState();
  },
);

// Its rows -----------------------------------------------------------------------

Then(
  /^the (first|second|third) row of the Swiss is "(.*)"$/,
  async function (this: WebWorld, which: string, name: string) {
    assert.equal(
      await said(rows(this).nth(placeOf(which)).locator(".player-name")),
      name,
    );
  },
);

Then(
  "the row of {string} in the Swiss says they represent {string}",
  async function (this: WebWorld, name: string, representing: string) {
    assert.equal(
      await said(rowOf(this, name).locator(".player-representing")),
      `(${representing})`,
    );
  },
);

Then(
  "the row of {string} in the Swiss says they have withdrawn",
  async function (this: WebWorld, name: string) {
    assert.equal(
      await rowOf(this, name).locator(".swiss-withdrawn").count(),
      1,
    );
  },
);

Then(
  /^the name of "(.*)" in the Swiss is (not )?struck through$/,
  async function (this: WebWorld, name: string, not: string | null) {
    assert.equal(
      await isStruckThrough(rowOf(this, name).locator(".player-name")),
      not === null,
    );
  },
);

// Its columns --------------------------------------------------------------------

Then(
  /^the (first|second|third|fourth) column of the Swiss is headed "(.*)"$/,
  async function (this: WebWorld, which: string, heading: string) {
    assert.equal(await said(headings(this).nth(placeOf(which))), heading);
  },
);

Then(
  "the Swiss has {int} columns beside its players",
  async function (this: WebWorld, count: number) {
    assert.equal(await headings(this).count(), count);
  },
);

Then(
  "the {string} of {string} in the Swiss are {string}",
  async function (
    this: WebWorld,
    heading: string,
    name: string,
    value: string,
  ) {
    const all = (await headings(this).allTextContents()).map((each) =>
      each.trim(),
    );
    const at = all.indexOf(heading);
    assert.ok(at >= 0, `The Swiss has no column headed ${heading}.`);
    assert.equal(
      await said(rowOf(this, name).locator(".swiss-total").nth(at)),
      value,
    );
  },
);

// Its results ----------------------------------------------------------------------

// As it is shown: the opponent's short name and the margin.
Then(
  /^the (first|second|third) result of "(.*)" in the Swiss is "(.*)"$/,
  async function (this: WebWorld, which: string, name: string, words: string) {
    const result = resultOf(this, which, name);
    const opponent = await said(result.locator("[aria-hidden='true']"));
    const margin = await said(result.locator(".swiss-margin"));
    assert.equal(`${opponent} ${margin}`, words);
  },
);

Then(
  /^the (first|second|third) result of "(.*)" in the Swiss names "(.*)" in full$/,
  async function (
    this: WebWorld,
    which: string,
    name: string,
    opponent: string,
  ) {
    assert.equal(
      await said(
        resultOf(this, which, name).locator(
          ".swiss-result-opponent .visually-hidden",
        ),
      ),
      opponent,
    );
  },
);

Then(
  /^the (first|second|third) result of "(.*)" in the Swiss is (not )?marked as withdrawn$/,
  async function (
    this: WebWorld,
    which: string,
    name: string,
    not: string | null,
  ) {
    assert.equal(
      (await resultOf(this, which, name).getAttribute("data-withdrawn")) !==
        null,
      not === null,
    );
  },
);

Then(
  /^the (first|second|third) result of "(.*)" in the Swiss is struck through$/,
  async function (this: WebWorld, which: string, name: string) {
    assert.ok(
      await isStruckThrough(resultOf(this, which, name)),
      "The result is not struck through.",
    );
  },
);

Then(
  /^the (first|second|third) result of "(.*)" in the Swiss is marked as (won|lost|drawn)$/,
  async function (this: WebWorld, which: string, name: string, result: string) {
    assert.match(
      (await resultOf(this, which, name).getAttribute("class")) ?? "",
      new RegExp(`\\bswiss-${result}\\b`),
    );
  },
);

Then(
  "the row of {string} in the Swiss has its name on one line",
  async function (this: WebWorld, name: string) {
    await assertOnOneLine(
      rowOf(this, name).locator(".player-name"),
      "The name",
    );
  },
);

Then(
  "the row of {string} in the Swiss has its meta-data on one line",
  async function (this: WebWorld, name: string) {
    const row = rowOf(this, name);
    await assertOnOneLine(
      row.locator(".player-representing"),
      "What they represent",
    );
    await assertBeside(
      row.locator(".player-flag"),
      row.locator(".player-representing"),
      "Their flag",
    );
  },
);

Then(
  "the row of {string} in the Swiss has its meta-data below its name",
  async function (this: WebWorld, name: string) {
    const row = rowOf(this, name);
    await assertBelow(
      row.locator(".player-meta-data"),
      row.locator(".player-name"),
      "The meta-data",
    );
  },
);

Then(
  "the row of {string} in the Swiss has its meta-data beside its name",
  async function (this: WebWorld, name: string) {
    const row = rowOf(this, name);
    await assertBeside(
      row.locator(".player-meta-data"),
      row.locator(".player-name"),
      "The meta-data",
    );
  },
);

Then(
  "the row of {string} in the Swiss has the mark that they have withdrawn above its meta-data",
  async function (this: WebWorld, name: string) {
    const row = rowOf(this, name);
    await assertAbove(
      row.locator(".swiss-withdrawn"),
      row.locator(".player-meta-data"),
      "The mark",
    );
  },
);

Then(
  /^the row of "(.*)" in the Swiss (has|does not have) its meta-data struck through$/,
  async function (this: WebWorld, name: string, has: string) {
    assert.equal(
      await isMetaDataStruckThrough(
        rowOf(this, name).locator(".player-meta-data"),
      ),
      has === "has",
    );
  },
);
