// What stands behind "a breached password check": the application's check,
// asking a fake of Have I Been Pwned on a port of its own, and told to wait
// only briefly for it so that a fake told to be late need not be slow.
//
// Here rather than in specs/support/ because it names infrastructure, and
// specs/support/ is loaded by every spec in the repository and so may not.
import { After, Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { HaveIBeenPwnedPasswords } from "../../../src/infrastructure/identity/HaveIBeenPwnedPasswords.js";
import {
  FakeHaveIBeenPwned,
  sha1Of,
} from "../identity/have-i-been-pwned/FakeHaveIBeenPwned.js";
import type { SpecWorld } from "../../support/world.js";

/**
 * How long the scenarios' check waits for the fake. Long enough that a fake
 * answering at once on the same machine is never too late, and short enough
 * that a scenario about lateness is over quickly.
 */
export const scenariosWaitMilliseconds = 500;

const fakes = new WeakMap<SpecWorld, FakeHaveIBeenPwned>();

export const fakeOf = (world: SpecWorld): FakeHaveIBeenPwned => {
  const fake = fakes.get(world);
  assert.ok(fake !== undefined, "There is no fake of Have I Been Pwned.");
  return fake;
};

/** Stands a fake up and puts the check in front of it. */
export const aFakeOfHaveIBeenPwned = async (
  world: SpecWorld,
): Promise<FakeHaveIBeenPwned> => {
  const fake = await FakeHaveIBeenPwned.start();
  fakes.set(world, fake);
  world.breachedPasswords = new HaveIBeenPwnedPasswords(
    fake.rangeUrl,
    scenariosWaitMilliseconds,
  );
  // The fake is told the hash of exactly what the scenario said, spelled
  // however the scenario spelled it: whether the check asks about the same
  // password spelled another way is the check's to get right.
  world.knownBreached = (password) => fake.knows(sha1Of(password));
  // Nothing listening is as unreachable as a service gets.
  world.breachedPasswordsUnreachable = () => fake.stop();
  return fake;
};

Given("a breached password check", async function (this: SpecWorld) {
  await aFakeOfHaveIBeenPwned(this);
});

After(async function (this: SpecWorld) {
  await fakes.get(this)?.stop();
});
