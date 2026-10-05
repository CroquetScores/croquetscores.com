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
  "a comment of {int} characters wrapped in {string} is made",
  function (this: SpecWorld, length: number, tag: string) {
    tryToMake(this, `${tag}${"a".repeat(length)}${tag.replace("<", "</")}`);
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

// How long making the comment took, by the clock of the machine running the
// scenario, kept for the step that says how long it may take.
const tookMilliseconds = new WeakMap<SpecWorld, number>();

// "<" a hundred thousand times and then "b>" as many, which is a "<b>" inside
// a "<b>" inside a "<b>" all the way down, each left only once the one inside
// it is taken out.
When(
  "a comment of {int} tags typed inside one another is made",
  function (this: SpecWorld, count: number) {
    const typed = `${"<".repeat(count)}${"b>".repeat(count)}`;
    const started = performance.now();
    tryToMake(this, typed);
    tookMilliseconds.set(this, performance.now() - started);
  },
);

Then("it was made within a second", function (this: SpecWorld) {
  const took = tookMilliseconds.get(this);
  assert.ok(took !== undefined, "Nothing was timed.");
  assert.ok(took < 1000, `It took ${String(Math.round(took))} milliseconds.`);
});
