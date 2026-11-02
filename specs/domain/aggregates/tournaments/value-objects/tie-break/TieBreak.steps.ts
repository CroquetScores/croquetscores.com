import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TieBreak } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TieBreak.js";
import type { SpecWorld } from "../../../../../support/world.js";

const tieBreakOfWorld = (world: SpecWorld): TieBreak => {
  assert.ok(
    world.tieBreak !== undefined,
    `No tie break has been made: ${inspect(world.failure)}`,
  );
  return world.tieBreak;
};

Given("the tie break {string}", function (this: SpecWorld, code: string) {
  this.tieBreak = TieBreak.from(code);
});

// Making a tie break may be refused, and the scenario says which it expects.
When(
  "the tie break {string} is made",
  function (this: SpecWorld, code: string) {
    try {
      this.tieBreak = TieBreak.from(code);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

When(
  "it is compared with the tie break {string}",
  function (this: SpecWorld, code: string) {
    this.sameTieBreak = tieBreakOfWorld(this).equals(TieBreak.from(code));
  },
);

When(
  "the tie break a block goes by unless told otherwise is asked for",
  function (this: SpecWorld) {
    this.tieBreak = TieBreak.unlessTold;
  },
);

Then("they are the same tie break", function (this: SpecWorld) {
  assert.equal(this.sameTieBreak, true);
});

Then("they are different tie breaks", function (this: SpecWorld) {
  assert.equal(this.sameTieBreak, false);
});

Then(
  "the tie break's code is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(tieBreakOfWorld(this).code, code);
  },
);
