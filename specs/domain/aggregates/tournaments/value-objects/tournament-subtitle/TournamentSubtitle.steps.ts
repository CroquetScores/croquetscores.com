import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TournamentSubtitle } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TournamentSubtitle.js";
import type { SpecWorld } from "../../../../../support/world.js";

// Making a subtitle can make none, so what was made is kept apart from whether
// anything was: "there is no subtitle" must not pass because nothing was tried.
const madeOfWorld = (
  world: SpecWorld,
): { subtitle: TournamentSubtitle | undefined } => {
  assert.ok(
    world.madeSubtitle !== undefined,
    `No subtitle has been made: ${inspect(world.failure)}`,
  );
  return world.madeSubtitle;
};

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Making a subtitle may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, text: string): void => {
  try {
    world.madeSubtitle = { subtitle: TournamentSubtitle.from(text) };
  } catch (failure) {
    world.failure = failure;
  }
};

const subtitleOfWorld = (world: SpecWorld): TournamentSubtitle => {
  const { subtitle } = madeOfWorld(world);
  assert.ok(subtitle !== undefined, "The subtitle made is no subtitle.");
  return subtitle;
};

When("the subtitle {string} is made", function (this: SpecWorld, text: string) {
  tryToMake(this, text);
});

When("the subtitle is made from:", function (this: SpecWorld, text: string) {
  tryToMake(this, text);
});

When(
  "a subtitle of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a subtitle of {int} characters with spaces around it is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${"a".repeat(length)}  `);
  },
);

When(
  "a subtitle of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

When(
  "a subtitle of {int} characters followed by {string} is made",
  function (this: SpecWorld, length: number, html: string) {
    tryToMake(this, "a".repeat(length) + html);
  },
);

Then("the subtitle is {string}", function (this: SpecWorld, markdown: string) {
  assert.equal(subtitleOfWorld(this).markdown, markdown);
});

Then("the subtitle reads:", function (this: SpecWorld, markdown: string) {
  assert.equal(subtitleOfWorld(this).markdown, markdown);
});

Then("there is no subtitle", function (this: SpecWorld) {
  assert.equal(madeOfWorld(this).subtitle, undefined);
});
