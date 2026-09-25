import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AskToChangeEmailAddress } from "../../../../../src/application/operations/accounts/AskToChangeEmailAddress.js";
import { ChangeEmailAddress } from "../../../../../src/application/operations/accounts/ChangeEmailAddress.js";
import { RegisterAccount } from "../../../../../src/application/operations/accounts/RegisterAccount.js";
import {
  WhatAMovingLinkIsWorth,
  type MovingLinkWorth,
} from "../../../../../src/application/operations/accounts/WhatAMovingLinkIsWorth.js";
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

// Whatever came of it is kept rather than thrown: some of these scenarios are
// about how it is refused.
const outcome = async <T>(
  world: SpecWorld,
  asking: () => Promise<T>,
): Promise<void> => {
  world.answer = undefined;
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    world.answer = await asking();
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
  }
};

const askToMove = (
  world: SpecWorld,
  account: string,
  to: string,
  password: string,
): Promise<void> =>
  registeringOf(world).askToMove(
    new AskToChangeEmailAddress(account, to, password, "en", momentOf(world)),
  );

When(
  "moving to {string} is asked for by the reader signed in to the account for {string}, with the password {string}",
  async function (
    this: SpecWorld,
    to: string,
    address: string,
    password: string,
  ) {
    const account = await signedInTo(this, address);
    await outcome(this, () => askToMove(this, account, to, password));
  },
);

// Something the scenario builds on, so a refusal here is thrown.
Given(
  "moving to {string} has been asked for by the reader signed in to the account for {string}, with the password {string}",
  async function (
    this: SpecWorld,
    to: string,
    address: string,
    password: string,
  ) {
    await askToMove(this, await signedInTo(this, address), to, password);
  },
);

Given(
  "moving to {string} has been asked for by the reader signed in to that account, with the password {string}",
  async function (this: SpecWorld, to: string, password: string) {
    await askToMove(this, heldBy(this), to, password);
  },
);

Then("it is answered without refusal", function (this: SpecWorld) {
  assert.equal(
    this.failure,
    undefined,
    `It was refused: ${String(this.failure)}`,
  );
});

// What a link is worth ---------------------------------------------------------

const worths = new WeakMap<SpecWorld, MovingLinkWorth>();

When(
  "what that link is worth is asked, signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    assert.ok(this.linkInHand !== undefined, "The scenario has no link.");
    worths.set(
      this,
      await registeringOf(this).worthOfMovingLink(
        new WhatAMovingLinkIsWorth(
          this.linkInHand,
          await signedInTo(this, address),
          momentOf(this),
        ),
      ),
    );
  },
);

const worthOf = (world: SpecWorld): MovingLinkWorth => {
  const worth = worths.get(world);
  assert.ok(worth !== undefined, "Nobody asked what the link is worth.");
  return worth;
};

Then(
  "it is worth moving to {string}",
  function (this: SpecWorld, address: string) {
    const worth = worthOf(this);
    assert.equal(worth.worth, "Link.Works");
    if (worth.worth === "Link.Works") {
      assert.equal(worth.emailAddress, address);
    }
  },
);

Then("it is worth nothing", function (this: SpecWorld) {
  assert.equal(worthOf(this).worth, "Link.NoLongerWorks");
});

// Confirming -----------------------------------------------------------------

// The account each scenario moved, so that one registered at the address it
// moved from can be told apart from it.
const movedAccounts = new WeakMap<SpecWorld, string>();

const confirmAs = async (
  world: SpecWorld,
  reader: string,
): Promise<unknown> => {
  assert.ok(world.linkInHand !== undefined, "The scenario has no link.");
  const moved = await registeringOf(world).moveWithLink(
    new ChangeEmailAddress(world.linkInHand, reader, "en", momentOf(world)),
  );
  movedAccounts.set(world, moved.value);
  return moved;
};

When(
  "moving is confirmed with that link, signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    const reader = await signedInTo(this, address);
    await outcome(this, () => confirmAs(this, reader));
  },
);

When(
  "moving is confirmed with that link, signed in to that account",
  async function (this: SpecWorld) {
    await outcome(this, () => confirmAs(this, heldBy(this)));
  },
);

Given(
  "moving has been confirmed with that link, signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    await confirmAs(this, await signedInTo(this, address));
  },
);

Given(
  "moving has been confirmed with that link, signed in to that account",
  async function (this: SpecWorld) {
    await confirmAs(this, heldBy(this));
  },
);

Then(
  "the account for {string} is that account",
  async function (this: SpecWorld, address: string) {
    assert.equal(await signedInTo(this, address), heldBy(this));
  },
);

// Registering the address it moved from ------------------------------------------

let registered = 0;

When("{string} registers", async function (this: SpecWorld, address: string) {
  registered += 1;
  await registeringOf(this).send(
    new RegisterAccount(
      `moved-from-${registered}`,
      address,
      "en",
      momentOf(this),
    ),
  );
});

// A new account, rather than the one that moved away from the address.
Then(
  "a new account is made for {string}",
  async function (this: SpecWorld, address: string) {
    const moved = movedAccounts.get(this);
    assert.ok(moved !== undefined, "No account was moved.");
    assert.notEqual(
      await signedInTo(this, address),
      moved,
      `${address} is still the account that moved away from it.`,
    );
  },
);
