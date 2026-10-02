import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TeamName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TeamName.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Kept here rather than on the world, which has no business knowing what a
// team's name is.
const made = new WeakMap<SpecWorld, TeamName>();

// Making a name may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    made.set(world, TeamName.from(given));
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the team name {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a team name of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a team name of {int} characters with spaces around it is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${"a".repeat(length)}  `);
  },
);

When(
  "a team name of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

Then(
  "the team name is written {string}",
  function (this: SpecWorld, name: string) {
    const kept = made.get(this);
    assert.ok(
      kept !== undefined,
      `No team name has been made: ${inspect(this.failure)}`,
    );
    assert.equal(String(kept), name);
  },
);
