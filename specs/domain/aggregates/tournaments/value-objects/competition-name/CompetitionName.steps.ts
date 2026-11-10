import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { charactersIn } from "../../../../../../src/domain/common/charactersIn.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Making a name may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    world.competitionName = CompetitionName.from(given);
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the competition name {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a competition name of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a competition name of {int} characters with spaces around it is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${"a".repeat(length)}  `);
  },
);

When(
  "a competition name of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

Then(
  "the competition name is written {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(
      this.competitionName !== undefined,
      `No competition name has been made: ${inspect(this.failure)}`,
    );
    assert.equal(String(this.competitionName), name);
  },
);

Given(
  "the competition name {string}",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

Given(
  "a competition name of {int} characters",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

Given(
  "a competition name of {int} accented letters with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

When(
  "the competition name is given the number {int}",
  function (this: SpecWorld, number: number) {
    assert.ok(
      this.competitionName !== undefined,
      `No competition name has been made: ${inspect(this.failure)}`,
    );
    try {
      this.competitionName = this.competitionName.numbered(number);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the competition name is {int} characters long",
  function (this: SpecWorld, length: number) {
    assert.equal(charactersIn(String(this.competitionName)), length);
  },
);

Then(
  "the competition name is written ending {string}",
  function (this: SpecWorld, ending: string) {
    assert.ok(String(this.competitionName).endsWith(ending));
  },
);
