import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AskToSetPassword } from "../../../../../src/application/operations/accounts/AskToSetPassword.js";
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
// command carries is the account they are signed in to.
const signedInTo = async (world: SpecWorld, address: string) => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account.id.value;
};

let minted = 0;

// What the scenario last asked, so that sending it again is what "again"
// means: the same account, under the same request id.
const asked = new WeakMap<SpecWorld, { account: string; requestId: string }>();

// Whatever came of it is kept for the scenario rather than thrown: some of
// these scenarios are about how it is refused.
const ask = async (
  world: SpecWorld,
  account: string,
  requestId: string,
): Promise<void> => {
  asked.set(world, { account, requestId });
  world.failure = undefined;
  try {
    await registeringOf(world).askToSetPassword(
      new AskToSetPassword(
        requestId,
        account,
        "en",
        "croquetscores.com",
        momentOf(world),
      ),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const askAfresh = async (world: SpecWorld, account: string): Promise<void> => {
  minted += 1;
  await ask(world, account, `an-asking-to-set-a-password-${minted}`);
};

When(
  "setting a password is asked for by the reader signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    await askAfresh(this, await signedInTo(this, address));
  },
);

Given(
  "setting a password has been asked for by the reader signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    await askAfresh(this, await signedInTo(this, address));
    assert.equal(this.failure, undefined, String(this.failure));
  },
);

// For an account no longer found by its address, as a forgotten one is not.
When(
  "setting a password is asked for by the reader signed in to that account",
  async function (this: SpecWorld) {
    assert.ok(this.accountHeld !== undefined, "The scenario holds no account.");
    await askAfresh(this, this.accountHeld);
  },
);

When(
  "the same asking to set a password is sent again",
  async function (this: SpecWorld) {
    const last = asked.get(this);
    assert.ok(last !== undefined, "Nothing has been asked for.");
    await ask(this, last.account, last.requestId);
  },
);
