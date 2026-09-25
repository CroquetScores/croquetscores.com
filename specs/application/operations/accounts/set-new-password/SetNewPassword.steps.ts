import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { SetNewPassword } from "../../../../../src/application/operations/accounts/SetNewPassword.js";
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

const linkInHand = (world: SpecWorld): string => {
  assert.ok(world.linkInHand !== undefined, "The scenario has no link.");
  return world.linkInHand;
};

let minted = 0;

// The id the scenario last set a password under, so that sending the same
// setting again is what "again" means.
const ids = new WeakMap<SpecWorld, string>();

// Kept for the scenario rather than thrown: most of these scenarios are about
// how it is refused.
const set = async (
  world: SpecWorld,
  password: string,
  confirmation: string,
  again = false,
): Promise<void> => {
  const had = ids.get(world);
  let requestId: string;
  if (again && had !== undefined) {
    requestId = had;
  } else {
    minted += 1;
    requestId = `a-setting-${minted}`;
    ids.set(world, requestId);
  }
  last.set(world, { password, confirmation });

  world.answer = undefined;
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    world.answer = await registeringOf(world).setNewPassword(
      new SetNewPassword(
        requestId,
        linkInHand(world),
        password,
        confirmation,
        momentOf(world),
      ),
    );
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
  }
};

const last = new WeakMap<
  SpecWorld,
  { password: string; confirmation: string }
>();

// A link the site made for confirming an address, which sets no password
// however it is sent.
Given(
  "a link to confirm the email address, sent to {string}",
  async function (this: SpecWorld, address: string) {
    this.linkInHand = await registeringOf(this).aLinkToConfirm(address);
  },
);

When(
  "the new password {string} is set with that link",
  async function (this: SpecWorld, password: string) {
    await set(this, password, password);
  },
);

Given(
  "the new password {string} has been set with that link",
  async function (this: SpecWorld, password: string) {
    await set(this, password, password);
  },
);

When(
  "the new password {string} is set with that link, confirmed as {string}",
  async function (this: SpecWorld, password: string, confirmation: string) {
    await set(this, password, confirmation);
  },
);

// Another setting, with whatever link the scenario now holds, carrying the id
// the last one carried: an id is only a retry of the setting it was sent with.
When(
  "the new password {string} is set with that link, carrying the same request id",
  async function (this: SpecWorld, password: string) {
    await set(this, password, password, true);
  },
);

// The same setting, carrying the id it carried the first time: a retry, not a
// second setting.
When("the same setting is sent again", async function (this: SpecWorld) {
  const before = last.get(this);
  assert.ok(before !== undefined, "Nothing has been set.");
  await set(this, before.password, before.confirmation, true);
});

// Asked of the hasher the scenario's application hashes with, which is the
// only thing that can say whether a hash was made from a password.
Then(
  "{string} is the password of the account for {string}",
  async function (this: SpecWorld, password: string, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    const hasher = this.passwordHasher;
    assert.ok(hasher !== undefined, "This scenario has no password hasher.");
    const checked = await hasher.check(password, account.passwordHash);
    assert.equal(checked.matches, true, `That is not its password.`);
  },
);

Then(
  "{string} is not the password of the account for {string}",
  async function (this: SpecWorld, password: string, address: string) {
    const account = await registeringOf(this).accountFor(address);
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    const hasher = this.passwordHasher;
    assert.ok(hasher !== undefined, "This scenario has no password hasher.");
    const checked = await hasher.check(password, account.passwordHash);
    assert.equal(checked.matches, false, `That is still its password.`);
  },
);
