import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Rounds } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import type { SpecWorld } from "../../../../../support/world.js";

const roundsWorld = (world: SpecWorld): Rounds => {
  assert.ok(
    world.rounds !== undefined,
    `No number of rounds has been made: ${inspect(world.failure)}`,
  );
  return world.rounds;
};

// Making a number of rounds may be refused, and the scenario says which it
// expects.
When(
  "a number of rounds of {float} is made",
  function (this: SpecWorld, rounds: number) {
    try {
      this.rounds = Rounds.from(rounds);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the number of rounds is {int}",
  function (this: SpecWorld, rounds: number) {
    assert.equal(roundsWorld(this).count, rounds);
  },
);
