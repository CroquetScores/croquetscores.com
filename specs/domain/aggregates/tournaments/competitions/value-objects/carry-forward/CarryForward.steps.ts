import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { CarryForward } from "../../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import {
  COUNT,
  NUMBER,
  countCalled,
  pendingCounts,
  toHave,
  toHaveNone,
} from "./aCarryForward.js";

// Kept here rather than on the world, which has no business knowing what a
// carry forward is: the one made, and the two compared.
const made = new WeakMap<SpecWorld, CarryForward>();
const compared = new WeakMap<
  SpecWorld,
  { one?: CarryForward; other?: CarryForward; same?: boolean }
>();

const comparedOf = (world: SpecWorld) => {
  let found = compared.get(world);
  if (found === undefined) {
    found = {};
    compared.set(world, found);
  }
  return found;
};

// Making one may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld): void => {
  try {
    made.set(world, CarryForward.from(pendingCounts(world)));
  } catch (failure) {
    world.failure = failure;
  }
};

const madeOf = (world: SpecWorld): CarryForward => {
  const kept = made.get(world);
  assert.ok(
    kept !== undefined,
    `No carry forward was made: ${inspect(world.failure)}`,
  );
  return kept;
};

// Said wherever a carry forward is given (CompetitionPlayer.feature,
// changeCarryForward.feature), so defined once, here.
Given(
  new RegExp(`^the carry forward is to have ${COUNT} of ${NUMBER}$`),
  function (this: SpecWorld, count: string, value: string) {
    toHave(this, countCalled(count), Number(value));
  },
);

Given("the carry forward is to have no counts", function (this: SpecWorld) {
  toHaveNone(this);
});

Given(
  new RegExp(`^a carry forward made with ${COUNT} of ${NUMBER}$`),
  function (this: SpecWorld, count: string, value: string) {
    comparedOf(this).one = CarryForward.from({
      [countCalled(count)]: Number(value),
    });
  },
);

Given(
  new RegExp(`^another carry forward made with ${COUNT} of ${NUMBER}$`),
  function (this: SpecWorld, count: string, value: string) {
    comparedOf(this).other = CarryForward.from({
      [countCalled(count)]: Number(value),
    });
  },
);

Given("another carry forward made with no counts", function (this: SpecWorld) {
  comparedOf(this).other = CarryForward.from({});
});

When("the carry forward is made", function (this: SpecWorld) {
  tryToMake(this);
});

When("a carry forward of no counts is made", function (this: SpecWorld) {
  toHaveNone(this);
  tryToMake(this);
});

When("the carry forwards are compared", function (this: SpecWorld) {
  const both = comparedOf(this);
  assert.ok(both.one !== undefined, "No carry forward was made to compare.");
  both.same = both.one.equals(both.other);
});

Then(
  new RegExp(`^its ${COUNT} are ${NUMBER}$`),
  function (this: SpecWorld, count: string, value: string) {
    assert.equal(madeOf(this).of(countCalled(count)), Number(value));
  },
);

Then(
  new RegExp(`^its ${COUNT} are nothing$`),
  function (this: SpecWorld, count: string) {
    assert.equal(madeOf(this).of(countCalled(count)), undefined);
  },
);

Then("it carries nothing forward", function (this: SpecWorld) {
  assert.equal(madeOf(this).carriesAnything, false);
});

Then("it carries something forward", function (this: SpecWorld) {
  assert.equal(madeOf(this).carriesAnything, true);
});

Then("they are the same carry forward", function (this: SpecWorld) {
  assert.equal(comparedOf(this).same, true);
});

Then("they are different carry forwards", function (this: SpecWorld) {
  assert.equal(comparedOf(this).same, false);
});
