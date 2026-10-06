import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ManagerNoteDescription } from "../../../../../../src/domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// A feature cannot write a line break inside a step's quotes, so it writes
// "\n", which is read here as the line break it stands for.
const withLineBreaks = (written: string): string =>
  written.replaceAll("\\n", "\n");

// What was made, which may be no description at all, kept here rather than on
// the world, which has no business knowing what a note says.
const made = new WeakMap<
  SpecWorld,
  { readonly description: ManagerNoteDescription | undefined }
>();

// Making a description may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    made.set(world, { description: ManagerNoteDescription.from(given) });
  } catch (failure) {
    world.failure = failure;
  }
};

const madeBy = (
  world: SpecWorld,
): { readonly description: ManagerNoteDescription | undefined } => {
  const kept = made.get(world);
  assert.ok(
    kept !== undefined,
    `Nothing has been made: ${inspect(world.failure)}`,
  );
  return kept;
};

When(
  "the manager note description {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, withLineBreaks(given));
  },
);

When(
  "a manager note description of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a manager note description of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

Then(
  "the manager note description is written {string}",
  function (this: SpecWorld, description: string) {
    assert.equal(String(madeBy(this).description), withLineBreaks(description));
  },
);

Then("there is no manager note description", function (this: SpecWorld) {
  assert.equal(madeBy(this).description, undefined);
});
