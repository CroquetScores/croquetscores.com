import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { SignInWithGoogle } from "../../../../../src/application/operations/accounts/SignInWithGoogle.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

// What Google says about the reader, one thing to a step, until the scenario
// sends it. Kept beside the world rather than on it, since nothing but these
// steps reads it.
interface GoogleSays {
  subject?: string;
  emailAddress?: string;
  verified?: boolean;
  name?: string | undefined;
}

const said = new WeakMap<SpecWorld, GoogleSays>();

const googleSaysFor = (world: SpecWorld): GoogleSays => {
  let says = said.get(world);
  if (says === undefined) {
    says = {};
    said.set(world, says);
  }
  return says;
};

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

// Each thing Google says is asked for, rather than defaulted, so that a
// scenario leaving one out fails for that rather than for what a default did.
const commandFor = (world: SpecWorld): SignInWithGoogle => {
  const says = googleSaysFor(world);
  assert.ok(says.subject !== undefined, "Google knows the reader as nobody.");
  assert.ok(says.emailAddress !== undefined, "Google gives no email address.");
  assert.ok(says.verified !== undefined, "Google says nothing of verifying.");
  assert.ok("name" in says, "Google says nothing of a name.");
  return new SignInWithGoogle(
    says.subject,
    says.emailAddress,
    says.verified,
    says.name,
    momentOf(world),
  );
};

Given(
  "Google knows the reader as {string}",
  function (this: SpecWorld, subject: string) {
    googleSaysFor(this).subject = subject;
  },
);

Given(
  "Google gives the email address {string}",
  function (this: SpecWorld, address: string) {
    googleSaysFor(this).emailAddress = address;
  },
);

Given("Google has verified the email address", function (this: SpecWorld) {
  googleSaysFor(this).verified = true;
});

Given("Google has not verified the email address", function (this: SpecWorld) {
  googleSaysFor(this).verified = false;
});

Given(
  "Google calls the reader {string}",
  function (this: SpecWorld, name: string) {
    googleSaysFor(this).name = name;
  },
);

Given("Google gives no name", function (this: SpecWorld) {
  googleSaysFor(this).name = undefined;
});

Given(
  "the account for {string} was linked to the Google account {string}",
  async function (this: SpecWorld, address: string, subject: string) {
    await registeringOf(this).linkToGoogle(address, subject);
  },
);

// Whatever came of it is kept for the scenario rather than thrown, as signing
// in with a password keeps it: some of these scenarios are about how it is
// refused.
When("signing in with Google is sent", async function (this: SpecWorld) {
  this.answer = undefined;
  this.failure = undefined;
  try {
    this.answer = await registeringOf(this).signInWithGoogle(commandFor(this));
  } catch (failure) {
    this.failure = failure;
  }
});

// Something the scenario builds on, so a refusal here is a scenario that is
// wrong about what it is standing on, and is thrown.
Given("signing in with Google has been sent", async function (this: SpecWorld) {
  await registeringOf(this).signInWithGoogle(commandFor(this));
});

const accountFor = async (world: SpecWorld, address: string) => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account;
};

Then(
  "the account for {string} is linked to the Google account {string}",
  async function (this: SpecWorld, address: string, subject: string) {
    assert.equal((await accountFor(this, address)).googleSubject, subject);
  },
);

Then(
  "the account for {string} is linked to no Google account",
  async function (this: SpecWorld, address: string) {
    assert.equal((await accountFor(this, address)).googleSubject, undefined);
  },
);

// The account now found at the address is a new one: the forgotten one is not
// found by its address any more, so one found there that is the answer is one
// that was made.
Then(
  "it is answered with a new account for {string}",
  async function (this: SpecWorld, address: string) {
    assert.ok(
      this.failure === undefined,
      `It was refused: ${String(this.failure)}`,
    );
    const account = await accountFor(this, address);
    const answered = this.answer as { value?: unknown } | undefined;
    assert.equal(answered?.value, account.id.value);
    assert.equal(account.forgotten, false);
  },
);

Then(
  "the password the new account was given is {int} characters long",
  function (this: SpecWorld, length: number) {
    const hashed = registeringOf(this).passwordsHashed();
    assert.equal(hashed.length, 1, `${hashed.length} passwords were hashed.`);
    assert.equal([...(hashed[0] ?? "")].length, length);
  },
);

Then(
  "the two new accounts were given different passwords",
  function (this: SpecWorld) {
    const hashed = registeringOf(this).passwordsHashed();
    assert.equal(hashed.length, 2, `${hashed.length} passwords were hashed.`);
    assert.notEqual(hashed[0], hashed[1]);
  },
);
