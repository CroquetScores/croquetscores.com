import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ExpectedMatches } from "../../../../../../src/domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import type { SpecWorld } from "../../../../../support/world.js";

// Kept here rather than on the world, which has no business knowing what a
// test's expected matches are.
const made = new WeakMap<SpecWorld, ExpectedMatches>();

// Making them may be refused, and the scenario says which it expects.
When(
  "the expected matches {float} are made",
  function (this: SpecWorld, given: number) {
    try {
      made.set(this, ExpectedMatches.from(given));
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the expected matches are {int}",
  function (this: SpecWorld, count: number) {
    const kept = made.get(this);
    assert.ok(
      kept !== undefined,
      `No expected matches were made: ${inspect(this.failure)}`,
    );
    assert.equal(kept.count, count);
  },
);
