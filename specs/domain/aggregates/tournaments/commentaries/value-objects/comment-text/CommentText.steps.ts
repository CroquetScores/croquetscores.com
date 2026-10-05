import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { CommentText } from "../../../../../../../src/domain/aggregates/tournaments/commentaries/value-objects/CommentText.js";
import type { SpecWorld } from "../../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// A feature cannot write a line break inside a step's quotes, so it writes
// "\n", which is read here as the line break it stands for.
const withLineBreaks = (written: string): string =>
  written.replaceAll("\\n", "\n");

// Kept here rather than on the world, which has no business knowing what a
// comment says.
const made = new WeakMap<SpecWorld, CommentText>();

// Making a comment may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    made.set(world, CommentText.from(given));
  } catch (failure) {
    world.failure = failure;
  }
};

When("the comment {string} is made", function (this: SpecWorld, given: string) {
  tryToMake(this, withLineBreaks(given));
});

When(
  "a comment of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a comment of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

Then(
  "the comment is written {string}",
  function (this: SpecWorld, text: string) {
    const kept = made.get(this);
    assert.ok(
      kept !== undefined,
      `No comment has been made: ${inspect(this.failure)}`,
    );
    assert.equal(String(kept), withLineBreaks(text));
  },
);
