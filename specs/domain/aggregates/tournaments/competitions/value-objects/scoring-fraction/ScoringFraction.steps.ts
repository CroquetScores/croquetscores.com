import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ScoringFraction } from "../../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/ScoringFraction.js";
import type { SpecWorld } from "../../../../../../support/world.js";

// The fraction a scenario works out, kept here rather than on the world, which
// has no business knowing what a scoring fraction is.
const fractions = new WeakMap<SpecWorld, ScoringFraction>();

// Hoops and a target are taken as floats so that a scenario can give one that
// is not whole, which is refused.
When(
  "the scoring fraction of {float} hoops with a target of {float} is worked out",
  function (this: SpecWorld, hoops: number, target: number) {
    try {
      fractions.set(this, ScoringFraction.from(hoops, target));
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then("the percentage is {int}", function (this: SpecWorld, percentage: number) {
  const fraction = fractions.get(this);
  assert.ok(
    fraction !== undefined,
    `No scoring fraction was worked out: ${inspect(this.failure)}`,
  );
  assert.equal(fraction.percentage, percentage);
});
