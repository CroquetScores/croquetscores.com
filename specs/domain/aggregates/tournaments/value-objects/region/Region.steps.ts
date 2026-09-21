import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Region } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Region.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a scenario leaves unsaid. A scenario about a region's code gives it a
// name that is well made, and one about its name gives it a code that is, so
// that what is refused is only ever what the scenario named.
const A_CODE = "vic";
const A_NAME = "Victoria";

// Making a region may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, code: string, name: string): void => {
  try {
    world.region = Region.from(code, name);
  } catch (failure) {
    world.failure = failure;
  }
};

const regionOfWorld = (world: SpecWorld): Region => {
  assert.ok(
    world.region !== undefined,
    `No region has been made or found: ${inspect(world.failure)}`,
  );
  return world.region;
};

When("the region {string} is made", function (this: SpecWorld, code: string) {
  tryToMake(this, code, A_NAME);
});

When(
  "the region {string} is made with its accent typed after the letter",
  function (this: SpecWorld, code: string) {
    tryToMake(this, code.normalize("NFD"), A_NAME);
  },
);

When(
  "a region named {string} is made",
  function (this: SpecWorld, name: string) {
    tryToMake(this, A_CODE, name);
  },
);

// Also asked of a region a country's steps have found.
Then("the region's code is {string}", function (this: SpecWorld, code: string) {
  assert.equal(regionOfWorld(this).code, code);
});

Then("the region's name is {string}", function (this: SpecWorld, name: string) {
  assert.equal(regionOfWorld(this).name, name);
});
