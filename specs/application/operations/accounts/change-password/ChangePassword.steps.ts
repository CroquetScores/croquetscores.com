import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ChangePassword } from "../../../../../src/application/operations/accounts/ChangePassword.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../../../src/domain/common/validation/Validator.js";
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

// The reader is signed in to the account the scenario names, and what the
// command carries is the account they are signed in to.
const commandFor = async (
  world: SpecWorld,
  address: string,
  current: string,
  password: string,
  confirmation: string,
): Promise<ChangePassword> => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return new ChangePassword(
    account.id.value,
    current,
    password,
    confirmation,
    "en",
    "croquetscores.com",
    momentOf(world),
  );
};

// Whatever came of it is kept rather than thrown: some of these scenarios are
// about how it is refused.
const change = async (
  world: SpecWorld,
  command: ChangePassword,
): Promise<void> => {
  world.answer = undefined;
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    world.answer = await registeringOf(world).changePassword(command);
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
  }
};

When(
  "the reader signed in to the account for {string} changes its password from {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    current: string,
    password: string,
  ) {
    await change(
      this,
      await commandFor(this, address, current, password, password),
    );
  },
);

When(
  "the reader signed in to the account for {string} changes its password from {string} to {string}, confirmed as {string}",
  async function (
    this: SpecWorld,
    address: string,
    current: string,
    password: string,
    confirmation: string,
  ) {
    await change(
      this,
      await commandFor(this, address, current, password, confirmation),
    );
  },
);

// Something the scenario builds on, so a refusal here is a scenario that is
// wrong about what it is standing on, and is thrown.
Given(
  "the reader signed in to the account for {string} has changed its password from {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    current: string,
    password: string,
  ) {
    await registeringOf(this).changePassword(
      await commandFor(this, address, current, password, password),
    );
  },
);

Then(
  "nothing kept for the account for {string} contains {string}",
  async function (this: SpecWorld, address: string, text: string) {
    const kept = await registeringOf(this).everythingKeptFor(address);
    assert.ok(!kept.includes(text), `What is kept holds ${text}.`);
  },
);
