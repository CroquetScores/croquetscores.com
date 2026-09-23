// What stands behind "a breached password check": the application's check,
// asking a fake of Have I Been Pwned on a port of its own, and told to wait
// only briefly for it so that a fake told to be late need not be slow.
//
// Here rather than in specs/support/ because it names infrastructure, and
// specs/support/ is loaded by every spec in the repository and so may not.
import { After, Given, Then, When } from "@cucumber/cucumber";
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

/**
 * Stands a fake up and puts the check in front of it, or hands back the one
 * this scenario already has.
 *
 * One to a scenario, because three steps ask for it — the step that asks for
 * nothing else, the one that stands the application's confirming up, and the
 * building of the application itself — and a scenario may reasonably reach
 * for more than one of them. A second fake would listen on a port of its own
 * that the After hook, which stops only the one this scenario is holding,
 * would never stop; and it would take over the steps that say what has been
 * breached, pointing them at a fake that whatever is being exercised is not
 * asking. The scenario would then be told a password is known to be breached,
 * and watch the check come back saying it is not.
 */
export const aFakeOfHaveIBeenPwned = async (
  world: SpecWorld,
): Promise<FakeHaveIBeenPwned> => {
  const standing = fakes.get(world);
  if (standing !== undefined) return standing;

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

// Read from the fake rather than from the check in front of it, because what
// is being asked is whether the request was made at all: a check that worked
// out an answer without asking would leave the fake untouched, and so would a
// check that was never reached. Only the second is what a scenario using this
// means, and the two are told apart by the scenario that expects the asking.
Then(
  "nothing was asked of the breached password check",
  function (this: SpecWorld) {
    assert.deepEqual(fakeOf(this).askedAbout, []);
  },
);

After(async function (this: SpecWorld) {
  await fakes.get(this)?.stop();
});

// Forgets what the fake has been asked, so that a scenario about a second
// submission can say what that submission asked rather than what the two of
// them asked between them. It forgets the asking only: what the scenario said
// has been breached stays said, because that is about the service and not
// about any one request to it.
When(
  "what the breached password check was asked is forgotten",
  function (this: SpecWorld) {
    fakeOf(this).askedAbout.length = 0;
  },
);
