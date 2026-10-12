import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { isStruckThrough } from "../../support/struckThrough.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const games = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .player-games-list > .player-game");

const competitions = (world: SpecWorld): Locator =>
  world.browserPage.locator(
    "main .player-competitions-list .player-competition",
  );

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

When(
  /^the opponent in the (first|second|third) of the player's games is pressed$/,
  async function (this: SpecWorld, which: string) {
    await games(this)
      .nth(placeOf(which))
      .locator(".player-game-opponent")
      .click();
    await this.browserPage.waitForLoadState();
  },
);

When(
  "the competition {string} of the player is pressed",
  async function (this: SpecWorld, name: string) {
    await competitions(this).filter({ hasText: name }).click();
    await this.browserPage.waitForLoadState();
  },
);

// Its games ---------------------------------------------------------------------

Then(
  /^the (first|second|third) of the player's games says "(.*)"$/,
  async function (this: SpecWorld, which: string, words: string) {
    assert.equal(await said(games(this).nth(placeOf(which))), words);
  },
);

const noGames = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .player-games-none");

Then(
  /^the (first|second|third) of the player's games is (not )?marked as withdrawn$/,
  async function (this: SpecWorld, which: string, not: string | null) {
    assert.equal(
      (await games(this).nth(placeOf(which)).getAttribute("data-withdrawn")) !==
        null,
      not === null,
    );
  },
);

Then(
  /^the (first|second|third) of the player's games is struck through$/,
  async function (this: SpecWorld, which: string) {
    assert.ok(await isStruckThrough(games(this).nth(placeOf(which))));
  },
);

Then("the page says the player has no games", async function (this: SpecWorld) {
  assert.equal(await noGames(this).count(), 1);
});

Then(
  "the page does not say the player has no games",
  async function (this: SpecWorld) {
    assert.equal(await noGames(this).count(), 0);
  },
);

// Its competitions -------------------------------------------------------------------

Then(
  /^the (first|second|third) of the player's competitions is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    assert.equal(await said(competitions(this).nth(placeOf(which))), name);
  },
);

Then(
  "{string} is not among the player's competitions",
  async function (this: SpecWorld, name: string) {
    assert.ok(
      !(await competitions(this).allTextContents())
        .map((each) => each.trim())
        .includes(name),
      `${name} is among them.`,
    );
  },
);

Then(
  "the page says the player is in no competition",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator("main .player-competitions-none").count(),
      1,
    );
  },
);

// How it is laid out ---------------------------------------------------------------

const boxOf = async (
  found: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  return box;
};

Then(
  "the player's competitions are to the right of their games",
  async function (this: SpecWorld) {
    const theirGames = await boxOf(
      this.browserPage.locator("main .player-games"),
    );
    const theirs = await boxOf(
      this.browserPage.locator("main .player-competitions"),
    );
    assert.ok(
      theirs.x >= theirGames.x + theirGames.width,
      `They start ${String(theirs.x)} pixels across.`,
    );
  },
);

Then(
  "the player's competitions are above their games",
  async function (this: SpecWorld) {
    const theirGames = await boxOf(
      this.browserPage.locator("main .player-games"),
    );
    const theirs = await boxOf(
      this.browserPage.locator("main .player-competitions"),
    );
    assert.ok(
      theirs.y + theirs.height <= theirGames.y,
      `They end ${String(theirs.y + theirs.height)} pixels down.`,
    );
  },
);
