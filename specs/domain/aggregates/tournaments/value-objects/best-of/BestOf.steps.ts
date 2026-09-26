import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import type { SpecWorld } from "../../../../../support/world.js";

const bestOfWorld = (world: SpecWorld): BestOf => {
  assert.ok(
    world.bestOf !== undefined,
    `No best-of has been made: ${inspect(world.failure)}`,
  );
  return world.bestOf;
};

Given("a best-of of {int}", function (this: SpecWorld, games: number) {
  this.bestOf = BestOf.from(games);
});

// Making a best-of may be refused, and the scenario says which it expects.
When("a best-of of {float} is made", function (this: SpecWorld, games: number) {
  try {
    this.bestOf = BestOf.from(games);
  } catch (failure) {
    this.failure = failure;
  }
});

Then("the best-of is {int}", function (this: SpecWorld, games: number) {
  assert.equal(bestOfWorld(this).games, games);
});

Then("the best-of is odd", function (this: SpecWorld) {
  assert.equal(bestOfWorld(this).isOdd, true);
});

Then("the best-of is not odd", function (this: SpecWorld) {
  assert.equal(bestOfWorld(this).isOdd, false);
});
