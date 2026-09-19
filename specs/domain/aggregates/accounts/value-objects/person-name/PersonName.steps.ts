import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { PersonName } from "../../../../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Making a name may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    world.personName = PersonName.from(given);
  } catch (failure) {
    world.failure = failure;
  }
};

When("the name {string} is made", function (this: SpecWorld, given: string) {
  tryToMake(this, given);
});

When(
  "the name {string} is made with its accent typed after the letter",
  function (this: SpecWorld, given: string) {
    const typed = given.normalize("NFD");
    assert.notEqual(typed, given, `"${given}" has no accent to type after.`);
    tryToMake(this, typed);
  },
);

When(
  "a name of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a name of {int} characters with spaces around it is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${"a".repeat(length)}  `);
  },
);

When(
  "a name of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

Then("the name is written {string}", function (this: SpecWorld, name: string) {
  assert.ok(
    this.personName !== undefined,
    `No name has been made: ${inspect(this.failure)}`,
  );
  assert.equal(String(this.personName), name);
});
