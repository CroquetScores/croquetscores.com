import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { headingOf, linesOf } from "../../support/headings.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again. The
// views it offers are said with the grid's (block.steps.ts).

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const summaryOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .block-summary");

const rows = (world: SpecWorld): Locator =>
  summaryOf(world).locator("tbody > tr");

const headings = (world: SpecWorld): Locator =>
  summaryOf(world).locator("thead .block-summary-heading");

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const rowOf = (world: SpecWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".player-name", { hasText: name }),
  });

When(
  "the name of {string} in the summary is pressed",
  async function (this: SpecWorld, name: string) {
    await rowOf(this, name).locator(".player-name").click();
    await this.browserPage.waitForLoadState();
  },
);

// Its rows -----------------------------------------------------------------------

Then(
  /^the (first|second|third) row of the summary is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      await said(rows(this).nth(placeOf(which)).locator(".player-name")),
      name,
    );
  },
);

Then(
  "the row of {string} in the summary says they represent {string}",
  async function (this: SpecWorld, name: string, representing: string) {
    assert.equal(
      await said(rowOf(this, name).locator(".player-representing")),
      `(${representing})`,
    );
  },
);

Then(
  /^the row of "(.*)" in the summary (does not say|says) they have withdrawn$/,
  async function (this: SpecWorld, name: string, says: string) {
    assert.equal(
      await rowOf(this, name).locator(".block-summary-withdrawn").count(),
      says === "says" ? 1 : 0,
    );
  },
);

// Its columns --------------------------------------------------------------------

Then(
  /^the (first|second|third) column of the summary is headed "(.*)"$/,
  async function (this: SpecWorld, which: string, heading: string) {
    assert.equal(await headingOf(headings(this).nth(placeOf(which))), heading);
  },
);

Then(
  /^the (first|second|third) column of the summary is headed in (\d+) lines?$/,
  async function (this: SpecWorld, which: string, count: string) {
    assert.equal(
      (await linesOf(headings(this).nth(placeOf(which)))).length,
      Number(count),
    );
  },
);

Then(
  "the {string} of {string} in the summary are {string}",
  async function (
    this: SpecWorld,
    heading: string,
    name: string,
    value: string,
  ) {
    const all = await Promise.all((await headings(this).all()).map(headingOf));
    const at = all.indexOf(heading);
    assert.ok(at >= 0, `The summary has no column headed ${heading}.`);
    assert.equal(
      await said(rowOf(this, name).locator(".block-summary-total").nth(at)),
      value,
    );
  },
);
