import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  isRole,
  roles,
} from "../../../../../../src/domain/aggregates/accounts/value-objects/Role.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What the scenario listed, or whether what it read back was a role. Kept here
// rather than on the world, which has no business knowing about roles.
const listed = new WeakMap<SpecWorld, readonly string[]>();
const readBack = new WeakMap<SpecWorld, boolean>();

When("every role is listed", function (this: SpecWorld) {
  listed.set(this, roles);
});

When(
  "{string} is read back as a role",
  function (this: SpecWorld, written: string) {
    readBack.set(this, isRole(written));
  },
);

const listedBy = (world: SpecWorld): readonly string[] => {
  const all = listed.get(world);
  assert.ok(all !== undefined, "No roles have been listed.");
  return all;
};

const wasARole = (world: SpecWorld): boolean => {
  const answer = readBack.get(world);
  assert.ok(answer !== undefined, "Nothing has been read back as a role.");
  return answer;
};

Then("there are {int} roles", function (this: SpecWorld, count: number) {
  assert.equal(listedBy(this).length, count);
});

Then("{string} is one of the roles", function (this: SpecWorld, kept: string) {
  assert.ok(
    listedBy(this).includes(kept),
    `The roles are ${listedBy(this).join(", ")}.`,
  );
});

Then("it is a role", function (this: SpecWorld) {
  assert.equal(wasARole(this), true);
});

Then("it is not a role", function (this: SpecWorld) {
  assert.equal(wasARole(this), false);
});
