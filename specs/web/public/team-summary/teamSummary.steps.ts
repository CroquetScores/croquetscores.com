import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";

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
  "ninth",
];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const tableOf = (world: WebWorld): Locator =>
  world.browserPage.locator("main .team-summary");

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const rowOf = (world: WebWorld, team: string): Locator =>
  tableOf(world)
    .locator("tbody > tr")
    .filter({
      has: world.browserPage.locator(".team-summary-team", {
        hasText: new RegExp(`^${team}$`),
      }),
    });

Then(
  /^the (first|second|third) team of the summary is "(.*)"$/,
  async function (this: WebWorld, which: string, team: string) {
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
  async function (this: WebWorld, team: string) {
    await tableOf(this).waitFor();
    assert.equal(await rowOf(this, team).count(), 0);
  },
);

// A column's group is the one whose span takes it in, counted along the row of
// groups as the columns are along the row beneath it.
Then(
  "the teams' summary has no column headed {string} under {string}",
  async function (this: WebWorld, heading: string, group: string) {
    const headings = await tableOf(this).locator(".team-summary-heading").all();
    const groups = await tableOf(this).locator(".team-summary-group").all();
    let reached = 0;
    let at = 0;
    for (const each of groups) {
      reached += Number((await each.getAttribute("colspan")) ?? "1");
      for (; at < reached; at += 1) {
        assert.ok(
          (await said(each)) !== group ||
            (await said(headings[at]!)) !== heading,
          `There is a column headed ${heading} under ${group}.`,
        );
      }
    }
  },
);

Then(
  "the teams' summary has no column under {string}",
  async function (this: WebWorld, group: string) {
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
  /^the (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth) column of the teams' summary is headed "(.*)" under "(.*)"$/,
  async function (
    this: WebWorld,
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
  /^the (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth) number of "(.*)" in the summary is "(.*)"$/,
  async function (this: WebWorld, which: string, team: string, number: string) {
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
  async function (this: WebWorld, name: string) {
    assert.equal(
      await said(tableOf(this).locator("thead .team-summary-corner")),
      name,
    );
  },
);

// Left for whatever reads the page aloud, but not to be seen.
Then("the page's heading is not shown", async function (this: WebWorld) {
  const box = await this.browserPage.locator("main h1").boundingBox();
  assert.ok(
    box === null || box.width <= 1 || box.height <= 1,
    "The page's heading is shown.",
  );
});
