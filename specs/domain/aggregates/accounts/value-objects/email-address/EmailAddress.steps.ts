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

When("it is compared with {string}", function (this: SpecWorld, other: string) {
  this.sameAddress = addressOfWorld(this).equals(EmailAddress.from(other));
});

Then("they are the same address", function (this: SpecWorld) {
  assert.equal(this.sameAddress, true);
});

Then("it is written {string}", function (this: SpecWorld, written: string) {
  assert.equal(String(addressOfWorld(this)), written);
});
