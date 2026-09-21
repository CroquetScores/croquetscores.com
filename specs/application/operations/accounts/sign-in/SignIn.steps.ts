import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { SignIn } from "../../../../../src/application/operations/accounts/SignIn.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
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

const accountFor = async (world: SpecWorld, address: string) => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account;
};

// Whatever came of it is kept for the scenario rather than thrown: half of
// these scenarios are about how it is refused.
When(
  "signing in as {string} with the password {string} is sent",
  async function (this: SpecWorld, address: string, password: string) {
    this.answer = undefined;
    this.failure = undefined;
    try {
      this.answer = await registeringOf(this).signIn(
        new SignIn(address, password, momentOf(this)),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "it is answered with the account for {string}",
  async function (this: SpecWorld, address: string) {
    assert.ok(
      this.failure === undefined,
      `It was refused: ${String(this.failure)}`,
    );
    const account = await accountFor(this, address);
    const answered = this.answer as { value?: unknown } | undefined;
    assert.equal(answered?.value, account.id.value);
  },
);

// Found by the name the event is kept under, which is what the stream holds:
// the class name is not in the database, and a scenario reading the stream
// reads what is there.
Then(
  "the last thing the account for {string} recorded is its signing in",
  async function (this: SpecWorld, address: string) {
    const kept = await registeringOf(this).everythingKeptFor(address);
    const last = kept.trim().split("\n").at(-1) ?? "";
    assert.ok(last.includes("account-signed-in"), `The last event is ${last}.`);
  },
);

// Checked against a hash, or against none, which takes as long: what this
// asks is that the check happened at all, for an address with no account.
Then("a password was checked against a hash", function (this: SpecWorld) {
  assert.ok(
    registeringOf(this).passwordsChecked() > 0,
    "No password was checked.",
  );
});

Then(
  "the account for {string} no longer has an imported password",
  async function (this: SpecWorld, address: string) {
    assert.equal((await accountFor(this, address)).passwordImported, false);
  },
);

Then(
  "the account for {string} still has an imported password",
  async function (this: SpecWorld, address: string) {
    assert.equal((await accountFor(this, address)).passwordImported, true);
  },
);
