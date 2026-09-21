import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TournamentNotes } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TournamentNotes.js";
import type { SpecWorld } from "../../../../../support/world.js";

// Making notes can make none, so what was made is kept apart from whether
// anything was: "there are no notes" must not pass because nothing was tried.
const madeOfWorld = (
  world: SpecWorld,
): { notes: TournamentNotes | undefined } => {
  assert.ok(
    world.madeNotes !== undefined,
    `No notes have been made: ${inspect(world.failure)}`,
  );
  return world.madeNotes;
};

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Making notes may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, text: string): void => {
  try {
    world.madeNotes = { notes: TournamentNotes.from(text) };
  } catch (failure) {
    world.failure = failure;
  }
};

const notesOfWorld = (world: SpecWorld): TournamentNotes => {
  const { notes } = madeOfWorld(world);
  assert.ok(notes !== undefined, "The notes made are no notes.");
  return notes;
};

When("the notes {string} are made", function (this: SpecWorld, text: string) {
  tryToMake(this, text);
});

When("the notes are made from:", function (this: SpecWorld, text: string) {
  tryToMake(this, text);
});

When(
  "notes of {int} characters are made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "notes of {int} characters with spaces around them are made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${"a".repeat(length)}  `);
  },
);

When(
  "notes of {int} accented letters are made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

When(
  "notes of {int} characters followed by {string} are made",
  function (this: SpecWorld, length: number, html: string) {
    tryToMake(this, "a".repeat(length) + html);
  },
);

Then("the notes are {string}", function (this: SpecWorld, markdown: string) {
  assert.equal(notesOfWorld(this).markdown, markdown);
});

Then("the notes read:", function (this: SpecWorld, markdown: string) {
  assert.equal(notesOfWorld(this).markdown, markdown);
});

Then("there are no notes", function (this: SpecWorld) {
  assert.equal(madeOfWorld(this).notes, undefined);
});
