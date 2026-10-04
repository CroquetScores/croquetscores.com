import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

// A game is said in the words the tournament's page says it in
// (tournament.steps.ts), since it is shown as that page shows it. What is
// here is what is not beside a game of a block's.

Then(
  /^the first line of the (first|second|third) game is beside nothing$/,
  async function (this: SpecWorld, which: string) {
    const at = ["first", "second", "third"].indexOf(which);
    assert.equal(
      await this.browserPage
        .locator("main .games > .game")
        .nth(at)
        .locator(".game-competition")
        .count(),
      0,
    );
  },
);
