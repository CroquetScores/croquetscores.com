import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AskToForgetAccount } from "../../../../../src/application/operations/accounts/AskToForgetAccount.js";
import { ForgetAccount } from "../../../../../src/application/operations/accounts/ForgetAccount.js";
import type { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
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

// The reader is signed in to the account the scenario names, and what the
// commands carry is the account they are signed in to.
const signedInTo = async (world: SpecWorld, address: string) => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account.id.value;
};

const heldBy = (world: SpecWorld): string => {
  assert.ok(world.accountHeld !== undefined, "The scenario holds no account.");
  return world.accountHeld;
};

const askAs = async (world: SpecWorld, address: string): Promise<void> => {
  await registeringOf(world).askToForget(
    new AskToForgetAccount(
      await signedInTo(world, address),
      "en",
      momentOf(world),
    ),
  );
};

When(
  "forgetting is asked for by the reader signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    await askAs(this, address);
  },
);

Given(
  "forgetting has been asked for by the reader signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    await askAs(this, address);
  },
);

// Whatever came of it is kept rather than thrown: several of these scenarios
// are about how it is refused.
const confirmAs = async (world: SpecWorld, reader: string) => {
  assert.ok(world.linkInHand !== undefined, "The scenario has no link.");
  world.answer = undefined;
  world.failure = undefined;
  try {
    world.answer = await registeringOf(world).forgetWithLink(
      new ForgetAccount(world.linkInHand, reader, momentOf(world)),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "forgetting is confirmed with that link, signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    await confirmAs(this, await signedInTo(this, address));
  },
);

When(
  "forgetting is confirmed with that link, signed in to that account",
  async function (this: SpecWorld) {
    await confirmAs(this, heldBy(this));
  },
);

Given(
  "forgetting has been confirmed with that link, signed in to that account",
  async function (this: SpecWorld) {
    await confirmAs(this, heldBy(this));
  },
);

Then("it is answered with that account", function (this: SpecWorld) {
  assert.ok(
    this.failure === undefined,
    `It was refused: ${String(this.failure)}`,
  );
  assert.equal((this.answer as AccountId).value, heldBy(this));
});
