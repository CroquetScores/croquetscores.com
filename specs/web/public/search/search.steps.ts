import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { unmarkedWithin } from "../../support/marks.js";

// The site's search and the page of its results, drawn by the server with no
// scripting (`search.feature`).

const box = (world: SpecWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-search input[name='q']");

const button = (world: SpecWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-search button");

const results = (world: SpecWorld, kind: string): Locator =>
  world.browserPage.locator(`main .search-${kind}`);

const settled = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.waitForLoadState();
};

// A name is what a manager typed, so any character in it that a pattern
// would read as more than itself is escaped.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const named = (world: SpecWorld, kind: string, name: string): Locator =>
  results(world, kind).locator("a:first-child", { hasText: exactly(name) });

// The header's box ---------------------------------------------------------

Then("the header has a search box", async function (this: SpecWorld) {
  assert.equal(await box(this).count(), 1);
  assert.equal(await button(this).count(), 1);
});

Then(
  "the header names the page {string}",
  async function (this: SpecWorld, name: string) {
    const named = this.browserPage.locator("header.site-bar .site-page");
    assert.equal((await named.innerText()).trim(), name);
  },
);

Then(
  "the header's search box is called {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal(await box(this).getAttribute("aria-label"), name);
  },
);

Then(
  "the header's search button is called {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal((await button(this).innerText()).trim(), name);
  },
);

Then(
  "the header's search box says {string}",
  async function (this: SpecWorld, text: string) {
    assert.equal(await box(this).inputValue(), text);
  },
);

Then("the header's search box is empty", async function (this: SpecWorld) {
  assert.equal(await box(this).inputValue(), "");
});

Given(
  "{string} is typed as the header's search box",
  async function (this: SpecWorld, text: string) {
    await box(this).fill(text);
  },
);

When("the header's search button is pressed", async function (this: SpecWorld) {
  await Promise.all([
    this.browserPage.waitForNavigation(),
    button(this).click(),
  ]);
  await settled(this);
});

Then("the address asks for {string}", function (this: SpecWorld, text: string) {
  const url = new URL(this.browserPage.url());
  assert.equal(url.searchParams.get("q"), text);
});

// What was found ---------------------------------------------------------------

const kinds: Record<string, string> = {
  tournaments: "tournament",
  players: "player",
  competitions: "competition",
};

Then(
  /^"(.*)" is (not )?among the (tournaments|players|competitions) in the results$/,
  async function (
    this: SpecWorld,
    name: string,
    not: string | null,
    kind: string,
  ) {
    assert.equal(
      await named(this, kinds[kind]!, name).count(),
      not === null ? 1 : 0,
    );
  },
);

Then(
  "the competition {string} is shown with the tournament {string}",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const row = results(this, "competition").filter({
      has: this.browserPage.locator("a", { hasText: exactly(competition) }),
    });
    assert.equal(
      (await row.locator(".search-of").innerText()).trim(),
      tournament,
    );
  },
);

Then(
  /^(\d+) players? (?:is|are) in the results$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(await results(this, "player").count(), Number(count));
  },
);

Then("the search page lists nothing", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator("main .search-list").count(), 0);
  assert.equal(await this.browserPage.locator("main .search-none").count(), 0);
});

Then(
  /^the search page (does not say|says) nothing was found$/,
  async function (this: SpecWorld, which: string) {
    assert.equal(
      await this.browserPage.locator("main .search-none").count(),
      which === "says" ? 1 : 0,
    );
  },
);

// Going to what was found -------------------------------------------------------

const follow = async (world: SpecWorld, link: Locator): Promise<void> => {
  await Promise.all([world.browserPage.waitForNavigation(), link.click()]);
  await settled(world);
};

When(
  "the found tournament {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await follow(this, named(this, "tournament", name));
  },
);

When(
  "the found player {string} is pressed",
  async function (this: SpecWorld, name: string) {
    const found = this.browserPage
      .locator("main .search-player a, main .players-search-found a")
      .filter({ hasText: exactly(name) });
    await follow(this, found);
  },
);

When(
  "the found competition {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await follow(this, named(this, "competition", name));
  },
);

// The reader's language ----------------------------------------------------------

Then(
  "every word in the page's content but the names found is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main", [
      ".search-tournament a",
      ".search-player a",
      ".search-competition a",
    ]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);

Then(
  "every word in the header's search box is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "header.site-bar .site-search");
    assert.deepEqual(stray, [], "Words in the box came from elsewhere.");
  },
);
