import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Flag } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Flag.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a scenario leaves unsaid. A scenario about a flag's name gives it a path
// that is well made, and one about its path gives it a name that is, so that
// what is refused is only ever what the scenario named. A flag does not ask
// whether its name and its path agree, so these need not.
const A_NAME = "au";
const A_PATH = "famfamfam/flags/au.png";

// Making a flag may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, name: string, path: string): void => {
  try {
    world.flag = Flag.from(name, path);
  } catch (failure) {
    world.failure = failure;
  }
};

const flagOfWorld = (world: SpecWorld): Flag => {
  assert.ok(
    world.flag !== undefined,
    `No flag has been made: ${inspect(world.failure)}`,
  );
  return world.flag;
};

const otherFlagOfWorld = (world: SpecWorld): Flag => {
  assert.ok(world.otherFlag !== undefined, "No other flag has been made.");
  return world.otherFlag;
};

Given("the flag {string}", function (this: SpecWorld, name: string) {
  this.flag = Flag.from(name, A_PATH);
});

Given(
  "a flag with the relative path {string}",
  function (this: SpecWorld, path: string) {
    this.flag = Flag.from(A_NAME, path);
  },
);

// Made again with the name it already has: a flag, once made, does not change.
Given("its image is at {string}", function (this: SpecWorld, path: string) {
  this.flag = Flag.from(String(flagOfWorld(this)), path);
});

Given("another flag {string}", function (this: SpecWorld, name: string) {
  this.otherFlag = Flag.from(name, A_PATH);
});

Given(
  "the other flag's image is at {string}",
  function (this: SpecWorld, path: string) {
    this.otherFlag = Flag.from(String(otherFlagOfWorld(this)), path);
  },
);

When("the flag {string} is made", function (this: SpecWorld, name: string) {
  tryToMake(this, name, A_PATH);
});

When(
  "a flag is made with the relative path {string}",
  function (this: SpecWorld, path: string) {
    tryToMake(this, A_NAME, path);
  },
);

When(
  "it is compared with the flag {string}",
  function (this: SpecWorld, other: string) {
    this.sameFlag = flagOfWorld(this).equals(Flag.from(other, A_PATH));
  },
);

When("they are compared", function (this: SpecWorld) {
  this.sameFlag = flagOfWorld(this).equals(otherFlagOfWorld(this));
});

Then("they are the same flag", function (this: SpecWorld) {
  assert.equal(this.sameFlag, true);
});

Then("they are different flags", function (this: SpecWorld) {
  assert.equal(this.sameFlag, false);
});

Then("the flag is written {string}", function (this: SpecWorld, name: string) {
  assert.equal(String(flagOfWorld(this)), name);
});

Then("its relative path is {string}", function (this: SpecWorld, path: string) {
  assert.equal(flagOfWorld(this).relativePath, path);
});
