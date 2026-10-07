import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

const places = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const tableOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .team-summary");

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const rowOf = (world: SpecWorld, team: string): Locator =>
  tableOf(world)
    .locator("tbody > tr")
    .filter({
      has: world.browserPage.locator(".team-summary-team", {
        hasText: new RegExp(`^${team}$`),
      }),
    });

Then(
  /^the (first|second|third) team of the summary is "(.*)"$/,
  async function (this: SpecWorld, which: string, team: string) {
    assert.equal(
      await said(
        tableOf(this)
          .locator("tbody > tr")
          .nth(placeOf(which))
          .locator(".team-summary-team"),
      ),
      team,
    );
  },
);

// Waited for by the table, which is drawn with the page, so that a row looked
// for too soon is not taken for one that is not there.
Then(
  "the team {string} is not in the summary",
  async function (this: SpecWorld, team: string) {
    await tableOf(this).waitFor();
    assert.equal(await rowOf(this, team).count(), 0);
  },
);

// A column's group is the one whose span takes it in, counted along the row of
// groups as the columns are along the row beneath it.
Then(
  "the teams' summary has no column under {string}",
  async function (this: SpecWorld, group: string) {
    assert.equal(
      await tableOf(this)
        .locator(".team-summary-group")
        .filter({ hasText: new RegExp(`^${group}$`) })
        .count(),
      0,
    );
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh|eighth) column of the teams' summary is headed "(.*)" under "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    heading: string,
    group: string,
  ) {
    const at = placeOf(which);
    assert.equal(
      await said(tableOf(this).locator(".team-summary-heading").nth(at)),
      heading,
    );
    const groups = await tableOf(this).locator(".team-summary-group").all();
    let reached = 0;
    let under: string | undefined;
    for (const each of groups) {
      reached += Number((await each.getAttribute("colspan")) ?? "1");
      if (at < reached) {
        under = await said(each);
        break;
      }
    }
    assert.equal(under, group);
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh|eighth) number of "(.*)" in the summary is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    team: string,
    number: string,
  ) {
    assert.equal(
      await said(
        rowOf(this, team).locator(".team-summary-number").nth(placeOf(which)),
      ),
      number,
    );
  },
);

Then(
  "the summary's first heading is {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal(
      await said(tableOf(this).locator("thead .team-summary-corner")),
      name,
    );
  },
);

// Left for whatever reads the page aloud, but not to be seen.
Then("the page's heading is not shown", async function (this: SpecWorld) {
  const box = await this.browserPage.locator("main h1").boundingBox();
  assert.ok(
    box === null || box.width <= 1 || box.height <= 1,
    "The page's heading is shown.",
  );
});
