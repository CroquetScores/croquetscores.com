import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { KnockoutDraw } from "../../../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { positionOf } from "../../ordinals.js";

const drawOfWorld = (world: SpecWorld): KnockoutDraw => {
  assert.ok(
    world.knockoutDraw !== undefined,
    `No knockout draw has been made: ${inspect(world.failure)}`,
  );
  return world.knockoutDraw;
};

Given("a draw of {int} place(s)", function (this: SpecWorld, places: number) {
  this.drawPlaces = places;
});

Given(
  "the best-of for each of its {int} rounds is {int}",
  function (this: SpecWorld, rounds: number, games: number) {
    this.drawRounds = Array.from({ length: rounds }, () => games);
  },
);

Given("no best-ofs", function (this: SpecWorld) {
  this.drawRounds = [];
});

Given(
  "the best-of for the {word} round is {int}",
  function (this: SpecWorld, ordinal: string, games: number) {
    this.drawRounds[positionOf(ordinal)] = games;
  },
);

// Making a draw may be refused, and the scenario says which it expects.
When("the knockout draw is made", function (this: SpecWorld) {
  assert.ok(this.drawPlaces !== undefined, "No number of places was named.");
  try {
    this.knockoutDraw = KnockoutDraw.from(this.drawPlaces, this.drawRounds);
  } catch (failure) {
    this.failure = failure;
  }
});

Then("the draw has {int} places", function (this: SpecWorld, places: number) {
  assert.equal(drawOfWorld(this).places, places);
});

Then(
  "the {word} round is the best of {int}",
  function (this: SpecWorld, ordinal: string, games: number) {
    assert.equal(drawOfWorld(this).rounds[positionOf(ordinal)]?.games, games);
  },
);
