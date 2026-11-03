import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { ordinal } from "../../support/ordinals.js";
import { settled } from "../../support/tournamentLists.js";

// The months of a year's page, and what pressing one does. What the tournaments
// beneath a month share with the other lists is said in
// specs/web/support/tournamentLists.ts, and opening the page in year.steps.ts
// and yearSport.steps.ts.

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
    // As text, since the specs are not compiled to know a page's globals.
    const colour = (found: Locator): Promise<string> =>
      found.evaluate("(element) => getComputedStyle(element).backgroundColor");
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
