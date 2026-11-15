import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

// A game is said in the words the tournament's page says it in
// (tournament.steps.ts), since it is shown as that page shows it. What is
// here is what a game of a block's does not show.

Then(
  /^the (first|second|third) game names no competition$/,
  async function (this: SpecWorld, which: string) {
    const at = ["first", "second", "third"].indexOf(which);
    assert.equal(
      await this.browserPage
        .locator("main :is(.games, .games-table) .game")
        .nth(at)
        .locator(".game-competition")
        .count(),
      0,
    );
  },
);

// The headings above the games, and the way back beneath them. A heading is
// found by its words, and marked as sorted by what it says of itself.

const headings = (world: SpecWorld) =>
  world.browserPage.locator("main .games-table thead th");

const headingNamed = (world: SpecWorld, words: string) =>
  headings(world).filter({ hasText: words });

const wayBack = (world: SpecWorld) =>
  world.browserPage.locator("main p.games-usual a");

Then(
  /^the (first|second) heading of the games is "(.*)"$/,
  async function (this: SpecWorld, which: string, words: string) {
    const at = which === "first" ? 0 : 1;
    // The arrow that marks a sorting is drawn in the heading, so only the
    // words are compared.
    assert.equal(
      (
        (await headings(this)
          .nth(at)
          .locator(".games-column-words")
          .textContent()) ?? ""
      ).trim(),
      words,
    );
  },
);

Then("the games have no headings", async function (this: SpecWorld) {
  assert.equal(await headings(this).count(), 0);
});

When(
  "the heading {string} of the games is pressed",
  async function (this: SpecWorld, words: string) {
    await Promise.all([
      this.browserPage.waitForLoadState(),
      headingNamed(this, words).locator("a").click(),
    ]);
    await this.browserPage.waitForLoadState();
  },
);

Then(
  /^the heading "(.*)" of the games is marked as sorted (ascending|descending)$/,
  async function (this: SpecWorld, words: string, way: string) {
    assert.equal(
      await headingNamed(this, words).getAttribute("aria-sort"),
      way,
    );
  },
);

Then(
  "the heading {string} of the games is not marked as sorted",
  async function (this: SpecWorld, words: string) {
    assert.equal(
      await headingNamed(this, words).getAttribute("aria-sort"),
      null,
    );
  },
);

Then(
  "the games offer the way back to their usual order",
  async function (this: SpecWorld) {
    assert.equal(await wayBack(this).count(), 1);
  },
);

Then(
  "the games offer no way back to their usual order",
  async function (this: SpecWorld) {
    assert.equal(await wayBack(this).count(), 0);
  },
);

When(
  "the way back to the usual order of the games is pressed",
  async function (this: SpecWorld) {
    await wayBack(this).click();
    await this.browserPage.waitForLoadState();
  },
);
