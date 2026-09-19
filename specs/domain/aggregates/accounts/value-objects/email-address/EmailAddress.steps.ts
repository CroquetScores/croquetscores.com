import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { EmailAddress } from "../../../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { SpecWorld } from "../../../../../support/world.js";

const DOMAIN = "@example.com";

// A well-made address exactly `length` characters long, all of the difference
// made up before the @.
const addressOf = (length: number): string =>
  "a".repeat(length - DOMAIN.length) + DOMAIN;

// Making an address may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    world.emailAddress = EmailAddress.from(given);
  } catch (failure) {
    world.failure = failure;
  }
};

const addressOfWorld = (world: SpecWorld): EmailAddress => {
  assert.ok(
    world.emailAddress !== undefined,
    `No email address has been made: ${inspect(world.failure)}`,
  );
  return world.emailAddress;
};

Given("the email address {string}", function (this: SpecWorld, given: string) {
  this.emailAddress = EmailAddress.from(given);
});

Given(
  "the email address {string} with its accent typed after the letter",
  function (this: SpecWorld, given: string) {
    const typed = given.normalize("NFD");
    assert.notEqual(typed, given, `"${given}" has no accent to type after.`);
    this.emailAddress = EmailAddress.from(typed);
  },
);

When(
  "the email address {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "an email address of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, addressOf(length));
  },
);

When(
  "an email address of {int} characters with spaces around it is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, `  ${addressOf(length)}  `);
  },
);

// Each accented letter written as one character, two bytes in UTF-8, so the
// address is fewer characters than it is bytes.
When(
  "an email address of {int} accented letters before the @ is made",
  function (this: SpecWorld, letters: number) {
    tryToMake(this, "é".normalize("NFC").repeat(letters) + DOMAIN);
  },
);

When("it is compared with {string}", function (this: SpecWorld, other: string) {
  this.sameAddress = addressOfWorld(this).equals(EmailAddress.from(other));
});

Then("they are the same address", function (this: SpecWorld) {
  assert.equal(this.sameAddress, true);
});

Then("it is written {string}", function (this: SpecWorld, written: string) {
  assert.equal(String(addressOfWorld(this)), written);
});
