import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { WhatAConfirmationLinkIsWorth } from "../../../../../src/application/operations/accounts/WhatAConfirmationLinkIsWorth.js";
import type { ConfirmationLinkWorth } from "../../../../../src/application/operations/accounts/confirmationLinks.js";
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

// Every answer this scenario has had, in the order it had them, so that asking
// twice can be compared with itself.
const answers = new WeakMap<SpecWorld, ConfirmationLinkWorth[]>();

const answersTo = (world: SpecWorld): ConfirmationLinkWorth[] => {
  let found = answers.get(world);
  if (found === undefined) {
    found = [];
    answers.set(world, found);
  }
  return found;
};

const linkInHand = (world: SpecWorld): string => {
  assert.ok(
    world.linkInHand !== undefined,
    "The scenario has hold of no link.",
  );
  return world.linkInHand;
};

const ask = async (world: SpecWorld): Promise<void> => {
  const worth = await registeringOf(world).worthOf(
    new WhatAConfirmationLinkIsWorth(linkInHand(world), momentOf(world)),
  );
  answersTo(world).push(worth);
};

// The link the scenario has hold of ------------------------------------------------

// Out of the email before anything else happens to the account, because an
// account that is forgotten takes the key its emails were sealed with, and
// nothing can read them afterwards. That is not a way round the scenario: the
// link reached somebody's inbox while the account was there, and forgetting it
// does not reach into their mail and take it back.
Given(
  "the link emailed to {string} is taken out of it",
  async function (this: SpecWorld, address: string) {
    this.linkInHand = await registeringOf(this).linkEmailedTo(address);
  },
);

// Where the address has been sent more than one, and the scenario is about the
// later.
Given(
  "the second link emailed to {string} is taken out of it",
  async function (this: SpecWorld, address: string) {
    this.linkInHand = await registeringOf(this).linkEmailedTo(address, 2);
  },
);

// Asking ---------------------------------------------------------------------------

Given(
  "what that link is worth has been asked",
  async function (this: SpecWorld) {
    await ask(this);
  },
);

When("what that link is worth is asked", async function (this: SpecWorld) {
  await ask(this);
});

// What came back --------------------------------------------------------------------

Then("the link is worth {string}", function (this: SpecWorld, worth: string) {
  const had = answersTo(this);
  const last = had[had.length - 1];
  assert.ok(last !== undefined, "Nothing has been asked.");
  assert.equal(last, worth);
});

Then("both askings answer the same", function (this: SpecWorld) {
  const had = answersTo(this);
  assert.equal(had.length, 2, `${had.length} answers came back.`);
  assert.equal(had[0], had[1]);
});
