import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ChangeName } from "../../../../../src/application/operations/accounts/ChangeName.js";
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
// command carries is the account they are signed in to. Whatever came of it is
// kept rather than thrown: some of these scenarios are about how it is refused.
const changeAs = async (
  world: SpecWorld,
  account: string,
  name: string,
): Promise<void> => {
  world.answer = undefined;
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    world.answer = await registeringOf(world).changeName(
      new ChangeName(account, name, momentOf(world)),
    );
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
  }
};

When(
  "the reader signed in to the account for {string} changes its name to {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    await changeAs(this, account.id.value, name);
  },
);

// For an account no longer found by its address, as a forgotten one is not.
When(
  "the reader signed in to that account changes its name to {string}",
  async function (this: SpecWorld, name: string) {
    assert.ok(this.accountHeld !== undefined, "The scenario holds no account.");
    await changeAs(this, this.accountHeld, name);
  },
);

// Read from what is kept, since what matters is what happened to the account,
// and what happened is what was written down.
const kinds = async (world: SpecWorld, address: string): Promise<string> =>
  registeringOf(world).everythingKeptFor(address);

Then(
  "the last thing the account for {string} recorded is its name being changed",
  async function (this: SpecWorld, address: string) {
    const last = (await kinds(this, address)).trim().split("\n").at(-1) ?? "";
    assert.ok(last.includes("account-name-changed"), `The last is ${last}.`);
  },
);

Then(
  "the account for {string} has recorded no change of its name",
  async function (this: SpecWorld, address: string) {
    assert.ok(
      !(await kinds(this, address)).includes("account-name-changed"),
      "A change of its name was recorded.",
    );
  },
);
