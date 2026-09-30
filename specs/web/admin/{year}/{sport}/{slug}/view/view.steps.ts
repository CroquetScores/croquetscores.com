import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import {
  announcedAs,
  isMarked,
  unmarkedWithin,
} from "../../../../../support/marks.js";

// The admin draws the page itself, after asking the API for the tournament, so
// the page is taken as open once it has drawn its heading: the tournament's
// name, or what it says in its place where the reader cannot run it.

const tabBar = ".tab-control";

const openPageOf = async function (
  this: SpecWorld,
  name: string,
): Promise<void> {
  const tournament = await load(this, tournamentNamed(this, name));
  await this.browserPage.goto(
    `${this.baseUrl!}/admin/${tournament.address.toString()}`,
  );
  // Where the reader is sent to sign in first there is no heading of the
  // admin's to wait for, and the sign in page is what the scenario looks at.
  if (!new URL(this.browserPage.url()).pathname.startsWith("/admin/")) return;
  await this.browserPage.locator("main h1").first().waitFor();
};

Given("the page of {string} is open", openPageOf);
When("the page of {string} is opened", openPageOf);

const tabCalled = (world: SpecWorld, tab: string): Locator =>
  world.browserPage
    .locator(tabBar)
    .getByRole("tab", { name: tab, exact: true });

const choose = async function (this: SpecWorld, tab: string): Promise<void> {
  await tabCalled(this, tab).click();
};

// Given and When alike: Cucumber does not tell them apart.
When("the tab {string} is chosen", choose);

Then(
  "the page is headed {string}",
  async function (this: SpecWorld, name: string) {
    const heading = this.browserPage.locator("main h1").first();
    await heading.waitFor();
    assert.equal((await heading.innerText()).trim(), name);
  },
);

Then(
  "the tab {string} is offered",
  async function (this: SpecWorld, tab: string) {
    await tabCalled(this, tab).waitFor();
  },
);

// Once the page has drawn the tabs the reader is offered, which it does with
// their part in the tournament, so that one missing is missing rather than
// still to come.
Then(
  "the tab {string} is not offered",
  async function (this: SpecWorld, tab: string) {
    await this.browserPage.locator(tabBar).getByRole("tab").first().waitFor();
    assert.equal(await tabCalled(this, tab).count(), 0, `${tab} is offered.`);
  },
);

// Once the page has said why it was refused, which is when it has decided
// what to draw.
Then("no tab is offered", async function (this: SpecWorld) {
  await this.browserPage.locator("main h1").first().waitFor();
  assert.equal(await this.browserPage.getByRole("tab").count(), 0);
});

const places = ["first", "second", "third", "fourth"];

Then(
  /^the tab "([^"]*)" is the (first|second|third|fourth) tab$/,
  async function (this: SpecWorld, tab: string, place: string) {
    await tabCalled(this, tab).waitFor();
    const all = (
      await this.browserPage.locator(tabBar).getByRole("tab").allInnerTexts()
    ).map((words) => words.trim());
    assert.equal(
      all[places.indexOf(place)],
      tab,
      `The tabs are ${JSON.stringify(all)}.`,
    );
  },
);

// The tabs are parts of the one page, so they are in its panel, beneath its
// heading, rather than in the section bar, which is for moving between pages.
Then(
  "the tab {string} is in the panel",
  async function (this: SpecWorld, tab: string) {
    await tabCalled(this, tab).waitFor();
    assert.equal(
      await this.browserPage
        .locator(".panel")
        .getByRole("tab", { name: tab, exact: true })
        .count(),
      1,
    );
  },
);

Then(
  "the tab {string} is beneath the page's heading",
  async function (this: SpecWorld, tab: string) {
    await tabCalled(this, tab).waitFor();
    const heading = await this.browserPage
      .locator("main h1")
      .first()
      .boundingBox();
    const box = await tabCalled(this, tab).boundingBox();
    assert.ok(heading !== null && box !== null, "One is not laid out.");
    assert.ok(heading.y + heading.height <= box.y, "The tab is not beneath.");
  },
);

Then("the tabs are named in the test locale", async function (this: SpecWorld) {
  await this.browserPage.locator(tabBar).waitFor();
  const named = await announcedAs(this, tabBar);
  assert.ok(named !== null, "The tabs are not named.");
  assert.ok(isMarked(named), `The tabs are named ${JSON.stringify(named)}.`);
});

Then("the tabs are on one row", async function (this: SpecWorld) {
  const tabs = this.browserPage.locator(tabBar).getByRole("tab");
  await tabs.first().waitFor();
  const tops = await Promise.all(
    (await tabs.all()).map(async (tab) => {
      const box = await tab.boundingBox();
      assert.ok(box !== null, "A tab is not laid out.");
      return Math.round(box.y);
    }),
  );
  assert.equal(new Set(tops).size, 1, `The tabs start at ${String(tops)}.`);
});

Then(
  "the tab {string} is at least {int} pixels tall",
  async function (this: SpecWorld, tab: string, pixels: number) {
    const box = await tabCalled(this, tab).boundingBox();
    assert.ok(box !== null, `The tab ${tab} is not laid out.`);
    assert.ok(
      box.height >= pixels,
      `The tab ${tab} is ${String(box.height)} pixels tall.`,
    );
  },
);

// Which tab is being read is what a screen reader is told, and what the
// stylesheet marks: one is the other.
const isBeingRead = async (world: SpecWorld, tab: string): Promise<boolean> =>
  (await tabCalled(world, tab).getAttribute("aria-selected")) === "true";

Then(
  "the tab {string} is the one being read",
  async function (this: SpecWorld, tab: string) {
    await tabCalled(this, tab).waitFor();
    assert.equal(await isBeingRead(this, tab), true);
  },
);

Then(
  "the tab {string} is not the one being read",
  async function (this: SpecWorld, tab: string) {
    await tabCalled(this, tab).waitFor();
    assert.equal(await isBeingRead(this, tab), false);
  },
);

Then(
  "every word in the tabs is in the test locale",
  async function (this: SpecWorld) {
    await this.browserPage.locator(tabBar).waitFor();
    const stray = await unmarkedWithin(this, tabBar);
    assert.deepEqual(stray, [], "Words in the tabs came from elsewhere.");
  },
);
