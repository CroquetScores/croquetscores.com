import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again. The
// views offered are said with a block's (block.steps.ts).

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const tableOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .test-matches");

const matchAt = (world: SpecWorld, which: string): Locator =>
  tableOf(world).locator("tbody > tr.test-match").nth(placeOf(which));

const gameAt = (world: SpecWorld, game: string, match: string): Locator =>
  matchAt(world, match).locator(".test-game").nth(placeOf(game));

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

Then(
  "the test says each match is the best of {int}",
  async function (this: SpecWorld, games: number) {
    assert.equal(
      await said(this.browserPage.locator("main .test-best-of")),
      `Each match is the best of ${String(games)}.`,
    );
  },
);

Then(
  /^the test's table is headed "(.*)" on the (left|right)$/,
  async function (this: SpecWorld, team: string, side: string) {
    assert.equal(
      await said(
        tableOf(this)
          .locator("thead .test-team")
          .nth(side === "left" ? 0 : 1),
      ),
      team,
    );
  },
);

Then(
  /^the (first|second|third) match of the test is "(.*)" against "(.*)"$/,
  async function (this: SpecWorld, which: string, left: string, right: string) {
    const sides = matchAt(this, which).locator(".test-side");
    assert.deepEqual(
      [await said(sides.nth(0)), await said(sides.nth(1))],
      [left, right],
    );
  },
);

// As it is shown, each side's score with a hyphen between.
Then(
  /^the (first|second|third) game of the (first|second|third) match of the test is "(.*)"$/,
  async function (this: SpecWorld, game: string, match: string, words: string) {
    const scores = gameAt(this, game, match).locator(".test-score");
    assert.equal(
      `${await said(scores.nth(0))} - ${await said(scores.nth(1))}`,
      words,
    );
  },
);

Then(
  /^the (first|second) side's score in the (first|second|third) game of the (first|second|third) match of the test is (not )?marked as won$/,
  async function (
    this: SpecWorld,
    side: string,
    game: string,
    match: string,
    not: string | null,
  ) {
    const score = gameAt(this, game, match)
      .locator(".test-score")
      .nth(placeOf(side));
    assert.equal(
      /\btest-won\b/.test((await score.getAttribute("class")) ?? ""),
      not === null,
    );
  },
);

Then(
  "the test's {string} are {string} on the left and {string} on the right",
  async function (
    this: SpecWorld,
    heading: string,
    left: string,
    right: string,
  ) {
    const row = tableOf(this)
      .locator("tfoot tr")
      .filter({
        has: this.browserPage.locator(".test-total-name", { hasText: heading }),
      });
    const numbers = row.locator(".test-total-number");
    assert.deepEqual(
      [await said(numbers.nth(0)), await said(numbers.nth(1))],
      [left, right],
    );
  },
);

Then(
  "the view {string} is not offered",
  async function (this: SpecWorld, name: string) {
    assert.equal(
      await this.browserPage
        .locator("main .competition-views .competition-view", {
          hasText: new RegExp(`^${name}$`),
        })
        .count(),
      0,
    );
  },
);
