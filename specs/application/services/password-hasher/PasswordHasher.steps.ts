import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { performance } from "node:perf_hooks";

import type { PasswordCheck } from "../../../../src/application/services/PasswordHasher.js";
import type { SpecWorld } from "../../../support/world.js";

// What stands behind "a password hasher" is decided by the steps of whatever
// implements it (specs/infrastructure/identity/), since this feature is
// written for any hasher and these steps may name none.

const hasherOf = (world: SpecWorld) => {
  assert.ok(world.passwordHasher !== undefined, "There is no password hasher.");
  return world.passwordHasher;
};

const passwordOf = (world: SpecWorld): string => {
  assert.ok(world.password !== undefined, "No password has been given.");
  return world.password;
};

const hashNamed = (world: SpecWorld, which: number): string => {
  const hash = world.passwordHashes[which];
  assert.ok(hash !== undefined, "That hash has not been made.");
  return hash;
};

// An accented letter can be one character, or a letter with the accent after
// it. A feature file holds whichever its editor saved, so each step says which
// it means and makes it so.
export const asOneCharacter = (text: string): string => text.normalize("NFC");
export const asLetterThenAccent = (text: string): string =>
  text.normalize("NFD");

/** Checks, keeping what it found and how long it took. */
export const checked = async (
  world: SpecWorld,
  check: () => Promise<PasswordCheck>,
): Promise<number> => {
  const started = performance.now();
  world.passwordCheck = await check();
  return performance.now() - started;
};

// The password -----------------------------------------------------------

Given("the password {string}", function (this: SpecWorld, password: string) {
  this.password = password;
});

Given(
  "the password {string} with its accent typed as part of the letter",
  function (this: SpecWorld, password: string) {
    this.password = asOneCharacter(password);
  },
);

Given(
  "a password of {int} characters ending in {string}",
  function (this: SpecWorld, length: number, last: string) {
    this.password = "x".repeat(length - last.length) + last;
  },
);

// Hashing ----------------------------------------------------------------

When("the password is hashed", async function (this: SpecWorld) {
  this.passwordHashes = [await hasherOf(this).hash(passwordOf(this))];
});

When("the password is hashed again", async function (this: SpecWorld) {
  this.passwordHashes.push(await hasherOf(this).hash(passwordOf(this)));
});

// Checking ---------------------------------------------------------------

When(
  "{string} is checked against the hash",
  async function (this: SpecWorld, password: string) {
    const hash = hashNamed(this, 0);
    this.checkTook.againstHash = await checked(this, () =>
      hasherOf(this).check(password, hash),
    );
  },
);

When(
  "{string} with its accent typed after the letter is checked against the hash",
  async function (this: SpecWorld, password: string) {
    const hash = hashNamed(this, 0);
    await checked(this, () =>
      hasherOf(this).check(asLetterThenAccent(password), hash),
    );
  },
);

When(
  "{string} is checked against the second hash",
  async function (this: SpecWorld, password: string) {
    const hash = hashNamed(this, 1);
    await checked(this, () => hasherOf(this).check(password, hash));
  },
);

When(
  "the same password ending in {string} is checked against the hash",
  async function (this: SpecWorld, last: string) {
    const password = passwordOf(this).slice(0, -last.length) + last;
    const hash = hashNamed(this, 0);
    await checked(this, () => hasherOf(this).check(password, hash));
  },
);

When(
  "{string} is checked against no hash",
  async function (this: SpecWorld, password: string) {
    this.checkTook.againstNone = await checked(this, () =>
      hasherOf(this).check(password, undefined),
    );
  },
);

When(
  "{string} is checked against the hash {string}",
  async function (this: SpecWorld, password: string, hash: string) {
    await checked(this, () => hasherOf(this).check(password, hash));
  },
);

// What it found ----------------------------------------------------------

const found = (world: SpecWorld): PasswordCheck => {
  assert.ok(world.passwordCheck !== undefined, "Nothing has been checked.");
  return world.passwordCheck;
};

Then("it matches", function (this: SpecWorld) {
  assert.equal(found(this).matches, true, "It does not match.");
});

Then("it does not match", function (this: SpecWorld) {
  assert.equal(found(this).matches, false, "It matches.");
});

Then("the hash should be made again", function (this: SpecWorld) {
  assert.equal(found(this).remake, true, "The hash is not to be made again.");
});

Then("the hash need not be made again", function (this: SpecWorld) {
  assert.equal(found(this).remake, false, "The hash is to be made again.");
});

Then(
  "the hash does not contain {string}",
  function (this: SpecWorld, password: string) {
    assert.ok(!hashNamed(this, 0).includes(password), "The hash holds it.");
  },
);

Then("the two hashes differ", function (this: SpecWorld) {
  assert.notEqual(hashNamed(this, 0), hashNamed(this, 1));
});

// Half, rather than as long: two runs of the same work on a busy machine can
// differ by a good deal, and what this is here to catch is an answer that took
// no time at all.
Then(
  "checking against no hash took at least half as long as checking against the hash",
  function (this: SpecWorld) {
    const { againstHash, againstNone } = this.checkTook;
    assert.ok(
      againstHash !== undefined && againstNone !== undefined,
      "Both checks have not been made.",
    );
    assert.ok(
      againstNone >= againstHash / 2,
      `No hash took ${againstNone.toFixed(1)} ms, and a hash ${againstHash.toFixed(1)} ms.`,
    );
  },
);
