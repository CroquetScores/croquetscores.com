import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TestGroup } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TestGroup.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What making a group came to, kept here rather than on the world, which has
// no business knowing what a test's group is. Making one can come to no group
// at all, which is not the same as not having been made.
const made = new WeakMap<
  SpecWorld,
  { readonly group: TestGroup | undefined }
>();

// Making a group may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    made.set(world, { group: TestGroup.from(given) });
  } catch (failure) {
    world.failure = failure;
  }
};

const madeOf = (world: SpecWorld): TestGroup | undefined => {
  const kept = made.get(world);
  assert.ok(
    kept !== undefined,
    `No group has been made: ${inspect(world.failure)}`,
  );
  return kept.group;
};

When(
  "the test group {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a test group of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

Then(
  "the test group is written {string}",
  function (this: SpecWorld, group: string) {
    assert.equal(String(madeOf(this)), group);
  },
);

Then("there is no test group", function (this: SpecWorld) {
  assert.equal(madeOf(this), undefined);
});
