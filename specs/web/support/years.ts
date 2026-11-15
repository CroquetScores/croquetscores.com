// The years bar a year's page and the home page share, the filter beside their
// lists, and how the page is laid out. Said of what a reader sees: the tabs and
// the drop-down list of years, which one is marked as the year being read, the
// choices of the filter, and whether the names fit.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { evaluateWith } from "./evaluateWith.js";
import { settled } from "./tournamentLists.js";
import type { WebWorld } from "./world.js";

// Read again for a while before being taken as failing, since a page redrawn
// once something is pressed is redrawn a moment after the press.
const eventually = async (
  world: WebWorld,
  check: () => Promise<void>,
): Promise<void> => {
  await settled(world);
  // Three seconds, which leaves the step time to fail with what it found
  // rather than with Cucumber's word that it took too long.
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// The years bar, the one seen rather than the copy it measures with. The home
// page and a year's fit the years to the window with no scripting, drawing every
// year both as a tab and in the drop-down list and showing each in one of them,
// and the drop-down list is a disclosure of links. So a tab or a drop-down list
// is only one the reader can see.
const shownYears = "nav.years .years-row > ul:not(.years-measuring)";
const tabs = (world: WebWorld): Locator =>
  world.browserPage.locator(`${shownYears} > li > a`).filter({ visible: true });
const dropDown = (world: WebWorld): Locator =>
  world.browserPage
    .locator(`${shownYears} :is(select, details)`)
    .filter({ visible: true });

const tabYears = async (world: WebWorld): Promise<number[]> =>
  (await tabs(world).allTextContents()).map(Number);

// What the browser has of its own that these ask of it, since the specs are
// typed without the browser's own types.
interface Shown {
  readonly localName: string;
  readonly textContent: string | null;
  getAttribute(name: string): string | null;
  querySelector(selector: string): Shown | null;
  querySelectorAll(selector: string): ArrayLike<Shown>;
}

interface InThePage {
  getComputedStyle(element: Shown): { readonly display: string };
}

// A disclosure's years are those it would show opened, which is every one not
// left out of it, open or not.
const dropDownYears = async (world: WebWorld): Promise<number[]> => {
  if ((await dropDown(world).count()) === 0) return [];
  const values = await dropDown(world).evaluate((element) => {
    const list = element as unknown as Shown;
    const page = globalThis as unknown as InThePage;
    return list.localName === "select"
      ? Array.from(list.querySelectorAll("option"), (option) =>
          option.getAttribute("value"),
        )
      : Array.from(list.querySelectorAll("li"))
          .filter((item) => page.getComputedStyle(item).display !== "none")
          .map((item) => (item.textContent ?? "").trim());
  });
  return values
    .filter((value): value is string => value !== null && value !== "")
    .map(Number);
};

const yearsOffered = async (world: WebWorld): Promise<number[]> => [
  ...(await tabYears(world)),
  ...(await dropDownYears(world)),
];

Then(
  "the year {int} is offered",
  async function (this: WebWorld, year: number) {
    await eventually(this, async () => {
      assert.ok(
        (await yearsOffered(this)).includes(year),
        `${String(year)} is not offered.`,
      );
    });
  },
);

Then(
  "the year {int} is not offered",
  async function (this: WebWorld, year: number) {
    await eventually(this, async () => {
      assert.ok(
        !(await yearsOffered(this)).includes(year),
        `${String(year)} is offered.`,
      );
    });
  },
);

// Marked as a tab is, or chosen in the drop-down list, whichever it is in: in a
// list to choose from, the year it selects, and in a disclosure of links, the
// one it marks as a tab is marked among those it holds.
const chosenInDropDown = (world: WebWorld): Promise<string | null> =>
  dropDown(world).evaluate((element) => {
    const list = element as unknown as Shown & { value: string };
    return list.localName === "select"
      ? list.value
      : (list.querySelector('a[aria-current="page"]')?.textContent ?? null);
  });

Then("the year chosen is {int}", async function (this: WebWorld, year: number) {
  await eventually(this, async () => {
    const marked = tabs(this).and(
      this.browserPage.locator('[aria-current="page"]'),
    );
    const chosen =
      (await marked.count()) === 1
        ? Number(await marked.textContent())
        : Number(await chosenInDropDown(this));
    assert.equal(chosen, year);
  });
});

Then(
  "the year {int} is not in the drop-down list",
  async function (this: WebWorld, year: number) {
    await eventually(this, async () => {
      assert.equal(await dropDown(this).count(), 1);
      assert.ok(
        !(await dropDownYears(this)).includes(year),
        `${String(year)} is in the drop-down list.`,
      );
    });
  },
);

Then("the years take one row of the bar", async function (this: WebWorld) {
  await eventually(this, async () => {
    const tops: number[] = [];
    for (const item of await this.browserPage
      .locator(`${shownYears} > li`)
      .filter({ visible: true })
      .all()) {
      const box = await item.boundingBox();
      assert.ok(box !== null, "A year in the bar is not on the page.");
      tops.push(Math.round(box.y));
    }
    assert.ok(tops.length > 1, "There is nothing in the bar to be in a row.");
    assert.equal(
      new Set(tops).size,
      1,
      `The years start at ${tops.join(", ")}.`,
    );
  });
});

// The words exactly, rather than any tab whose text holds them.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

// Marked as the bar marks the section being read, which the stylesheet draws on
// black.
const markedTab = (world: WebWorld, year: number): Locator =>
  tabs(world)
    .filter({ hasText: exactly(String(year)) })
    .and(world.browserPage.locator('[aria-current="page"]'));

Then(
  "the tab for {int} is marked as the year chosen",
  async function (this: WebWorld, year: number) {
    await eventually(this, async () => {
      assert.equal(await markedTab(this, year).count(), 1);
    });
  },
);

Then(
  "the tab for {int} is not marked as the year chosen",
  async function (this: WebWorld, year: number) {
    await eventually(this, async () => {
      assert.ok(
        (await tabYears(this)).includes(year),
        `${String(year)} is not a tab.`,
      );
      assert.equal(await markedTab(this, year).count(), 0);
    });
  },
);

// How the page is laid out -----------------------------------------------------

Then("the page is no wider than the window", async function (this: WebWorld) {
  await eventually(this, async () => {
    const [page, window] = await this.browserPage.evaluate<[number, number]>(
      "[document.documentElement.scrollWidth, window.innerWidth]",
    );
    assert.ok(page <= window, `The page is ${String(page)} pixels wide.`);
  });
});

// What `expression` makes of the name of the tournament `name`, called element
// there. Written as an expression, as the other steps write what they run in the
// page, since the specs are typed without the browser's own types. The public
// lists' among them, the home page's and a year's, which are tables.
const names =
  ":is(.tournaments > .tournament, .tournament-list tbody tr) .tournament-name";
const inNameOf = async <T>(
  world: WebWorld,
  name: string,
  expression: string,
): Promise<T> => {
  const at = (await world.browserPage.locator(names).allTextContents()).indexOf(
    name,
  );
  assert.ok(at >= 0, `${name} is not listed.`);
  // The selector and the position reach the page as data and are never spliced
  // into code. Only `expression`, which every caller writes out in full, is
  // part of it.
  return evaluateWith<T>(
    world.browserPage,
    `({ selector, at }) => { const element = document.querySelectorAll(selector)[at]; return ${expression}; }`,
    { selector: names, at },
  );
};

// The whole of it laid out and none of it hidden: nothing cut off at the edge,
// and no ellipsis standing in for the rest.
Then(
  "the name {string} is shown whole",
  async function (this: WebWorld, name: string) {
    await eventually(this, async () => {
      const shown = await inNameOf<{ words: string; cut: boolean }>(
        this,
        name,
        "({ words: element.innerText, cut: element.scrollWidth > element.clientWidth })",
      );
      assert.equal(shown.words, name);
      assert.equal(shown.cut, false);
    });
  },
);

// The filter ---------------------------------------------------------------------

// Pressed by its words, and waited on until what it does is done: a link
// followed or a form's answer come back, so that the next step reads what
// pressing it did and not the page as it was before.
When("{string} is pressed", async function (this: WebWorld, option: string) {
  await settled(this);
  const page = this.browserPage;
  await page
    .locator("main :is(a, button)")
    .filter({ hasText: exactly(option) })
    .click();
  await page.waitForLoadState();
});

const chosenIn = async (world: WebWorld, label: string): Promise<string> =>
  (await world.browserPage
    .locator("main form.tournament-filter")
    .getByLabel(label, { exact: true })
    .locator("option:checked")
    .textContent()) ?? "";

for (const field of ["Sport", "Country", "Region"]) {
  Then(
    `the ${field.toLowerCase()} chosen is {string}`,
    async function (this: WebWorld, chosen: string) {
      await eventually(this, async () => {
        assert.equal(await chosenIn(this, field), chosen);
      });
    },
  );
}
