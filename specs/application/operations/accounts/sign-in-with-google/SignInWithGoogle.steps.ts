import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { SignInWithGoogle } from "../../../../../src/application/operations/accounts/SignInWithGoogle.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import { identitySaidFor } from "../../../../support/google.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

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

// Each answer or refusal of the signings in sent at once, in the order sent.
const atOnce = new WeakMap<SpecWorld, PromiseSettledResult<unknown>[]>();

// All at once, so that each is in a transaction of its own and they race for
// the account, as registering's are sent. None is allowed to fail the step:
// whether any was refused is what the scenario asks.
When(
  "{int} signings in with Google are sent at once",
  async function (this: SpecWorld, many: number) {
    const registering = registeringOf(this);
    atOnce.set(
      this,
      await Promise.allSettled(
        Array.from({ length: many }, () =>
          registering.signInWithGoogle(commandFor(this)),
        ),
      ),
    );
  },
);

Then(
  "each of them is answered with the account for {string}",
  async function (this: SpecWorld, address: string) {
    const answers = atOnce.get(this);
    assert.ok(answers !== undefined, "Nothing was sent at once.");
    const account = await accountFor(this, address);
    for (const answer of answers) {
      assert.ok(
        answer.status === "fulfilled",
        `One was refused: ${answer.status === "rejected" ? String(answer.reason) : ""}`,
      );
      assert.equal(
        (answer.value as { value?: unknown }).value,
        account.id.value,
      );
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
