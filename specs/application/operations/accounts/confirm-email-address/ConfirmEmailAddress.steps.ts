import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ConfirmEmailAddress } from "../../../../../src/application/operations/accounts/ConfirmEmailAddress.js";
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

// The link a scenario has taken out of an email, or made, or tampered with, so
// that the step which sends confirming can say only "the altered link" and
// mean the one it just altered.
const links = new WeakMap<SpecWorld, string>();

const theLink = (world: SpecWorld): string => {
  const link = links.get(world);
  assert.ok(link !== undefined, "The scenario has no link.");
  return link;
};

// Sent, and a refusal kept for the scenario to look at rather than thrown:
// most of these scenarios are about how confirming is refused.
const confirmWith = async (world: SpecWorld, link: string): Promise<void> => {
  links.set(world, link);
  world.failure = undefined;
  try {
    await registeringOf(world).confirm(
      new ConfirmEmailAddress(link, momentOf(world)),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

// Sending it --------------------------------------------------------------------

// Defined once, though scenarios reach for it as a Given as well as a When: a
// step definition is matched by its words and not by the word in front of
// them, so the same words twice would be two definitions of one step.
When(
  "confirming is sent with the link emailed to {string}",
  async function (this: SpecWorld, address: string) {
    await confirmWith(this, await registeringOf(this).linkEmailedTo(address));
  },
);

When(
  "confirming is sent with the link in the email {string} to {string}",
  async function (this: SpecWorld, kind: string, address: string) {
    await confirmWith(
      this,
      await registeringOf(this).linkEmailedTo(address, kind),
    );
  },
);

// Taken while the account is still there, because forgetting throws away the
// key the email was sealed with: a reader who has the link in their mail keeps
// it whatever becomes of the account.
Given(
  "the link emailed to {string} is taken out of the email",
  async function (this: SpecWorld, address: string) {
    links.set(this, await registeringOf(this).linkEmailedTo(address));
  },
);

When(
  "confirming is sent with the link that was taken",
  async function (this: SpecWorld) {
    await confirmWith(this, theLink(this));
  },
);

When(
  "confirming is sent with the altered link",
  async function (this: SpecWorld) {
    await confirmWith(this, theLink(this));
  },
);

When(
  "confirming is sent with the link to set a new password",
  async function (this: SpecWorld) {
    await confirmWith(this, theLink(this));
  },
);

When(
  "confirming is sent with the link to confirm forgetting",
  async function (this: SpecWorld) {
    await confirmWith(this, theLink(this));
  },
);

// Links a scenario makes or spoils ------------------------------------------------

Given(
  "the link emailed to {string} is altered to name the account for {string}",
  async function (this: SpecWorld, address: string, other: string) {
    const record = registeringOf(this);
    const link = await record.linkEmailedTo(address);
    links.set(this, await record.alteredToName(link, other));
  },
);

Given(
  "the link emailed to {string} is altered to work until {string}",
  async function (this: SpecWorld, address: string, until: string) {
    const record = registeringOf(this);
    const link = await record.linkEmailedTo(address);
    links.set(this, record.alteredToWorkUntil(link, until));
  },
);

Given(
  "a link to set a new password has been sent to {string}",
  async function (this: SpecWorld, address: string) {
    links.set(
      this,
      await registeringOf(this).aLinkFor("set-new-password", address),
    );
  },
);

Given(
  "a link to confirm forgetting has been made for {string}",
  async function (this: SpecWorld, address: string) {
    links.set(
      this,
      await registeringOf(this).aLinkFor("confirm-forgetting", address),
    );
  },
);

// What became of the account --------------------------------------------------------

Given(
  "the account for {string} has been forgotten",
  async function (this: SpecWorld, address: string) {
    await registeringOf(this).forget(address);
  },
);

Then(
  "the account for {string} is confirmed",
  async function (this: SpecWorld, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    assert.equal(account.confirmed, true, "It is not confirmed.");
  },
);

Then(
  "the account for {string} has recorded {int} events",
  async function (this: SpecWorld, address: string, events: number) {
    assert.equal(await registeringOf(this).eventsRecordedFor(address), events);
  },
);
