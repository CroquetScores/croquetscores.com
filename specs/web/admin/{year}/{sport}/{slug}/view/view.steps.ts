import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import { retried } from "../../../../../support/tournamentPage.js";
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
    // A name kept from beside the heading is redrawn a moment after it is.
    await retried(async () => {
      assert.equal((await heading.innerText()).trim(), name);
    });
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

const places = ["first", "second", "third", "fourth", "fifth", "sixth"];

Then(
  /^the tab "([^"]*)" is the (first|second|third|fourth|fifth|sixth) tab$/,
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

// The pencil beside the heading, by the name it is given: a link where it
// leads to a page, as a tournament's does, and a button where it opens a
// dialog, as a competition's does.
const editBesideHeading = (world: SpecWorld): Locator => {
  const heading = world.browserPage.locator("main .page-heading");
  return heading
    .getByRole("link", { name: "Edit", exact: true })
    .or(heading.getByRole("button", { name: "Edit", exact: true }));
};

Then("Edit is beside the page's heading", async function (this: SpecWorld) {
  const edit = editBesideHeading(this);
  await edit.waitFor();
  const heading = await this.browserPage
    .locator("main h1")
    .first()
    .boundingBox();
  const box = await edit.boundingBox();
  assert.ok(heading !== null && box !== null, "One is not laid out.");
  // On the heading's line, and after it.
  assert.ok(
    box.y < heading.y + heading.height && heading.y < box.y + box.height,
    `Edit is not on the heading's line: ${JSON.stringify({ heading, box })}`,
  );
  assert.ok(box.x >= heading.x + heading.width, "Edit is not after it.");
});

Then(
  "Edit beside the page's heading is a pencil",
  async function (this: SpecWorld) {
    const edit = editBesideHeading(this);
    await edit.waitFor();
    assert.equal(await edit.locator(".icon-pencil").count(), 1);
    assert.equal(((await edit.textContent()) ?? "").trim(), "");
  },
);

When(
  "Edit beside the page's heading is pressed",
  async function (this: SpecWorld) {
    await editBesideHeading(this).click();
  },
);

Then(
  "Edit is not offered beside the page's heading",
  async function (this: SpecWorld) {
    await this.browserPage.locator("main h1").first().waitFor();
    assert.equal(await editBesideHeading(this).count(), 0);
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

// Retried, since the tabs are measured one after another and the page can
// still be settling, which moved the last two a line down from the first four
// in one run of a few thousand: a row that really wraps is still wrapped when
// the retries are over.
Then("the tabs are on one row", async function (this: SpecWorld) {
  const tabs = this.browserPage.locator(tabBar).getByRole("tab");
  await tabs.first().waitFor();
  await retried(async () => {
    const tops = await Promise.all(
      (await tabs.all()).map(async (tab) => {
        const box = await tab.boundingBox();
        assert.ok(box !== null, "A tab is not laid out.");
        return Math.round(box.y);
      }),
    );
    assert.equal(new Set(tops).size, 1, `The tabs start at ${String(tops)}.`);
  });
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

// The help icons ------------------------------------------------------------------

// Of the page's title bar, which a form that is a page's purpose has
// (new.feature), and of the row of tabs.
const pageHelp = (world: SpecWorld): Locator =>
  world.browserPage.locator("section.dialog a.dialog-help");
const rowHelp = (world: SpecWorld): Locator =>
  world.browserPage.locator(".tab-row a.dialog-help");

Then(
  "the page has a help icon called {string}",
  async function (this: SpecWorld, name: string) {
    // Waited for, since the page is drawn in the browser and a count taken at
    // once can be taken before the icon is there.
    const icon = this.browserPage
      .locator("section.dialog")
      .getByRole("link", { name, exact: true });
    await icon.first().waitFor();
    assert.equal(await icon.count(), 1);
  },
);

Then(
  "the page's help icon leads to {string}",
  async function (this: SpecWorld, address: string) {
    await pageHelp(this).waitFor();
    assert.equal(await pageHelp(this).getAttribute("href"), address);
  },
);

Then(
  "the page's help icon opens another tab",
  async function (this: SpecWorld) {
    await pageHelp(this).waitFor();
    assert.equal(await pageHelp(this).getAttribute("target"), "_blank");
  },
);

Then(
  "the page's help icon is level with the page's title",
  async function (this: SpecWorld) {
    await pageHelp(this).waitFor();
    const icon = await pageHelp(this).boundingBox();
    const title = await this.browserPage
      .locator("section.dialog .dialog-title")
      .boundingBox();
    assert.ok(icon !== null && title !== null, "One of them is not drawn.");
    assert.ok(
      icon.y >= title.y && icon.y + icon.height <= title.y + title.height,
    );
  },
);

Then(
  "the tab row's help icon leads to {string}",
  async function (this: SpecWorld, address: string) {
    await rowHelp(this).waitFor();
    assert.equal(await rowHelp(this).getAttribute("href"), address);
  },
);

Then(
  "the tab row's help icon opens another tab",
  async function (this: SpecWorld) {
    await rowHelp(this).waitFor();
    assert.equal(await rowHelp(this).getAttribute("target"), "_blank");
  },
);

Then(
  "the tab row has a help icon called {string}",
  async function (this: SpecWorld, name: string) {
    const icon = this.browserPage
      .locator(".tab-row")
      .getByRole("link", { name, exact: true });
    await icon.first().waitFor();
    assert.equal(await icon.count(), 1);
  },
);

Then(
  "the tab row's help icon is level with the tabs",
  async function (this: SpecWorld) {
    await rowHelp(this).waitFor();
    const icon = await rowHelp(this).boundingBox();
    const bar = await this.browserPage.locator(tabBar).boundingBox();
    assert.ok(icon !== null && bar !== null, "One of them is not drawn.");
    assert.ok(icon.y >= bar.y && icon.y + icon.height <= bar.y + bar.height);
  },
);
