import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ManagerNoteTitle } from "../../../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Kept here rather than on the world, which has no business knowing what a
// note's title is.
const made = new WeakMap<SpecWorld, ManagerNoteTitle>();

// Making a title may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    made.set(world, ManagerNoteTitle.from(given));
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the manager note title {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a manager note title of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a manager note title of {int} characters with spaces around it is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${"a".repeat(length)}  `);
  },
);

When(
  "a manager note title of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

Then(
  "the manager note title is written {string}",
  function (this: SpecWorld, title: string) {
    const kept = made.get(this);
    assert.ok(
      kept !== undefined,
      `No title has been made: ${inspect(this.failure)}`,
    );
    assert.equal(String(kept), title);
  },
);
