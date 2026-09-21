import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { SendConfirmationLinkAgain } from "../../../../../src/application/operations/accounts/SendConfirmationLinkAgain.js";
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

// What this scenario last asked: the account it named, and the id it asked
// under, so that asking again with the same id is what "again" means.
interface Asked {
  readonly account: string;
  readonly requestId: string;
}

const asked = new WeakMap<SpecWorld, Asked>();

let minted = 0;

// The account the scenario names, found by the address it names it with: the
// command carries an account, as a reader's link does.
const accountIdOf = async (
  world: SpecWorld,
  address: string,
): Promise<string> => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account.id.value;
};

// Whatever came of it is kept for the scenario to look at rather than thrown:
// most of these scenarios are about how it is refused.
const ask = async (world: SpecWorld, { account, requestId }: Asked) => {
  asked.set(world, { account, requestId });
  world.failure = undefined;
  try {
    await registeringOf(world).sendAgain(
      new SendConfirmationLinkAgain(requestId, account, "en", momentOf(world)),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

// The account itself, before anything happens to it. A forgotten account is no
// longer found by its address, and what asks for a link holds one made before
// it was forgotten.
Given(
  "the account for {string} is taken hold of",
  async function (this: SpecWorld, address: string) {
    this.accountHeld = await accountIdOf(this, address);
  },
);

When(
  "sending the link again is asked for that account",
  async function (this: SpecWorld) {
    const account = this.accountHeld;
    assert.ok(account !== undefined, "The scenario holds no account.");
    minted += 1;
    await ask(this, { account, requestId: `a-sending-${minted}` });
  },
);

When(
  "sending the link again is asked for the account for {string}",
  async function (this: SpecWorld, address: string) {
    minted += 1;
    // Named for the scenario's later steps, so that "that email" is this
    // account's.
    this.addressInHand = address;
    await ask(this, {
      account: await accountIdOf(this, address),
      requestId: `a-sending-${minted}`,
    });
  },
);

// The same asking, carrying the id it carried the first time: a retry, not a
// second asking.
When(
  "it is asked again with the same request id",
  async function (this: SpecWorld) {
    const before = asked.get(this);
    assert.ok(before !== undefined, "Nothing has been asked for.");
    await ask(this, before);
  },
);
