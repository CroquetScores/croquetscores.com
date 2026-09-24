// Signings in sent at once, and what came of each: shared by signing in with a
// password and signing in with Google, since a scenario can send both at once
// and ask of them together. Not a steps file of its own, so that neither
// feature's steps stand behind the other's.
import { strict as assert } from "node:assert";

import type { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import type { SpecWorld } from "../../../support/world.js";

type Signing = () => Promise<AccountId>;

// What is set up to be sent, in the order it was set up, until it is sent.
const waiting = new WeakMap<SpecWorld, Signing[]>();

// Each answer or refusal of those sent, in the order they were set up.
const answered = new WeakMap<SpecWorld, PromiseSettledResult<AccountId>[]>();

/** Sets up `signing` to be sent with every other, when they are sent at once. */
export const toSendAtOnce = (world: SpecWorld, signing: Signing): void => {
  waiting.set(world, [...(waiting.get(world) ?? []), signing]);
};

/**
 * Sends everything set up, all at once, so that each is in a transaction of
 * its own and they race for the account, as registering's are sent. None is
 * allowed to fail: whether any was refused is what the scenario asks.
 */
export const sendAtOnce = async (world: SpecWorld): Promise<void> => {
  const signings = waiting.get(world) ?? [];
  waiting.delete(world);
  assert.ok(signings.length > 0, "Nothing is set up to be sent.");
  answered.set(
    world,
    await Promise.allSettled(signings.map((signing) => signing())),
  );
};

/** What came of each of those sent at once. */
export const answeredAtOnce = (
  world: SpecWorld,
): PromiseSettledResult<AccountId>[] => {
  const answers = answered.get(world);
  assert.ok(answers !== undefined, "Nothing was sent at once.");
  return answers;
};
