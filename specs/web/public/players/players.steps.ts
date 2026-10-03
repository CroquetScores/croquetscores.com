import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { Flags } from "../../../../src/domain/aggregates/tournaments/value-objects/Flags.js";
import type { SpecWorld } from "../../../support/world.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

// The words exactly, rather than any player whose name holds them.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const players = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .players > .player");

const playerNamed = (world: SpecWorld, name: string): Locator =>
  players(world).filter({
    has: world.browserPage.locator(".player-name", { hasText: exactly(name) }),
  });

const textOf = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").trim();

When(
  "the player {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await playerNamed(this, name).locator(".player-name").click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the players' page says there are no players",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator("main .players-none").count(),
      1,
    );
  },
);

Then(
  "the players' page does not say there are no players",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator("main .players-none").count(),
      0,
    );
  },
);

Then(
  /^"(.*)" is (not )?among the players$/,
  async function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(await playerNamed(this, name).count(), not === null ? 1 : 0);
  },
);

Then(
  /^the (first|second|third) player is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
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
  async function (this: SpecWorld, name: string, representing: string) {
    assert.equal(
      await textOf(playerNamed(this, name).locator(".player-representing")),
      representing,
    );
  },
);

Then(
  "the player {string} represents nothing",
  async function (this: SpecWorld, name: string) {
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
  async function (this: SpecWorld, name: string) {
    const found = playerNamed(this, name);
    assert.notEqual(
      await colourOf(found.locator(".player-representing")),
      await colourOf(found.locator(".player-name")),
    );
  },
);

const flagOf = (world: SpecWorld, name: string): Locator =>
  playerNamed(world, name).locator(".player-flag");

// The picture the flag is, as the site serves it, under whatever name it is
// given to be kept by.
Then(
  "the player {string} shows the flag of {string}",
  async function (this: SpecWorld, name: string, code: string) {
    const flag = Flags.thereAre.find(code);
    assert.ok(flag !== undefined, `There is no flag ${code}.`);
    const shown = (await flagOf(this, name).getAttribute("src")) ?? "";
    const [kept] = flag.relativePath.split(".");
    assert.ok(
      shown.includes(`/images/${kept!}.`),
      `The flag shown is ${shown}.`,
    );
  },
);

Then(
  "the flag {string} flies is named {string}",
  async function (this: SpecWorld, name: string, country: string) {
    assert.equal(await flagOf(this, name).getAttribute("alt"), country);
  },
);
