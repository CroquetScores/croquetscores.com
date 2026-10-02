import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { Countries } from "../../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import {
  load,
  tournamentNamed,
} from "../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../support/world.js";
import { unmarkedWithin } from "../../support/marks.js";
import { changeTournament } from "../../support/tournaments.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

// Each list by the words a scenario names it by.
const lists = {
  "recent results": "recent",
  "upcoming tournaments": "upcoming",
} as const;

type List = keyof typeof lists;

const listNamed = (name: string): List => {
  assert.ok(name in lists, `There is no list called the ${name}.`);
  return name as List;
};

const list = (world: SpecWorld, name: List): Locator =>
  world.browserPage.locator(`main section.home-${lists[name]}`);

const rows = (world: SpecWorld, name: List): Locator =>
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

const headings = (world: SpecWorld, name: List): Locator =>
  list(world, name).locator("thead th");

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
// whole of it, so it is the link that is pressed wherever on the row that is.
const pressAt = async (world: SpecWorld, found: Locator): Promise<void> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  await world.browserPage.mouse.click(
    box.x + box.width / 2,
    box.y + box.height / 2,
  );
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
  /^the home page is opened for the (country|sport) "(.*)"$/,
  async function (this: SpecWorld, chosen: string, code: string) {
    await this.browserPage.goto(
      `${this.baseUrl!}/?${new URLSearchParams({ [chosen]: code }).toString()}`,
    );
  },
);

When(
  "the page is opened again at its address",
  async function (this: SpecWorld) {
    await this.browserPage.goto(this.browserPage.url());
  },
);

// What the reader does -------------------------------------------------------------

When(
  /^the column "(.*)" of the (recent results|upcoming tournaments) is pressed$/,
  async function (this: SpecWorld, column: string, name: string) {
    await follow(this, headingOf(this, listNamed(name), column).locator("a"));
  },
);

When(
  /^the (first|second|third) column of the (recent results|upcoming tournaments) is pressed$/,
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
  /^the (date|name|flag) of "(.*)" in the (recent results|upcoming tournaments) is pressed$/,
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
  world.browserPage.locator(`form.home-filter select[name="${field}"]`);

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
  /^"(.*)" is (not )?in the (recent results|upcoming tournaments)$/,
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
  /^the (first|second|third) of the (recent results|upcoming tournaments) is "(.*)"$/,
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

Then(
  /^(\d+) upcoming tournaments? (?:is|are) listed$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(
      await rows(this, "upcoming tournaments").count(),
      Number(count),
    );
  },
);

const sayNone = (world: SpecWorld, name: List): Locator =>
  list(world, name).locator(".home-list-none");

Then(
  /^the (recent results|upcoming tournaments) say there are none$/,
  async function (this: SpecWorld, name: string) {
    assert.equal(await sayNone(this, listNamed(name)).count(), 1);
  },
);

Then(
  /^the (recent results|upcoming tournaments) do not say there are none$/,
  async function (this: SpecWorld, name: string) {
    assert.equal(await sayNone(this, listNamed(name)).count(), 0);
  },
);

// Its rows -------------------------------------------------------------------------

Then(
  /^the (first|second|third) column of the (recent results|upcoming tournaments) is "(.*)"$/,
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
  "{string} is dated {string} in the upcoming tournaments",
  async function (this: SpecWorld, tournament: string, dated: string) {
    assert.equal(
      await rowOf(this, "upcoming tournaments", tournament)
        .locator(".tournament-dates")
        .textContent(),
      dated,
    );
  },
);

const flagOf = (world: SpecWorld, tournament: string): Locator =>
  rowOf(world, "upcoming tournaments", tournament).locator(
    ".tournament-flag img",
  );

// The picture the flag is, as the site serves it, under whatever name it is
// given to be kept by.
Then(
  "{string} shows the flag of {string} in the upcoming tournaments",
  async function (this: SpecWorld, tournament: string, code: string) {
    const flag = Countries.thereAre.find(code)?.flag;
    assert.ok(flag !== undefined, `There is no country ${code}.`);
    const shown = (await flagOf(this, tournament).getAttribute("src")) ?? "";
    const [kept] = flag.relativePath.split(".");
    assert.ok(
      shown.includes(`/images/${kept!}.`),
      `The flag shown is ${shown}.`,
    );
  },
);

Then(
  "the flag of {string} in the upcoming tournaments is named {string}",
  async function (this: SpecWorld, tournament: string, name: string) {
    assert.equal(await flagOf(this, tournament).getAttribute("alt"), name);
  },
);

Then(
  "the name of {string} in the upcoming tournaments is a link",
  async function (this: SpecWorld, tournament: string) {
    const name = rowOf(this, "upcoming tournaments", tournament).locator(
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
  /^the row of "(.*)" in the upcoming tournaments holds (\d+) links?$/,
  async function (this: SpecWorld, tournament: string, count: string) {
    assert.equal(
      await rowOf(this, "upcoming tournaments", tournament)
        .locator("a")
        .count(),
      Number(count),
    );
  },
);

Then(
  "the row of {string} in the upcoming tournaments is at least {int} pixels tall",
  async function (this: SpecWorld, tournament: string, least: number) {
    const box = await rowOf(
      this,
      "upcoming tournaments",
      tournament,
    ).boundingBox();
    assert.ok(box !== null, "The row is not on the page.");
    assert.ok(box.height >= least, `It is ${String(box.height)} pixels tall.`);
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
  /^the column "(.*)" of the (recent results|upcoming tournaments) is (?:marked|announced) as sorted (?:from the )?(smallest|largest|ascending|descending)$/,
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
  /^the column "(.*)" of the (recent results|upcoming tournaments) is not marked as sorted$/,
  async function (this: SpecWorld, column: string, name: string) {
    assert.equal(
      await headingOf(this, listNamed(name), column).getAttribute("aria-sort"),
      null,
    );
  },
);

Then(
  /^no column of the (recent results|upcoming tournaments) is marked as sorted$/,
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
  column: string,
): Promise<string | undefined> => {
  const said =
    (await headingOf(world, "upcoming tournaments", column).textContent()) ??
    "";
  return /^[↑↓]/.exec(said.trim())?.[0];
};

Then(
  /^the heading "(.*)" of the upcoming tournaments begins with an arrow pointing (up|down)$/,
  async function (this: SpecWorld, column: string, way: string) {
    assert.equal(await arrowOf(this, column), way === "up" ? "↑" : "↓");
  },
);

Then(
  "the heading {string} of the upcoming tournaments has no arrow",
  async function (this: SpecWorld, column: string) {
    assert.equal(await arrowOf(this, column), undefined);
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

const boxOf = async (
  found: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  return box;
};

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
  "the column headings of the upcoming tournaments are on the colour the secondary navigation is on",
  async function (this: SpecWorld) {
    const bar = await drawnAs(secondary(this), "background-color");
    for (const heading of await headings(this, "upcoming tournaments").all()) {
      assert.equal(await drawnAs(heading, "background-color"), bar);
    }
  },
);

Then(
  "the column headings of the upcoming tournaments are in the colour the secondary navigation's words are in",
  async function (this: SpecWorld) {
    const words = await drawnAs(secondary(this).locator("a").first(), "color");
    for (const heading of await headings(this, "upcoming tournaments").all()) {
      assert.equal(await drawnAs(heading.locator("a"), "color"), words);
    }
  },
);

const rowColour = (world: SpecWorld, which: string): Promise<string> =>
  drawnAs(
    rows(world, "upcoming tournaments").nth(placeOf(which)),
    "background-color",
  );

Then(
  /^the (second|third) of the upcoming tournaments is (not )?on the colour the first is on$/,
  async function (this: SpecWorld, which: string, not: string | null) {
    const first = await rowColour(this, "first");
    const other = await rowColour(this, which);
    assert.equal(other === first, not === null, `Both are on ${first}.`);
  },
);

Then(
  "the upcoming tournaments have no lines between their cells",
  async function (this: SpecWorld) {
    const cells = list(this, "upcoming tournaments").locator("th, td");
    for (const cell of await cells.all()) {
      for (const side of ["top", "right", "bottom", "left"]) {
        assert.equal(
          await drawnAs(cell, `border-${side}-width`),
          "0px",
          `A cell has a line on its ${side}.`,
        );
      }
    }
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
