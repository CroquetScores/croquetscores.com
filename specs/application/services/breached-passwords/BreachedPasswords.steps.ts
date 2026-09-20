import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { SpecWorld } from "../../../support/world.js";
import {
  asLetterThenAccent,
  asOneCharacter,
} from "../password-hasher/PasswordHasher.steps.js";

// What stands behind "a breached password check" is decided by the steps of
// whatever implements it (specs/infrastructure/identity/), since this feature
// is written for any check and these steps may name none.

const checkOf = (world: SpecWorld) => {
  assert.ok(
    world.breachedPasswords !== undefined,
    "There is no breached password check.",
  );
  return world.breachedPasswords;
};

// The last password a scenario had checked, for the steps that ask what was
// sent about it.
const lastChecked = new WeakMap<SpecWorld, string>();

export const lastPasswordChecked = (world: SpecWorld): string => {
  const password = lastChecked.get(world);
  assert.ok(password !== undefined, "Nothing has been checked.");
  return password;
};

/** Checks, keeping what it found or how it was refused. */
export const checked = async (
  world: SpecWorld,
  password: string,
): Promise<void> => {
  lastChecked.set(world, password);
  world.breached = undefined;
  world.failure = undefined;
  try {
    world.breached = await checkOf(world).isBreached(password);
  } catch (failure) {
    world.failure = failure;
  }
};

const found = (world: SpecWorld): boolean => {
  assert.ok(
    world.breached !== undefined,
    `Nothing was found: ${world.failure === undefined ? "nothing has been checked" : `the check was refused with ${inspect(world.failure)}`}.`,
  );
  return world.breached;
};

// What is known -----------------------------------------------------------

Given(
  "{string} is known to have been breached",
  function (this: SpecWorld, password: string) {
    assert.ok(this.knownBreached !== undefined, "There is no check to tell.");
    this.knownBreached(password);
  },
);

Given(
  "{string} with its accent typed as part of the letter is known to have been breached",
  function (this: SpecWorld, password: string) {
    assert.ok(this.knownBreached !== undefined, "There is no check to tell.");
    this.knownBreached(asOneCharacter(password));
  },
);

Given("the service cannot be reached", async function (this: SpecWorld) {
  assert.ok(
    this.breachedPasswordsUnreachable !== undefined,
    "There is no service to make unreachable.",
  );
  await this.breachedPasswordsUnreachable();
});

// Checking ---------------------------------------------------------------

When("{string} is checked", async function (this: SpecWorld, password: string) {
  await checked(this, password);
});

When(
  "{string} with its accent typed after the letter is checked",
  async function (this: SpecWorld, password: string) {
    await checked(this, asLetterThenAccent(password));
  },
);

// What it found ----------------------------------------------------------

Then("it is found to have been breached", function (this: SpecWorld) {
  assert.equal(found(this), true, "It was not found to have been breached.");
});

Then("it is not found to have been breached", function (this: SpecWorld) {
  assert.equal(found(this), false, "It was found to have been breached.");
});

Then(
  "the check is refused with {string}",
  function (this: SpecWorld, code: string) {
    const said = (this.failure as { code?: unknown } | undefined)?.code;
    assert.ok(
      this.failure instanceof Error && typeof said === "string",
      `Expected a refusal, and got ${this.failure === undefined ? `an answer: ${inspect(this.breached)}` : inspect(this.failure)}.`,
    );
    assert.equal(said, code);
  },
);
