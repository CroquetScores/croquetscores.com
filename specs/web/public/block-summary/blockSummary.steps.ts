import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";
import { isStruckThrough } from "../../support/struckThrough.js";
import { headingOf, linesOf } from "../../support/headings.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again. The
// views it offers are said with the grid's (block.steps.ts).

const places = ["first", "second", "third", "fourth"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const summaryOf = (world: WebWorld): Locator =>
  world.browserPage.locator("main .block-summary");

const rows = (world: WebWorld): Locator =>
  summaryOf(world).locator("tbody > tr");

const headings = (world: WebWorld): Locator =>
  summaryOf(world).locator("thead .block-summary-heading");

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const rowOf = (world: WebWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".player-name", { hasText: name }),
  });

When(
  "the name of {string} in the summary is pressed",
  async function (this: WebWorld, name: string) {
    // A block's summary or a knockout's, whichever the page draws.
    await this.browserPage
      .locator("main :is(.block-summary, .knockout-summary) .player-name", {
        hasText: name,
      })
      .first()
      .click();
    await this.browserPage.waitForLoadState();
  },
);

// Its rows -----------------------------------------------------------------------

Then(
  /^the (first|second|third) row of the summary is "(.*)"$/,
  async function (this: WebWorld, which: string, name: string) {
    assert.equal(
      await said(rows(this).nth(placeOf(which)).locator(".player-name")),
      name,
    );
  },
);

Then(
  "the row of {string} in the summary says they represent {string}",
  async function (this: WebWorld, name: string, representing: string) {
    assert.equal(
      await said(rowOf(this, name).locator(".player-representing")),
      `(${representing})`,
    );
  },
);

Then(
  /^the row of "(.*)" in the summary (does not say|says) they have withdrawn$/,
  async function (this: WebWorld, name: string, says: string) {
    assert.equal(
      await rowOf(this, name).locator(".block-summary-withdrawn").count(),
      says === "says" ? 1 : 0,
    );
  },
);

Then(
  /^the name of "(.*)" in the summary is (not )?struck through$/,
  async function (this: WebWorld, name: string, not: string | null) {
    assert.equal(
      await isStruckThrough(rowOf(this, name).locator(".player-name")),
      not === null,
    );
  },
);

// How a name breaks across lines -------------------------------------------------

// A space a line may break at is an ordinary one; a no-break space, which is
// what holds a name together, is not matched by a plain " ".
const breakable = async (found: Locator): Promise<string> =>
  (await found.textContent()) ?? "";

Then(
  /^the name of "(.*)" in the summary has (\d+) places? to break a line$/,
  async function (this: WebWorld, name: string, count: string) {
    const text = await breakable(rowOf(this, name).locator(".player-name"));
    assert.equal(text.split(" ").length - 1, Number(count));
  },
);

Then(
  /^the name of "(.*)" in the summary breaks after its ampersand$/,
  async function (this: WebWorld, name: string) {
    const text = await breakable(rowOf(this, name).locator(".player-name"));
    assert.ok(text.includes("& "), `"${text}" does not break after "&".`);
  },
);

// A word broken part-way along is drawn on two lines, so the box of its text
// has two tops where an unbroken one has one. The page is asked as a whole
// expression, since a function given as text is not called.
Then(
  "no word of any name in the summary is broken",
  async function (this: WebWorld) {
    const broken = await this.browserPage.evaluate(`(() => {
      const split = [];
      for (const name of document.querySelectorAll("main .block-summary .player-name")) {
        const texts = document.createTreeWalker(name, NodeFilter.SHOW_TEXT);
        for (let at = texts.nextNode(); at !== null; at = texts.nextNode()) {
          for (const word of (at.textContent ?? "").matchAll(/\\S+/gu)) {
            const range = document.createRange();
            range.setStart(at, word.index);
            range.setEnd(at, word.index + word[0].length);
            const tops = new Set(
              [...range.getClientRects()].map((box) => Math.round(box.top)),
            );
            if (tops.size > 1) split.push(word[0]);
          }
        }
      }
      return split;
    })()`);
    assert.deepEqual(broken, []);
  },
);

Then("the summary scrolls sideways", async function (this: WebWorld) {
  const scrolls = await this.browserPage.evaluate(
    `(() => {
      const found = document.querySelector("main .block-summary-scroll");
      return found !== null && found.scrollWidth > found.clientWidth;
    })()`,
  );
  assert.ok(scrolls, "The summary fits the window, so has no need to scroll.");
});

Then("the page does not scroll sideways", async function (this: WebWorld) {
  const fits = await this.browserPage.evaluate(
    "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
  );
  assert.ok(fits, "The page is wider than the screen.");
});

// Its columns --------------------------------------------------------------------

Then(
  /^the (first|second|third|fourth) column of the summary is headed "(.*)"$/,
  async function (this: WebWorld, which: string, heading: string) {
    assert.equal(await headingOf(headings(this).nth(placeOf(which))), heading);
  },
);

Then(
  /^the (first|second|third) column of the summary is headed in (\d+) lines?$/,
  async function (this: WebWorld, which: string, count: string) {
    assert.equal(
      (await linesOf(headings(this).nth(placeOf(which)))).length,
      Number(count),
    );
  },
);

Then(
  "the {string} of {string} in the summary are {string}",
  async function (
    this: WebWorld,
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
