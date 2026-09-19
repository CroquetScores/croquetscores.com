import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Password } from "../../../../../../src/domain/aggregates/accounts/value-objects/Password.js";
import type { SpecWorld } from "../../../../../support/world.js";

// A letter and its accent as two code points, the accent typed after the
// letter, which a reader still counts as one character.
const ACCENTED = "ö".normalize("NFD");

// Making a password may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    world.madePassword = Password.from(given);
  } catch (failure) {
    world.failure = failure;
  }
};

const passwordOf = (world: SpecWorld): Password => {
  assert.ok(
    world.madePassword !== undefined,
    `No password has been made: ${inspect(world.failure)}`,
  );
  return world.madePassword;
};

When(
  "the password {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a password of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

When(
  "a password of {int} accented letters is made with each accent typed after its letter",
  function (this: SpecWorld, length: number) {
    tryToMake(this, ACCENTED.repeat(length));
  },
);

// Every way a password is ordinarily written down: made into text, sent as
// JSON alone or inside something, and logged alone or inside something, which
// is what console.log does.
When("it is written out", function (this: SpecWorld) {
  const password = passwordOf(this);
  this.writtenOut = [
    String(password),
    JSON.stringify(password),
    JSON.stringify({ password }),
    inspect(password),
    inspect({ password }),
  ];
});

Then(
  "what is written does not contain {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(this.writtenOut.length > 0, "Nothing has been written out.");
    for (const written of this.writtenOut) {
      assert.ok(!written.includes(words), `It was written as ${written}.`);
    }
  },
);

Then("its words are {string}", function (this: SpecWorld, words: string) {
  assert.equal(passwordOf(this).reveal(), words);
});
