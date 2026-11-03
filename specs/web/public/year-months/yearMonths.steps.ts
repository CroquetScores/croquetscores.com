import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { ordinal } from "../../support/ordinals.js";
import { aServerError, answerNextGet } from "../../support/serverError.js";
import { settled } from "../../support/tournamentLists.js";

// The months of a year's page, and what pressing one does. What the tournaments
// beneath a month share with the other lists is said in
// specs/web/support/tournamentLists.ts, and opening the page in year.steps.ts
// and yearSport.steps.ts.

// What the specs are not compiled to know of the page itself.
interface InThePage {
  getComputedStyle(element: unknown): {
    getPropertyValue(name: string): string;
  };
}

const months = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .year-month");

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const monthNamed = (world: SpecWorld, name: string): Locator =>
  months(world).filter({
    has: world.browserPage.locator(".year-month-name", {
      hasText: exactly(name),
    }),
  });

// What the server was asked for, by the page the scenario is reading: only a
// request for a month's tournaments counts, and not the page itself.
const askedFor = new WeakMap<SpecWorld, string[]>();

const press = async (world: SpecWorld, name: string): Promise<void> => {
  await monthNamed(world, name).locator(".year-month-toggle").click();
  await settled(world);
};

Given("scripting is on", async function (this: SpecWorld) {
  await withScripting(this);
  const requests: string[] = [];
  askedFor.set(this, requests);
  this.browserPage.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (/\/months\/\d{2}$/.test(path)) requests.push(path);
  });
});

// Said as a Given and as a When in the scenarios, which Cucumber does not tell
// apart, so it is defined once.
When(/^the month "(.*)" is pressed$/, async function (this: SpecWorld, name) {
  await press(this, name as string);
});

When("every month of the year is pressed", async function (this: SpecWorld) {
  const count = await months(this).count();
  for (let at = 0; at < count; at++) {
    await months(this).nth(at).locator(".year-month-toggle").click();
    await settled(this);
  }
});

Given("the page has been marked", async function (this: SpecWorld) {
  await this.browserPage.evaluate("window.marked = true");
});

Then("the page is the one that was marked", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.evaluate("window.marked === true"),
    true,
    "The page was loaded again.",
  );
});

Then(
  /^the page is the year (\d+)'s$/,
  function (this: SpecWorld, year: string) {
    assert.equal(new URL(this.browserPage.url()).pathname, `/${year}`);
  },
);

Then(
  /^the year has (\d+) months$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(await months(this).count(), Number(count));
  },
);

Then(
  /^the (first|twelfth) month of the year is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      (
        (await months(this)
          .nth(ordinal(which))
          .locator(".year-month-name")
          .textContent()) ?? ""
      ).trim(),
      name,
    );
  },
);

Then(
  /^the month "(.*)" is (open|closed)$/,
  async function (this: SpecWorld, name: string, state: string) {
    assert.equal(
      await monthNamed(this, name).getAttribute("data-state"),
      state,
    );
  },
);

Then(
  /^(\d+) months are open$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(
      await months(this)
        .and(this.browserPage.locator("[data-state=open]"))
        .count(),
      Number(count),
    );
  },
);

Then(
  /^the month "(.*)" says there are none$/,
  async function (this: SpecWorld, name: string) {
    assert.equal(
      await monthNamed(this, name).locator(".tournament-list-none").count(),
      1,
    );
  },
);

Then("no month's tournaments have been asked for", function (this: SpecWorld) {
  assert.deepEqual(askedFor.get(this), []);
});

Then(
  /^(\d+) month's tournaments have been asked for$/,
  function (this: SpecWorld, count: string) {
    assert.equal(askedFor.get(this)?.length, Number(count));
  },
);

Then(
  /^the month "(.*)" is marked "(\+|-)"$/,
  async function (this: SpecWorld, name: string, mark: string) {
    assert.equal(
      (
        (await monthNamed(this, name)
          .locator(".year-month-mark")
          .textContent()) ?? ""
      ).trim(),
      mark,
    );
  },
);

When(
  /^the column "(.*)" of the month "(.*)" is pressed$/,
  async function (this: SpecWorld, column: string, name: string) {
    await monthNamed(this, name)
      .locator("thead a", { hasText: new RegExp(`${column}$`) })
      .click();
    await settled(this);
  },
);

Then(
  /^the (first|second|third) tournament of the month "(.*)" is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    name: string,
    expected: string,
  ) {
    assert.equal(
      (
        (await monthNamed(this, name)
          .locator("tbody tr .tournament-name")
          .nth(ordinal(which))
          .textContent()) ?? ""
      ).trim(),
      expected,
    );
  },
);

Then(
  /^the month "(.*)" has no other heading$/,
  async function (this: SpecWorld, name: string) {
    assert.equal(await monthNamed(this, name).getByRole("heading").count(), 0);
  },
);

// Where the month's button ends and its table's column headings begin, in the
// page's own pixels.
const edges = async (
  world: SpecWorld,
  name: string,
): Promise<{ buttonBottom: number; headingsTop: number }> => {
  const month = monthNamed(world, name);
  const button = await month.locator(".year-month-toggle").boundingBox();
  const headings = await month.locator("thead").boundingBox();
  assert.ok(button !== null && headings !== null, "The month is not open.");
  return {
    buttonBottom: button.y + button.height,
    headingsTop: headings.y,
  };
};

Then(
  /^the month "(.*)" touches its column headings$/,
  async function (this: SpecWorld, name: string) {
    const { buttonBottom, headingsTop } = await edges(this, name);
    assert.ok(
      Math.abs(headingsTop - buttonBottom) <= 1,
      `There are ${String(headingsTop - buttonBottom)} pixels between them.`,
    );
  },
);

Then(
  /^the month "(.*)" is the colour of its column headings$/,
  async function (this: SpecWorld, name: string) {
    const month = monthNamed(this, name);
    const colour = (found: Locator): Promise<string> =>
      found.evaluate((element) =>
        (globalThis as unknown as InThePage)
          .getComputedStyle(element)
          .getPropertyValue("background-color"),
      );
    assert.equal(
      await colour(month.locator(".year-month-toggle")),
      await colour(month.locator("thead th").first()),
    );
  },
);

When(
  /^the usual order of the month "(.*)" is pressed$/,
  async function (this: SpecWorld, name: string) {
    await monthNamed(this, name).locator(".tournament-list-usual a").click();
    await settled(this);
  },
);

// The look of a month: bar of a colour, without a line round it or rounded
// corners. Read from the button as the browser draws it.
const styleOf = (found: Locator, property: string): Promise<string> =>
  found.evaluate(
    (element, name) =>
      (globalThis as unknown as InThePage)
        .getComputedStyle(element)
        .getPropertyValue(name),
    property,
  );

Then(
  /^the month "(.*)" has no border$/,
  async function (this: SpecWorld, name: string) {
    const toggle = monthNamed(this, name).locator(".year-month-toggle");
    for (const side of ["top", "right", "bottom", "left"]) {
      assert.equal(
        await styleOf(toggle, `border-${side}-width`),
        "0px",
        `There is a border on its ${side}.`,
      );
    }
  },
);

Then(
  /^the month "(.*)" has square corners$/,
  async function (this: SpecWorld, name: string) {
    const toggle = monthNamed(this, name).locator(".year-month-toggle");
    for (const corner of [
      "top-left",
      "top-right",
      "bottom-right",
      "bottom-left",
    ]) {
      assert.equal(
        await styleOf(toggle, `border-${corner}-radius`),
        "0px",
        `Its ${corner} corner is rounded.`,
      );
    }
  },
);

// Showing or hiding every month at once ------------------------------------------

const allOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .year-months-all");

When(
  "the way to show or hide all the months is pressed",
  async function (this: SpecWorld) {
    await allOf(this).click();
    await settled(this);
  },
);

Then(
  /^the way to show or hide all the months says "(Show all|Hide all)"$/,
  async function (this: SpecWorld, words: string) {
    assert.equal(
      (
        (await allOf(this).locator(".year-months-all-words").textContent()) ??
        ""
      ).trim(),
      words,
    );
  },
);

Then(
  /^the way to show or hide all the months is marked "(\+|-)"$/,
  async function (this: SpecWorld, mark: string) {
    assert.equal(
      (
        (await allOf(this).locator(".year-month-mark").textContent()) ?? ""
      ).trim(),
      mark,
    );
  },
);

Then(
  "the way to show all the months is beneath the heading",
  async function (this: SpecWorld) {
    const heading = await this.browserPage.locator("main h1").boundingBox();
    const control = await allOf(this).boundingBox();
    assert.ok(heading !== null && control !== null, "It is not laid out.");
    assert.ok(control.y >= heading.y + heading.height);
  },
);

Then(
  "the way to show all the months is above the first month",
  async function (this: SpecWorld) {
    const control = await allOf(this).boundingBox();
    const first = await months(this).first().boundingBox();
    assert.ok(control !== null && first !== null, "It is not laid out.");
    assert.ok(control.y + control.height <= first.y);
  },
);

Then(
  "there is no way to show or hide all the months",
  async function (this: SpecWorld) {
    assert.equal(await allOf(this).count(), 0);
  },
);

// Once only, and a moment late, so that it is the last of the months asked for
// when a sorting asks for them all, and no month loaded after it sets right
// what it left.
Given(
  "the next asking for December is answered with a server error",
  async function (this: SpecWorld) {
    const late = new Promise<void>((resolve) => setTimeout(resolve, 1000));
    await answerNextGet(this, /\/months\/12(\?|$)/, aServerError, late);
  },
);

Then(
  /^the month "(.*)" is at the top of the page$/,
  async function (this: SpecWorld, name: string) {
    // The scroll is made once the months have been reloaded, so it is waited
    // for rather than read at once.
    const month = monthNamed(this, name);
    let top = Number.NaN;
    for (let tries = 0; tries < 40; tries += 1) {
      top = (await month.boundingBox())?.y ?? Number.NaN;
      if (Math.abs(top) <= 1) return;
      await this.browserPage.waitForTimeout(50);
    }
    assert.fail(`It is ${String(top)} pixels from the top.`);
  },
);
