import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { SignInWithGoogle } from "../../../../../src/application/operations/accounts/SignInWithGoogle.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import { identitySaidFor } from "../../../../support/google.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  answeredAtOnce,
  sendAtOnce,
  toSendAtOnce,
} from "../signingsInAtOnce.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const commandFor = (world: SpecWorld): SignInWithGoogle => {
  const identity = identitySaidFor(world);
  return new SignInWithGoogle(
    identity.subject,
    identity.emailAddress,
    identity.verified,
    identity.name,
    momentOf(world),
  );
};

Given(
  "the next signing in with Google looks for its Google account before it is linked",
  function (this: SpecWorld) {
    registeringOf(this).lookForGoogleAccountTooEarly();
  },
);

Given(
  "the next signing in with Google finds its account before it is forgotten",
  function (this: SpecWorld) {
    registeringOf(this).forgetAccountOnceFoundByGoogle();
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

When(
  "{int} signings in with Google are sent at once",
  async function (this: SpecWorld, many: number) {
    const registering = registeringOf(this);
    for (let each = 0; each < many; each++) {
      toSendAtOnce(this, () => registering.signInWithGoogle(commandFor(this)));
    }
    await sendAtOnce(this);
  },
);

Given(
  "{int} signings in with Google",
  function (this: SpecWorld, many: number) {
    const registering = registeringOf(this);
    for (let each = 0; each < many; each++) {
      toSendAtOnce(this, () => registering.signInWithGoogle(commandFor(this)));
    }
  },
);

Then(
  "each of them is answered with the account for {string}",
  async function (this: SpecWorld, address: string) {
    const account = await accountFor(this, address);
    for (const answer of answeredAtOnce(this)) {
      assert.ok(
        answer.status === "fulfilled",
        `One was refused: ${answer.status === "rejected" ? String(answer.reason) : ""}`,
      );
      assert.equal(answer.value.value, account.id.value);
    }
  },
);

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
