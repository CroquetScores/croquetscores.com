import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { boxOf, list, rows } from "../../support/tournamentLists.js";

// What is the home page's own. What its lists share with a year's is said in
// specs/web/support/tournamentLists.ts.

When(
  /^the home page is opened for the (country|sport) "(.*)"$/,
  async function (this: SpecWorld, chosen: string, code: string) {
    await this.browserPage.goto(
      `${this.baseUrl!}/?${new URLSearchParams({ [chosen]: code }).toString()}`,
    );
  },
);

Then(
  "{string} comes before {string}",
  async function (this: SpecWorld, first: string, second: string) {
    const said = await this.browserPage
      .locator("main")
      .getByRole("heading")
      .allTextContents();
    const at = said.indexOf(first);
    assert.ok(at >= 0, `There is no heading ${first}.`);
    assert.ok(said.indexOf(second) > at, `${second} does not come after it.`);
  },
);

Then(
  /^(\d+) upcoming tournaments? (?:is|are) listed$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(
      await rows(this, "upcoming tournaments").count(),
      Number(count),
    );
  },
);

Then(
  "the upcoming tournaments are followed by {string}",
  async function (this: SpecWorld, words: string) {
    const last = list(this, "upcoming tournaments").locator(
      ":scope > :last-child",
    );
    assert.equal(await last.textContent(), words);
    assert.equal(await last.locator("a").count(), 1);
  },
);

Then(
  "the upcoming tournaments are to the right of the recent results",
  async function (this: SpecWorld) {
    const recent = await boxOf(list(this, "recent results"));
    const upcoming = await boxOf(list(this, "upcoming tournaments"));
    assert.ok(
      upcoming.x >= recent.x + recent.width,
      `They start ${String(upcoming.x)} pixels across.`,
    );
  },
);

Then(
  "the upcoming tournaments are below the recent results",
  async function (this: SpecWorld) {
    const recent = await boxOf(list(this, "recent results"));
    const upcoming = await boxOf(list(this, "upcoming tournaments"));
    assert.ok(
      upcoming.y >= recent.y + recent.height,
      `They start ${String(upcoming.y)} pixels down.`,
    );
  },
);
