import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { CommentaryTitle } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Kept here rather than on the world, which has no business knowing what a
// commentary's title is.
const made = new WeakMap<SpecWorld, CommentaryTitle>();

// Making a title may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    made.set(world, CommentaryTitle.from(given));
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the commentary title {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a commentary title of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a commentary title of {int} characters with spaces around it is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${"a".repeat(length)}  `);
  },
);

When(
  "a commentary title of {int} characters wrapped in {string} is made",
  function (this: SpecWorld, length: number, tag: string) {
    tryToMake(this, `${tag}${"a".repeat(length)}${tag.replace("<", "</")}`);
  },
);

When(
  "a commentary title of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

Then(
  "the commentary title is written {string}",
  function (this: SpecWorld, title: string) {
    const kept = made.get(this);
    assert.ok(
      kept !== undefined,
      `No commentary title has been made: ${inspect(this.failure)}`,
    );
    assert.equal(String(kept), title);
  },
);
