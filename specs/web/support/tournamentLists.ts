// What the pages that list a website's tournaments share, as their scenarios
// say it: the home page's two lists (home.feature) and a year's
// (year.feature), each a table, narrowed together by a filter, with the years
// there are tournaments in as the secondary navigation
// (src/web/public/tournamentLists.ts). Here rather than beside either
// feature's steps because both say the same words, and two definitions of the
// same words leave Cucumber unable to choose between them.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { Countries } from "../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import {
  load,
  tournamentNamed,
} from "../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../support/world.js";
import { unmarkedWithin } from "./marks.js";
import { changeTournament } from "./tournaments.js";

// The pages are drawn by the server, with no scripting, so what is read is
// there once the page has loaded: nothing here waits for it to be drawn again.

// Each list by the words a scenario names it by, and the name the page gives
// it.
const lists = {
  "recent results": "recent",
  "upcoming tournaments": "upcoming",
  "year's tournaments": "tournaments",
  "sport's tournaments": "tournaments",
} as const;

/** A list as a scenario names it. */
export type List = keyof typeof lists;

const listNamed = (name: string): List => {
  assert.ok(name in lists, `There is no list called the ${name}.`);
  return name as List;
};

/** The list a scenario names, as the page draws it. */
export const list = (world: SpecWorld, name: List): Locator =>
  world.browserPage.locator(
    `main section.tournament-list[data-list="${lists[name]}"]`,
  );

/** The rows of the list a scenario names. */
export const rows = (world: SpecWorld, name: List): Locator =>
  list(world, name).locator("tbody tr");

// The words exactly, rather than any row whose name holds them: "Open" is in
// every tournament's name in these scenarios.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const rowOf = (world: SpecWorld, name: List, tournament: string): Locator =>
  rows(world, name).filter({
    has: world.browserPage.locator(".tournament-name", {
      hasText: exactly(tournament),
    }),
  });

// Every cell of the heading row, the flags' among them, which has no heading.
const headings = (world: SpecWorld, name: List): Locator =>
  list(world, name).locator("thead tr > *");

// A column's heading by its words, which follow the arrow where it has one.
const headingOf = (world: SpecWorld, name: List, column: string): Locator =>
  headings(world, name).filter({
    has: world.browserPage.locator("a", { hasText: new RegExp(`${column}$`) }),
  });

const words = async (heading: Locator): Promise<string> =>
  ((await heading.textContent()) ?? "").replace(/^[↑↓]/, "").trim();

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

// Followed, and waited on until the page it leads to has loaded, so that the
// next step reads that page.
const follow = async (world: SpecWorld, link: Locator): Promise<void> => {
  await link.click();
  await world.browserPage.waitForLoadState();
};

// Pressed where the reader would press it, in the middle of what they can see,
// rather than on whatever element is there: a row's link reaches over the
// whole of it, so it is the link that is pressed wherever on the row that is,
// but for its flag's, which is above it. Waited on until the browser has left
// the page, since a press made with the mouse is not waited on as a link
// clicked is.
const pressAt = async (world: SpecWorld, found: Locator): Promise<void> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  const from = world.browserPage.url();
  await world.browserPage.mouse.click(
    box.x + box.width / 2,
    box.y + box.height / 2,
  );
  await world.browserPage.waitForURL((url) => url.toString() !== from);
  await world.browserPage.waitForLoadState();
};

// The tournaments there are ------------------------------------------------------

// In the region it is in where the country has it, and otherwise the country's
// first, so that a tournament moved to another country is somewhere in it: a
// scenario saying which region goes on to say so.
Given(
  "the tournament {string} is played in the country {string}",
  async function (this: SpecWorld, name: string, code: string) {
    const country = Countries.thereAre.find(code);
    assert.ok(country !== undefined, `There is no country ${code}.`);
    const now = await load(this, tournamentNamed(this, name));
    const region =
      now.region === undefined
        ? undefined
        : country.findRegion(now.region.code)?.code;
    await changeTournament(this, name, {
      country: code,
      region: region ?? country.regions[0]?.code,
    });
  },
);

Given(
  "the tournament {string} is played in the region {string}",
  async function (this: SpecWorld, name: string, region: string) {
    await changeTournament(this, name, { region });
  },
);

// Opening it ----------------------------------------------------------------------

When(
  "the page is opened again at its address",
  async function (this: SpecWorld) {
    await this.browserPage.goto(this.browserPage.url());
  },
);

// What the reader does -------------------------------------------------------------

When(
  /^the column "(.*)" of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is pressed$/,
  async function (this: SpecWorld, column: string, name: string) {
    await follow(this, headingOf(this, listNamed(name), column).locator("a"));
  },
);

When(
  /^the (first|second|third) column of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is pressed$/,
  async function (this: SpecWorld, which: string, name: string) {
    await follow(
      this,
      headings(this, listNamed(name)).nth(placeOf(which)).locator("a"),
    );
  },
);

const parts = {
  date: ".tournament-dates",
  name: ".tournament-name",
  flag: ".tournament-flag img",
} as const;

When(
  /^the (date|name|flag) of "(.*)" in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is pressed$/,
  async function (
    this: SpecWorld,
    part: keyof typeof parts,
    tournament: string,
    name: string,
  ) {
    await pressAt(
      this,
      rowOf(this, listNamed(name), tournament).locator(parts[part]),
    );
  },
);

// The filter's lists by what each narrows by, whatever language its label is
// in.
const filterField = (world: SpecWorld, field: string): Locator =>
  world.browserPage.locator(`form.tournament-filter select[name="${field}"]`);

Given(
  /^"(.*)" is chosen as the (country|region|sport)$/,
  async function (this: SpecWorld, choice: string, field: string) {
    await filterField(this, field).selectOption({ label: choice });
  },
);

const yearsShown = "nav.years .years-row > ul";

When(
  "the drop-down list of years is pressed",
  async function (this: SpecWorld) {
    await this.browserPage
      .locator(`${yearsShown} details > summary`)
      .filter({ visible: true })
      .click();
  },
);

// Wherever the reader can see it: a tab, or in the drop-down list once it is
// open.
const yearLink = (world: SpecWorld, year: number): Locator =>
  world.browserPage
    .locator(`${yearsShown} a`, { hasText: exactly(String(year)) })
    .filter({ visible: true });

When(
  "the year {int} is pressed",
  async function (this: SpecWorld, year: number) {
    await follow(this, yearLink(this, year));
  },
);

// What the page says -------------------------------------------------------------

Then(
  "the content has the heading {string}",
  async function (this: SpecWorld, heading: string) {
    assert.equal(
      await this.browserPage
        .locator("main")
        .getByRole("heading", { name: heading, exact: true })
        .count(),
      1,
    );
  },
);

Then(
  /^"(.*)" is (not )?in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments)$/,
  async function (
    this: SpecWorld,
    tournament: string,
    not: string | null,
    name: string,
  ) {
    assert.equal(
      await rowOf(this, listNamed(name), tournament).count(),
      not === null ? 1 : 0,
    );
  },
);

Then(
  /^the (first|second|third) of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    name: string,
    tournament: string,
  ) {
    assert.equal(
      await rows(this, listNamed(name))
        .nth(placeOf(which))
        .locator(".tournament-name")
        .textContent(),
      tournament,
    );
  },
);

const sayNone = (world: SpecWorld, name: List): Locator =>
  list(world, name).locator(".tournament-list-none");

Then(
  /^the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) say there are none$/,
  async function (this: SpecWorld, name: string) {
    assert.equal(await sayNone(this, listNamed(name)).count(), 1);
  },
);

Then(
  /^the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) do not say there are none$/,
  async function (this: SpecWorld, name: string) {
    assert.equal(await sayNone(this, listNamed(name)).count(), 0);
  },
);

// Its rows -------------------------------------------------------------------------

Then(
  /^the (first|second|third) column of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    name: string,
    column: string,
  ) {
    assert.equal(
      await words(headings(this, listNamed(name)).nth(placeOf(which))),
      column,
    );
  },
);

Then(
  /^the (first|second|third) column of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) has no heading$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      await words(headings(this, listNamed(name)).nth(placeOf(which))),
      "",
    );
  },
);

Then(
  /^the (first|second|third) column of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) cannot be pressed$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      await headings(this, listNamed(name))
        .nth(placeOf(which))
        .locator("a")
        .count(),
      0,
    );
  },
);

Then(
  /^"(.*)" is dated "(.*)" in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments)$/,
  async function (
    this: SpecWorld,
    tournament: string,
    dated: string,
    name: string,
  ) {
    assert.equal(
      await rowOf(this, listNamed(name), tournament)
        .locator(".tournament-dates")
        .textContent(),
      dated,
    );
  },
);

const flagOf = (world: SpecWorld, name: string, tournament: string): Locator =>
  rowOf(world, listNamed(name), tournament).locator(".tournament-flag img");

// The picture the flag is, as the site serves it, under whatever name it is
// given to be kept by.
Then(
  /^"(.*)" shows the flag of "(.*)" in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments)$/,
  async function (
    this: SpecWorld,
    tournament: string,
    code: string,
    name: string,
  ) {
    const flag = Countries.thereAre.find(code)?.flag;
    assert.ok(flag !== undefined, `There is no country ${code}.`);
    const shown =
      (await flagOf(this, name, tournament).getAttribute("src")) ?? "";
    const [kept] = flag.relativePath.split(".");
    assert.ok(
      shown.includes(`/images/${kept!}.`),
      `The flag shown is ${shown}.`,
    );
  },
);

Then(
  /^the flag of "(.*)" in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is named "(.*)"$/,
  async function (
    this: SpecWorld,
    tournament: string,
    name: string,
    country: string,
  ) {
    assert.equal(
      await rowOf(this, listNamed(name), tournament)
        .locator(".tournament-flag a")
        .getAttribute("aria-label"),
      country,
    );
  },
);

Then(
  /^the name of "(.*)" in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is a link$/,
  async function (this: SpecWorld, tournament: string, listed: string) {
    const name = rowOf(this, listNamed(listed), tournament).locator(
      ".tournament-name",
    );
    assert.equal(
      await name.evaluate(
        (element) => (element as unknown as { localName: string }).localName,
      ),
      "a",
    );
    assert.ok((await name.getAttribute("href")) !== null, "It leads nowhere.");
  },
);

Then(
  /^the row of "(.*)" in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) holds (\d+) links?$/,
  async function (
    this: SpecWorld,
    tournament: string,
    name: string,
    count: string,
  ) {
    assert.equal(
      await rowOf(this, listNamed(name), tournament).locator("a").count(),
      Number(count),
    );
  },
);

Then(
  /^the row of "(.*)" in the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is at least (\d+) pixels tall$/,
  async function (
    this: SpecWorld,
    tournament: string,
    name: string,
    least: string,
  ) {
    const box = await rowOf(this, listNamed(name), tournament).boundingBox();
    assert.ok(box !== null, "The row is not on the page.");
    assert.ok(
      box.height >= Number(least),
      `It is ${String(box.height)} pixels tall.`,
    );
  },
);

// Sorting ---------------------------------------------------------------------------

const announced = {
  ascending: "ascending",
  descending: "descending",
  smallest: "ascending",
  largest: "descending",
} as const;

Then(
  /^the column "(.*)" of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is (?:marked|announced) as sorted (?:from the )?(smallest|largest|ascending|descending)$/,
  async function (
    this: SpecWorld,
    column: string,
    name: string,
    how: keyof typeof announced,
  ) {
    assert.equal(
      await headingOf(this, listNamed(name), column).getAttribute("aria-sort"),
      announced[how],
    );
  },
);

Then(
  /^the column "(.*)" of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is not marked as sorted$/,
  async function (this: SpecWorld, column: string, name: string) {
    assert.equal(
      await headingOf(this, listNamed(name), column).getAttribute("aria-sort"),
      null,
    );
  },
);

Then(
  /^no column of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is marked as sorted$/,
  async function (this: SpecWorld, name: string) {
    assert.equal(
      await headings(this, listNamed(name))
        .and(this.browserPage.locator("[aria-sort]"))
        .count(),
      0,
    );
  },
);

const arrowOf = async (
  world: SpecWorld,
  name: string,
  column: string,
): Promise<string | undefined> => {
  const said =
    (await headingOf(world, listNamed(name), column).textContent()) ?? "";
  return /^[↑↓]/.exec(said.trim())?.[0];
};

Then(
  /^the heading "(.*)" of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) begins with an arrow pointing (up|down)$/,
  async function (this: SpecWorld, column: string, name: string, way: string) {
    assert.equal(await arrowOf(this, name, column), way === "up" ? "↑" : "↓");
  },
);

Then(
  /^the heading "(.*)" of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) has no arrow$/,
  async function (this: SpecWorld, column: string, name: string) {
    assert.equal(await arrowOf(this, name, column), undefined);
  },
);

// The filter --------------------------------------------------------------------------

const offeredIn = async (world: SpecWorld, field: string): Promise<string[]> =>
  (await filterField(world, field).count()) === 0
    ? []
    : filterField(world, field)
        .locator('option:not([value=""])')
        .allTextContents();

Then(
  /^"(.*)" is (not )?offered as a (country|region|sport)$/,
  async function (
    this: SpecWorld,
    choice: string,
    not: string | null,
    field: string,
  ) {
    assert.equal((await offeredIn(this, field)).includes(choice), not === null);
  },
);

Then("no region is offered", async function (this: SpecWorld) {
  assert.deepEqual(await offeredIn(this, "region"), []);
});

// Not even the list to choose one from, as on a sport's own page.
Then("no sport is offered", async function (this: SpecWorld) {
  assert.equal(await filterField(this, "sport").count(), 0);
});

// The years ------------------------------------------------------------------------------

Then(
  "the year {int} is visible",
  async function (this: SpecWorld, year: number) {
    assert.equal(await yearLink(this, year).count(), 1);
  },
);

Then("no year is marked as chosen", async function (this: SpecWorld) {
  assert.ok(
    (await this.browserPage.locator(`${yearsShown} a`).count()) > 0,
    "No year is offered.",
  );
  assert.equal(
    await this.browserPage.locator("nav.years [aria-current]").count(),
    0,
  );
});

Then("no section bar is shown", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator(".site-sections").count(), 0);
});

// How it is laid out ------------------------------------------------------------------------

/** Where `found` is drawn, and how big it is. */
export const boxOf = async (
  found: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  return box;
};

// What the browser has of its own that these ask of it, since the specs are
// typed without the browser's own types.
interface InThePage {
  getComputedStyle(element: unknown): {
    getPropertyValue(property: string): string;
  };
}

const drawnAs = (found: Locator, property: string): Promise<string> =>
  found.evaluate(
    (element, name) =>
      (globalThis as unknown as InThePage)
        .getComputedStyle(element)
        .getPropertyValue(name),
    property,
  );

const secondary = (world: SpecWorld): Locator =>
  world.browserPage.locator("nav.site-sections");

Then(
  /^the column headings of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) are on the colour the secondary navigation is on$/,
  async function (this: SpecWorld, name: string) {
    const bar = await drawnAs(secondary(this), "background-color");
    for (const heading of await headings(this, listNamed(name)).all()) {
      assert.equal(await drawnAs(heading, "background-color"), bar);
    }
  },
);

Then(
  /^the column headings of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) are in the colour the secondary navigation's words are in$/,
  async function (this: SpecWorld, name: string) {
    const words = await drawnAs(secondary(this).locator("a").first(), "color");
    for (const heading of await headings(this, listNamed(name))
      .locator("a")
      .all()) {
      assert.equal(await drawnAs(heading, "color"), words);
    }
  },
);

const rowColour = (
  world: SpecWorld,
  name: string,
  which: string,
): Promise<string> =>
  drawnAs(rows(world, listNamed(name)).nth(placeOf(which)), "background-color");

Then(
  /^the (second|third) of the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) is (not )?on the colour the first is on$/,
  async function (
    this: SpecWorld,
    which: string,
    name: string,
    not: string | null,
  ) {
    const first = await rowColour(this, name, "first");
    const other = await rowColour(this, name, which);
    assert.equal(other === first, not === null, `Both are on ${first}.`);
  },
);

Then(
  /^the (recent results|upcoming tournaments|year's tournaments|sport's tournaments) have no lines between their cells$/,
  async function (this: SpecWorld, name: string) {
    // Every side of every cell read at once, since one question of the page
    // for each would take longer than a step is given on a busy machine.
    const cells = list(this, listNamed(name)).locator("th, td");
    assert.ok((await cells.count()) > 0, "There are no cells.");
    const lined = await cells.evaluateAll((cells) =>
      cells.flatMap((cell) =>
        ["top", "right", "bottom", "left"].filter(
          (side) =>
            (globalThis as unknown as InThePage)
              .getComputedStyle(cell)
              .getPropertyValue(`border-${side}-width`) !== "0px",
        ),
      ),
    );
    assert.deepEqual(
      lined,
      [],
      `Cells have lines on their ${lined.join(", ")}.`,
    );
  },
);

// Its words ----------------------------------------------------------------------------

// A tournament's name is what its manager called it, and its dates are numbers
// and the months the browser names, so neither is in a catalogue to be marked.
// Nor is a region's name, which is kept as it was recorded.
Then(
  "every word in the page's content but the tournaments' own is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main", [
      ".tournament-name",
      ".tournament-dates",
      'select[name="region"] option:not([value=""])',
    ]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);
