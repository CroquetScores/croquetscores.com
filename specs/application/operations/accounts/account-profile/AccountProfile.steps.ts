import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  AccountProfile,
  type Profile,
} from "../../../../../src/application/operations/accounts/AccountProfile.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

// What the last asking answered, kept for the scenario to read.
const answered = new WeakMap<SpecWorld, Profile | undefined>();

const askFor = async (world: SpecWorld, account: string): Promise<void> => {
  answered.set(
    world,
    await registeringOf(world).profile(new AccountProfile(account)),
  );
};

When(
  "the profile of the account for {string} is asked for",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    await askFor(this, account.id.value);
  },
);

// For an account no longer found by its address, as a forgotten one is not.
When(
  "the profile of that account is asked for",
  async function (this: SpecWorld) {
    assert.ok(this.accountHeld !== undefined, "The scenario holds no account.");
    await askFor(this, this.accountHeld);
  },
);

const profileOf = (world: SpecWorld): Profile => {
  const profile = answered.get(world);
  assert.ok(profile !== undefined, "There is no profile.");
  return profile;
};

Then(
  "the profile says the name {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(profileOf(this).name, name);
  },
);

Then(
  "the profile says the email address {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(profileOf(this).emailAddress, address);
  },
);

Then("the profile says the account has a password", function (this: SpecWorld) {
  assert.equal(profileOf(this).hasPassword, true);
});

Then(
  "the profile says the account has no password",
  function (this: SpecWorld) {
    assert.equal(profileOf(this).hasPassword, false);
  },
);

Then("there is no profile", function (this: SpecWorld) {
  assert.ok(answered.has(this), "No profile was asked for.");
  assert.equal(answered.get(this), undefined);
});
