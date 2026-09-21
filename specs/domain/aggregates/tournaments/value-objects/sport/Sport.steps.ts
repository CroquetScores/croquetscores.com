import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Sport } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Sport.js";
import type { SpecWorld } from "../../../../../support/world.js";

const sportOfWorld = (world: SpecWorld): Sport => {
  assert.ok(
    world.sport !== undefined,
    `No sport has been made: ${inspect(world.failure)}`,
  );
  return world.sport;
};

Given("the sport {string}", function (this: SpecWorld, code: string) {
  this.sport = Sport.from(code);
});

// Making a sport may be refused, and the scenario says which it expects.
When("the sport {string} is made", function (this: SpecWorld, code: string) {
  try {
    this.sport = Sport.from(code);
  } catch (failure) {
    this.failure = failure;
  }
});

When(
  "it is compared with the sport {string}",
  function (this: SpecWorld, code: string) {
    this.sameSport = sportOfWorld(this).equals(Sport.from(code));
  },
);

Then("they are the same sport", function (this: SpecWorld) {
  assert.equal(this.sameSport, true);
});

Then("they are different sports", function (this: SpecWorld) {
  assert.equal(this.sameSport, false);
});

Then("the sport's name is {string}", function (this: SpecWorld, name: string) {
  assert.equal(sportOfWorld(this).name, name);
});
