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

Then(
  "the scoring fraction is written {string}",
  function (this: SpecWorld, written: string) {
    const fraction = fractions.get(this);
    assert.ok(
      fraction !== undefined,
      `No scoring fraction was worked out: ${inspect(this.failure)}`,
    );
    assert.equal(String(fraction), written);
  },
);

// What reading a game's text gave, which is nothing where it is no scoring
// fraction: kept apart from the one a scenario works out, which it is not.
const reads = new WeakMap<SpecWorld, ScoringFraction | undefined>();

When(
  "{string} is read as a scoring fraction",
  function (this: SpecWorld, written: string) {
    reads.set(this, ScoringFraction.read(written));
  },
);

const readOf = (world: SpecWorld): ScoringFraction => {
  const read = reads.get(world);
  assert.ok(read !== undefined, "Nothing was read as a scoring fraction.");
  return read;
};

Then(
  "the scoring fraction has {int} hoops",
  function (this: SpecWorld, hoops: number) {
    assert.equal(readOf(this).hoops, hoops);
  },
);

Then("its target is {int}", function (this: SpecWorld, target: number) {
  assert.equal(readOf(this).target, target);
});

Then("nothing is read", function (this: SpecWorld) {
  assert.equal(reads.get(this), undefined);
});

// The winner's, declared by a w as a score's mark is.
When(
  "the scoring fraction of {float} hoops with a target of {float} declared the winner is worked out",
  function (this: SpecWorld, hoops: number, target: number) {
    try {
      fractions.set(this, ScoringFraction.from(hoops, target, true));
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then("it is declared the winner", function (this: SpecWorld) {
  assert.equal(readOf(this).won, true);
});

Then("it is not declared the winner", function (this: SpecWorld) {
  assert.equal(readOf(this).won, false);
});
