import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

// The words exactly, rather than any player whose name holds them.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const players = (world: WebWorld): Locator =>
  world.browserPage.locator("main .players > .player");

const playerNamed = (world: WebWorld, name: string): Locator =>
  players(world).filter({
    has: world.browserPage.locator(".player-name", { hasText: exactly(name) }),
  });

const textOf = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").trim();

When(
  "the player {string} is pressed",
  async function (this: WebWorld, name: string) {
    await playerNamed(this, name).locator(".player-name").click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the players' page says there are no players",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage.locator("main .players-none").count(),
      1,
    );
  },
);

Then(
  "the players' page does not say there are no players",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage.locator("main .players-none").count(),
      0,
    );
  },
);

Then(
  /^"(.*)" is (not )?among the players$/,
  async function (this: WebWorld, name: string, not: string | null) {
    assert.equal(await playerNamed(this, name).count(), not === null ? 1 : 0);
  },
);

Then(
  /^the (first|second|third) player is "(.*)"$/,
  async function (this: WebWorld, which: string, name: string) {
    assert.equal(
      await textOf(
        players(this)
          .nth(["first", "second", "third"].indexOf(which))
          .locator(".player-name"),
      ),
      name,
    );
  },
);

Then(
  "the player {string} represents {string}",
  async function (this: WebWorld, name: string, representing: string) {
    assert.equal(
      await textOf(playerNamed(this, name).locator(".player-representing")),
      representing,
    );
  },
);

Then(
  "the player {string} represents nothing",
  async function (this: WebWorld, name: string) {
    assert.equal(await playerNamed(this, name).count(), 1);
    assert.equal(
      await playerNamed(this, name).locator(".player-representing").count(),
      0,
    );
  },
);

// What the browser has of its own that this asks of it, since the specs are
// typed without the browser's own types.
interface InThePage {
  getComputedStyle(element: unknown): { readonly color: string };
}

const colourOf = (found: Locator): Promise<string> =>
  found.evaluate(
    (element) =>
      (globalThis as unknown as InThePage).getComputedStyle(element).color,
  );

// Drawn in another colour than the name, which on the panel is lighter: the
// name is a link, in the link's colour, and what they represent is in the
// muted ink, which is the lighter.
Then(
  "what the player {string} represents is lighter than their name",
  async function (this: WebWorld, name: string) {
    const found = playerNamed(this, name);
    assert.notEqual(
      await colourOf(found.locator(".player-representing")),
      await colourOf(found.locator(".player-name")),
    );
  },
);

const flagOf = (world: WebWorld, name: string): Locator =>
  playerNamed(world, name).locator(".player-flag");

// The picture the flag is, as the site serves it, under whatever name it is
// given to be kept by.
Then(
  "the player {string} shows the flag of {string}",
  async function (this: WebWorld, name: string, code: string) {
    const shown = (await flagOf(this, name).getAttribute("src")) ?? "";
    assert.ok(
      shown.includes(`/images/famfamfam/flags/${code}.`),
      `The flag shown is ${shown}.`,
    );
  },
);

Then(
  "the flag {string} flies is named {string}",
  async function (this: WebWorld, name: string, country: string) {
    assert.equal(await flagOf(this, name).getAttribute("alt"), country);
  },
);

// A tournament played by teams, team by team ---------------------------------------

const teamsOnPage = (world: WebWorld): Locator =>
  world.browserPage.locator("main .players-team");

const teamOnPage = (world: WebWorld, name: string): Locator =>
  teamsOnPage(world).filter({
    has: world.browserPage.locator(".players-team-name", {
      hasText: new RegExp(`^${name}$`),
    }),
  });

Then(
  /^the (first|second|third) team on the players' page is headed "(.*)"$/,
  async function (this: WebWorld, which: string, name: string) {
    assert.equal(
      (
        await teamsOnPage(this)
          .nth(["first", "second", "third"].indexOf(which))
          .locator(".players-team-name")
          .innerText()
      ).trim(),
      name,
    );
  },
);

Then(
  /^the (first|second|third) player of the team "(.*)" on the players' page is "(.*)"$/,
  async function (this: WebWorld, which: string, team: string, name: string) {
    assert.equal(
      (
        await teamOnPage(this, team)
          .locator(".player")
          .nth(["first", "second", "third"].indexOf(which))
          .innerText()
      ).trim(),
      name,
    );
  },
);
