import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { boxOf, list, rows, type List } from "../../support/tournamentLists.js";

// What is the home page's own. What its lists share with a year's is said in
// specs/web-units/support/tournamentLists.ts.

When(
  /^the home page is opened for the (country|sport) "(.*)"$/,
  async function (this: WebWorld, chosen: string, code: string) {
    await this.browserPage.goto(
      `${this.baseUrl!}/?${new URLSearchParams({ [chosen]: code }).toString()}`,
    );
  },
);

When(
  /^the home page is opened asking to remember the (country|sport) "(.*)"$/,
  async function (this: WebWorld, chosen: string, code: string) {
    await this.browserPage.goto(
      `${this.baseUrl!}/?${new URLSearchParams({ [chosen]: code, keep: "filter" }).toString()}`,
    );
  },
);

Then(
  "{string} comes before {string}",
  async function (this: WebWorld, first: string, second: string) {
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
  async function (this: WebWorld, count: string) {
    assert.equal(
      await rows(this, "upcoming tournaments").count(),
      Number(count),
    );
  },
);

Then(
  "the upcoming tournaments are followed by {string}",
  async function (this: WebWorld, words: string) {
    const last = list(this, "upcoming tournaments").locator(
      ":scope > :last-child",
    );
    assert.equal(await last.textContent(), words);
    assert.equal(await last.locator("a").count(), 1);
  },
);

Then(
  "the upcoming tournaments are below the recent results",
  async function (this: WebWorld) {
    const recent = await boxOf(list(this, "recent results"));
    const upcoming = await boxOf(list(this, "upcoming tournaments"));
    assert.ok(
      upcoming.y >= recent.y + recent.height,
      `They start ${String(upcoming.y)} pixels down.`,
    );
  },
);

// The pop-up cannot be drawn without a screen, so what is read is the height
// the stylesheet gives it, which is what Chrome draws it at.
When("the country list is opened", async function (this: WebWorld) {
  await this.browserPage.locator("#filter-country").focus();
});

Then(
  /^the country list is no taller than (\d+) rem$/,
  async function (this: WebWorld, rems: string) {
    const tallest = await this.browserPage.evaluate<string>(
      `getComputedStyle(document.querySelector("#filter-country"), "::picker(select)").maxHeight`,
    );
    const root = await this.browserPage.evaluate<string>(
      "getComputedStyle(document.documentElement).fontSize",
    );
    assert.ok(
      tallest.endsWith("px"),
      `The list has no height of its own: ${tallest}.`,
    );
    assert.ok(
      parseFloat(tallest) <= Number(rems) * parseFloat(root),
      `The list may be ${tallest} tall.`,
    );
  },
);

Then(
  "the country is chosen from a drop-down list",
  async function (this: WebWorld) {
    const select = this.browserPage.locator("#filter-country");
    assert.equal(
      await this.browserPage.evaluate<string>(
        `document.querySelector("#filter-country").tagName`,
      ),
      "SELECT",
    );
    assert.equal(await select.getAttribute("size"), null);
    assert.equal(await select.getAttribute("multiple"), null);
    assert.ok((await select.locator("option").count()) > 1);
  },
);

// What a device might hold from before the website changed what it offers, or
// from a reader's own tampering, which a page is not to be refused for.
Given(
  /^the device remembers "(.*)" as the (country|region|sport)$/,
  async function (this: WebWorld, code: string, chosen: string) {
    await this.browserPage.context().addCookies([
      {
        name: "filter",
        value: new URLSearchParams({ [chosen]: code }).toString(),
        url: this.baseUrl!,
      },
    ]);
  },
);

// The widths of the two lists' columns are compared as they are drawn, to a
// pixel, since a column is as wide as the cells' padding and the browser's
// rounding make it and not as the stylesheet says.
const headingOf = (world: WebWorld, name: List, column: string) =>
  list(world, name).locator("thead th", {
    hasText: new RegExp(`${column}$`),
  });

Then(
  /^the column "(.*)" of the (recent results|upcoming tournaments) is as wide as that of the (recent results|upcoming tournaments)$/,
  async function (this: WebWorld, column: string, one: List, other: List) {
    const first = (await boxOf(headingOf(this, one, column))).width;
    const second = (await boxOf(headingOf(this, other, column))).width;
    assert.ok(
      Math.abs(first - second) <= 1,
      `They are ${String(first)} and ${String(second)} pixels wide.`,
    );
  },
);

Then(
  /^the names of the (recent results|upcoming tournaments) begin where those of the (recent results|upcoming tournaments) do$/,
  async function (this: WebWorld, one: List, other: List) {
    const first = (await boxOf(headingOf(this, one, "Name"))).x;
    const second = (await boxOf(headingOf(this, other, "Name"))).x;
    assert.ok(
      Math.abs(first - second) <= 1,
      `They begin ${String(first)} and ${String(second)} pixels across.`,
    );
  },
);

Then(
  /^the dates of the (recent results|upcoming tournaments) fit their column$/,
  async function (this: WebWorld, name: List) {
    const cell = list(this, name).locator(".tournament-dates").first();
    const [needed, given] = await cell.evaluate((element) => {
      const measured = element as unknown as {
        scrollWidth: number;
        clientWidth: number;
      };
      return [measured.scrollWidth, measured.clientWidth];
    });
    assert.ok(
      needed <= given,
      `They need ${String(needed)} of ${String(given)}.`,
    );
  },
);
