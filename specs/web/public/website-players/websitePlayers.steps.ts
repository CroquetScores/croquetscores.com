import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";
import { unmarkedWithin } from "../../support/marks.js";

// The page of players, drawn by the server with no scripting
// (`websitePlayers.feature`).

const box = (world: WebWorld): Locator =>
  world.browserPage.locator("main .players-search input[name='search']");

const button = (world: WebWorld): Locator =>
  world.browserPage.locator("main .players-search button");

const found = (world: WebWorld): Locator =>
  world.browserPage.locator("main .players-search-found .player-name");

Then(
  "the players' search box is called {string}",
  async function (this: WebWorld, name: string) {
    assert.equal(await box(this).getAttribute("aria-label"), name);
  },
);

Then(
  "the players' search button is called {string}",
  async function (this: WebWorld, name: string) {
    assert.equal((await button(this).innerText()).trim(), name);
  },
);

Then(
  "the players' search box says {string}",
  async function (this: WebWorld, text: string) {
    assert.equal(await box(this).inputValue(), text);
  },
);

Given(
  "{string} is typed as the players' search box",
  async function (this: WebWorld, text: string) {
    await box(this).fill(text);
  },
);

When("the players' search button is pressed", async function (this: WebWorld) {
  await Promise.all([
    this.browserPage.waitForNavigation(),
    button(this).click(),
  ]);
  await this.browserPage.waitForLoadState();
});

Then(
  "the address searches players for {string}",
  function (this: WebWorld, text: string) {
    const url = new URL(this.browserPage.url());
    assert.equal(url.searchParams.get("search"), text);
  },
);

Then(
  /^the page found (\d+) players?$/,
  async function (this: WebWorld, count: string) {
    assert.equal(await found(this).count(), Number(count));
  },
);

Then("the page lists no players", async function (this: WebWorld) {
  assert.equal(await found(this).count(), 0);
});

Then(
  /^the players' search (does not say|says) nobody was found$/,
  async function (this: WebWorld, which: string) {
    assert.equal(
      await this.browserPage.locator("main .players-search-none").count(),
      which === "says" ? 1 : 0,
    );
  },
);

Then(
  "the players' search says what it is for",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage.locator("main .players-search-prompt").count(),
      1,
    );
  },
);

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

Then(
  /^"(.*)" is (not )?among the players the page found$/,
  async function (this: WebWorld, name: string, not: string | null) {
    assert.equal(
      await found(this)
        .filter({ hasText: exactly(name) })
        .count(),
      not === null ? 1 : 0,
    );
  },
);

Then(
  /^the (first|second) player the page found is "(.*)"$/,
  async function (this: WebWorld, which: string, name: string) {
    const place = ["first", "second"].indexOf(which);
    assert.equal((await found(this).nth(place).innerText()).trim(), name);
  },
);

Then(
  "the navigation has {string}",
  async function (this: WebWorld, name: string) {
    assert.equal(
      await this.browserPage
        .locator(".menu-links a")
        .filter({ hasText: exactly(name) })
        .count(),
      1,
    );
  },
);

When(
  "{string} is pressed in the navigation",
  async function (this: WebWorld, name: string) {
    await this.browserPage
      .locator(".menu-links a")
      .filter({ hasText: exactly(name) })
      .click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "every word in the page's content but the players' names is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "main", [".player-name"]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);

Then(
  /^the page (says|does not say) there are more players than it shows$/,
  async function (this: WebWorld, which: string) {
    assert.equal(
      await this.browserPage.locator("main .search-more").count(),
      which === "says" ? 1 : 0,
    );
  },
);

Then(
  "the blurb to refine the search is after the last player shown",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage
        .locator("main .players-search-found + .search-more")
        .count(),
      1,
    );
  },
);
