import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { isStruckThrough, isUnderlined } from "../../support/struckThrough.js";
import { headingOf, linesOf } from "../../support/headings.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.
//
// A cell is found as a reader finds it: along the row of one player to the
// column of the other. A row's heading and the corner above the rows' headings
// are each the first cell of their line, so the column a player is in is the
// same place along their row.

const places = ["first", "second", "third", "fourth"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const gridOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .block-grid");

const rows = (world: SpecWorld): Locator => gridOf(world).locator("tbody > tr");

const columnHeadings = (world: SpecWorld): Locator =>
  gridOf(world).locator("thead .block-grid-initials");

const totalHeadings = (world: SpecWorld): Locator =>
  gridOf(world).locator("thead .block-grid-total-heading");

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const rowOf = (world: SpecWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".player-name", {
      hasText: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    }),
  });

// Where `name` is along every line of the grid: their column's place among
// the players', and one more along a line, past the row's heading.
const columnOf = async (world: SpecWorld, name: string): Promise<number> => {
  const names = await columnHeadings(world)
    .locator(".visually-hidden")
    .allTextContents();
  const at = names.indexOf(name);
  assert.ok(at >= 0, `${name} has no column.`);
  return at + 1;
};

const cellWhere = async (
  world: SpecWorld,
  player: string,
  opponent: string,
): Promise<Locator> =>
  rowOf(world, player)
    .locator(":scope > th, :scope > td")
    .nth(await columnOf(world, opponent));

const scoreWhere = async (
  world: SpecWorld,
  which: string,
  player: string,
  opponent: string,
): Promise<Locator> =>
  (await cellWhere(world, player, opponent))
    .locator(".block-grid-score")
    .nth(placeOf(which));

// What a page's own scripting would see of an element, which the specs are
// not compiled to know.
interface InThePage {
  getComputedStyle(element: unknown): {
    readonly backgroundColor: string;
    readonly overflowX: string;
  };
}

interface Scrolled {
  readonly scrollWidth: number;
  readonly clientWidth: number;
}

const backgroundOf = (found: Locator): Promise<string> =>
  found.evaluate(
    (element: unknown) =>
      (globalThis as unknown as InThePage).getComputedStyle(element)
        .backgroundColor,
  );

When(
  "the name of {string} in the grid is pressed",
  async function (this: SpecWorld, name: string) {
    // A block's grid or a knockout's, whichever the page draws.
    await this.browserPage
      .locator("main :is(.block-grid, .knockout) .player-name", {
        hasText: name,
      })
      .first()
      .click();
    await this.browserPage.waitForLoadState();
  },
);

// Its rows -----------------------------------------------------------------------

Then(
  /^the (first|second|third) row of the grid is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      await said(rows(this).nth(placeOf(which)).locator(".player-name")),
      name,
    );
  },
);

Then(
  "the row of {string} in the grid says they represent {string}",
  async function (this: SpecWorld, name: string, representing: string) {
    assert.equal(
      await said(rowOf(this, name).locator(".player-representing")),
      `(${representing})`,
    );
  },
);

Then(
  /^the row of "(.*)" in the grid (does not say|says) they have withdrawn$/,
  async function (this: SpecWorld, name: string, says: string) {
    assert.equal(
      await rowOf(this, name).locator(".block-grid-withdrawn").count(),
      says === "says" ? 1 : 0,
    );
  },
);

// Its columns --------------------------------------------------------------------

Then(
  /^the (first|second|third) column of the grid is headed "(.*)"$/,
  async function (this: SpecWorld, which: string, initials: string) {
    assert.equal(
      await said(
        columnHeadings(this)
          .nth(placeOf(which))
          .locator("[aria-hidden='true']"),
      ),
      initials,
    );
  },
);

// Named as whatever reads the page aloud names it.
Then(
  /^the (first|second|third) column of the grid is named "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      await columnHeadings(this)
        .nth(placeOf(which))
        .and(this.browserPage.getByRole("columnheader", { name, exact: true }))
        .count(),
      1,
    );
  },
);

// Its cells ----------------------------------------------------------------------

Then(
  "the cell where {string} meets {string} is blacked out",
  async function (this: SpecWorld, player: string, opponent: string) {
    const cell = await cellWhere(this, player, opponent);
    assert.match(
      (await cell.getAttribute("class")) ?? "",
      /\bblock-grid-self\b/,
      "The cell is not blacked out.",
    );
    // Filled, where the row's heading beside it is not.
    assert.notEqual(
      await backgroundOf(cell),
      await backgroundOf(rowOf(this, player).locator(".block-grid-player")),
      "The cell is the colour of the cells beside it.",
    );
  },
);

Then(
  "the cell where {string} meets {string} is empty",
  async function (this: SpecWorld, player: string, opponent: string) {
    assert.equal(
      await (
        await cellWhere(this, player, opponent)
      )
        .locator(".block-grid-score")
        .count(),
      0,
    );
  },
);

Then(
  /^the (first|second|third) score where "(.*)" meets "(.*)" is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    player: string,
    opponent: string,
    score: string,
  ) {
    assert.equal(
      await said(
        (await scoreWhere(this, which, player, opponent)).locator(
          ".block-grid-points",
        ),
      ),
      score,
    );
  },
);

// Marked by more than colour: by a word said aloud, which is the result's, and
// by a weight or slant, which no other result has.
Then(
  /^the (first|second|third) score where "(.*)" meets "(.*)" is (not )?marked as withdrawn$/,
  async function (
    this: SpecWorld,
    which: string,
    player: string,
    opponent: string,
    not: string | null,
  ) {
    const score = await scoreWhere(this, which, player, opponent);
    assert.equal(
      (await score.getAttribute("data-withdrawn")) !== null,
      not === null,
    );
  },
);

Then(
  /^the name of "(.*)" in the grid is underlined$/,
  async function (this: SpecWorld, name: string) {
    assert.ok(
      await isUnderlined(rowOf(this, name).locator(".player-name")),
      "The name is not underlined.",
    );
  },
);

Then(
  /^the name of "(.*)" in the grid is (not )?struck through$/,
  async function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(
      await isStruckThrough(rowOf(this, name).locator(".player-name")),
      not === null,
    );
  },
);

Then(
  /^the (first|second|third) score where "(.*)" meets "(.*)" is struck through$/,
  async function (
    this: SpecWorld,
    which: string,
    player: string,
    opponent: string,
  ) {
    const score = await scoreWhere(this, which, player, opponent);
    assert.ok(await isStruckThrough(score), "The score is not struck through.");
  },
);

Then(
  /^the (first|second|third) score where "(.*)" meets "(.*)" is marked as (won|lost|drawn)$/,
  async function (
    this: SpecWorld,
    which: string,
    player: string,
    opponent: string,
    result: string,
  ) {
    const score = await scoreWhere(this, which, player, opponent);
    assert.match(
      (await score.getAttribute("class")) ?? "",
      new RegExp(`\\bblock-grid-${result}\\b`),
      `The score is not marked as ${result}.`,
    );

    assert.notEqual(
      await said(score.locator(".visually-hidden")),
      "",
      "Nothing is said aloud of the result.",
    );
  },
);

// Its totals ---------------------------------------------------------------------

Then(
  "the grid has the column {string}",
  async function (this: SpecWorld, heading: string) {
    const headings = await Promise.all(
      (await totalHeadings(this).all()).map(headingOf),
    );
    assert.equal(headings.filter((each) => each === heading).length, 1);
  },
);

Then(
  /^the (first|second|third|fourth) total of the grid is headed "(.*)"$/,
  async function (this: SpecWorld, which: string, heading: string) {
    assert.equal(
      await headingOf(totalHeadings(this).nth(placeOf(which))),
      heading,
    );
  },
);

Then(
  /^the (first|second|third|fourth) total of the grid is headed in (\d+) lines?$/,
  async function (this: SpecWorld, which: string, count: string) {
    assert.equal(
      (await linesOf(totalHeadings(this).nth(placeOf(which)))).length,
      Number(count),
    );
  },
);

Then(
  "the grid has {int} totals",
  async function (this: SpecWorld, count: number) {
    assert.equal(await totalHeadings(this).count(), count);
  },
);

Then(
  "the {string} of {string} in the grid are {string}",
  async function (
    this: SpecWorld,
    heading: string,
    name: string,
    value: string,
  ) {
    const headings = await Promise.all(
      (await totalHeadings(this).all()).map(headingOf),
    );
    const at = headings.indexOf(heading);
    assert.ok(at >= 0, `The grid has no total headed ${heading}.`);
    assert.equal(
      await said(rowOf(this, name).locator(".block-grid-total").nth(at)),
      value,
    );
  },
);

// Across a phone -----------------------------------------------------------------

Then("the grid can be scrolled across", async function (this: SpecWorld) {
  // A block's grid or a knockout's, whichever the page draws.
  const scroller = this.browserPage.locator(
    "main :is(.block-grid-scroll, .knockout-scroll)",
  );
  const { scrollWidth, clientWidth } = await scroller.evaluate(
    // Read out in the page, since the element itself does not come back.
    (element: unknown) => {
      const { scrollWidth, clientWidth } = element as Scrolled;
      return { scrollWidth, clientWidth };
    },
  );
  assert.ok(scrollWidth > clientWidth, "The grid is no wider than its place.");
  const overflow = await scroller.evaluate(
    (element: unknown) =>
      (globalThis as unknown as InThePage).getComputedStyle(element).overflowX,
  );
  assert.ok(
    overflow === "auto" || overflow === "scroll",
    `It overflows as ${overflow}.`,
  );
});

// The views offered ----------------------------------------------------------------
//
// Said here for all three of a block's views, which offer the same three.

const viewsOffered = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .competition-views .competition-view");

const viewCalled = (world: SpecWorld, name: string): Locator =>
  viewsOffered(world).filter({ hasText: new RegExp(`^${name}$`) });

Then(
  /^the (first|second|third) view offered is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(await said(viewsOffered(this).nth(placeOf(which))), name);
  },
);

Then(
  /^the view "(.*)" is (not )?marked as the one being read$/,
  async function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(
      await viewCalled(this, name).getAttribute("aria-current"),
      not === null ? "page" : null,
    );
  },
);

When(
  "the view {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await viewCalled(this, name).click();
    await this.browserPage.waitForLoadState();
  },
);

// The view chosen ------------------------------------------------------------------

const viewCookie = async (world: SpecWorld) => {
  const cookies = await world.browserContext!.cookies();
  const cookie = cookies.find((candidate) => candidate.name === "blockView");
  assert.ok(cookie !== undefined, "No view was kept.");
  return cookie;
};

Then(
  /^the view chosen is kept in a cookie marked (Secure|HttpOnly)$/,
  async function (this: SpecWorld, mark: string) {
    const cookie = await viewCookie(this);
    assert.equal(mark === "Secure" ? cookie.secure : cookie.httpOnly, true);
  },
);
