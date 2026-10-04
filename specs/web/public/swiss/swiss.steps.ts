import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

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

const tableOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .swiss-table");

const rows = (world: SpecWorld): Locator =>
  tableOf(world).locator("tbody > tr");

const headings = (world: SpecWorld): Locator =>
  tableOf(world).locator("thead .swiss-heading");

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const rowOf = (world: SpecWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".player-name", { hasText: name }),
  });

const resultOf = (world: SpecWorld, which: string, name: string): Locator =>
  rowOf(world, name).locator(".swiss-result").nth(placeOf(which));

When(
  "the name of {string} in the Swiss is pressed",
  async function (this: SpecWorld, name: string) {
    await rowOf(this, name).locator(".player-name").click();
    await this.browserPage.waitForLoadState();
  },
);

// Its rows -----------------------------------------------------------------------

Then(
  /^the (first|second|third) row of the Swiss is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      await said(rows(this).nth(placeOf(which)).locator(".player-name")),
      name,
    );
  },
);

Then(
  "the row of {string} in the Swiss says they represent {string}",
  async function (this: SpecWorld, name: string, representing: string) {
    assert.equal(
      await said(rowOf(this, name).locator(".player-representing")),
      `(${representing})`,
    );
  },
);

Then(
  "the row of {string} in the Swiss says they have withdrawn",
  async function (this: SpecWorld, name: string) {
    assert.equal(
      await rowOf(this, name).locator(".swiss-withdrawn").count(),
      1,
    );
  },
);

// Its columns --------------------------------------------------------------------

Then(
  /^the (first|second|third|fourth) column of the Swiss is headed "(.*)"$/,
  async function (this: SpecWorld, which: string, heading: string) {
    assert.equal(await said(headings(this).nth(placeOf(which))), heading);
  },
);

Then(
  "the Swiss has {int} columns beside its players",
  async function (this: SpecWorld, count: number) {
    assert.equal(await headings(this).count(), count);
  },
);

Then(
  "the {string} of {string} in the Swiss are {string}",
  async function (
    this: SpecWorld,
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
  async function (this: SpecWorld, which: string, name: string, words: string) {
    const result = resultOf(this, which, name);
    const opponent = await said(result.locator("[aria-hidden='true']"));
    const margin = await said(result.locator(".swiss-margin"));
    assert.equal(`${opponent} ${margin}`, words);
  },
);

Then(
  /^the (first|second|third) result of "(.*)" in the Swiss names "(.*)" in full$/,
  async function (
    this: SpecWorld,
    which: string,
    name: string,
    opponent: string,
  ) {
    assert.equal(
      await said(resultOf(this, which, name).locator(".visually-hidden")),
      opponent,
    );
  },
);

Then(
  /^the (first|second|third) result of "(.*)" in the Swiss is marked as (won|lost|drawn)$/,
  async function (
    this: SpecWorld,
    which: string,
    name: string,
    result: string,
  ) {
    assert.match(
      (await resultOf(this, which, name).getAttribute("class")) ?? "",
      new RegExp(`\\bswiss-${result}\\b`),
    );
  },
);
