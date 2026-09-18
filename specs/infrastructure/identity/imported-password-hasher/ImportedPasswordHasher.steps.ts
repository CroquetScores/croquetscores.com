import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomBytes } from "node:crypto";

import { costOf } from "../../../../src/infrastructure/identity/Argon2id.js";
import { OldSitePasswordHasher } from "../../../../src/infrastructure/identity/OldSitePasswordHasher.js";
import {
  asLetterThenAccent,
  checked,
} from "../../../application/services/password-hasher/PasswordHasher.steps.js";
import type { SpecWorld } from "../../../support/world.js";
import { passwordsOf, scenariosSiteSalt } from "../../support/passwords.js";

// How an imported hash is told from any other. Named here as well as in the
// importer, so that a mark that changed there, or went, fails here.
const importedMark = "$old-site$";

// The old site's hash of a password, made as the old site made one: a salt of
// its own, and the two kept together in 52 characters.
const oldHashOf = (password: string): string => {
  const salt = randomBytes(16).toString("base64");
  const hash = new OldSitePasswordHasher(scenariosSiteSalt).hashOf(
    password,
    salt,
  );
  return salt.slice(0, 4) + hash + salt.slice(4);
};

Given(
  "the old site's hash of {string}",
  function (this: SpecWorld, password: string) {
    passwordsOf(this).oldHash = oldHashOf(password);
  },
);

Given(
  "the old site's hash of {string} with its accent typed after the letter",
  function (this: SpecWorld, password: string) {
    passwordsOf(this).oldHash = oldHashOf(asLetterThenAccent(password));
  },
);

Given("an old hash {string}", function (this: SpecWorld, kept: string) {
  passwordsOf(this).oldHash = kept;
});

When("the old hash is imported", async function (this: SpecWorld) {
  const passwords = passwordsOf(this);
  assert.ok(passwords.oldHash !== undefined, "There is no old hash.");
  try {
    passwords.importedHash = await passwords.hasher.import(passwords.oldHash);
  } catch (failure) {
    this.failure = failure;
  }
});

const importedOf = (world: SpecWorld): string => {
  const imported = passwordsOf(world).importedHash;
  assert.ok(imported !== undefined, "Nothing has been imported.");
  return imported;
};

Then("the imported hash says it was imported", function (this: SpecWorld) {
  assert.ok(importedOf(this).startsWith(importedMark));
});

Then(
  "the imported hash does not contain the old hash",
  function (this: SpecWorld) {
    const { oldHash } = passwordsOf(this);
    assert.ok(oldHash !== undefined);
    const imported = importedOf(this);
    assert.ok(!imported.includes(oldHash), "It holds what the old site kept.");
    assert.ok(
      !imported.includes(oldHash.slice(4, 32)),
      "It holds the old site's hash.",
    );
  },
);

// The cost is said by the argon2id hash within it, after the mark and the salt.
const importedCost = (world: SpecWorld) => {
  const imported = importedOf(world);
  const cost = costOf(imported.slice(imported.indexOf("$argon2")));
  assert.ok(cost !== undefined, `The imported hash says no cost: ${imported}`);
  return cost;
};

Then(
  "the imported hash says it costs at least {int} KiB of memory",
  function (this: SpecWorld, least: number) {
    assert.ok(importedCost(this).memoryCost >= least);
  },
);

Then(
  "the imported hash says it costs at least {int} passes",
  function (this: SpecWorld, least: number) {
    assert.ok(importedCost(this).timeCost >= least);
  },
);

// Checking, counting what was asked of argon2id and the old site's hasher while
// it happened and nothing before.
const checkedCounting = async (
  world: SpecWorld,
  password: string,
  hash: string,
): Promise<void> => {
  const passwords = passwordsOf(world);
  passwords.argon2.asked = 0;
  passwords.oldSite.asked = 0;
  await checked(world, () => passwords.hasher.check(password, hash));
};

When(
  "{string} is checked against the imported hash",
  async function (this: SpecWorld, password: string) {
    await checkedCounting(this, password, importedOf(this));
  },
);

When(
  "{string} with its accent typed after the letter is checked against the imported hash",
  async function (this: SpecWorld, password: string) {
    await checkedCounting(this, asLetterThenAccent(password), importedOf(this));
  },
);

When(
  "the old hash is checked, as a password, against the imported hash",
  async function (this: SpecWorld) {
    const { oldHash } = passwordsOf(this);
    assert.ok(oldHash !== undefined);
    // Both ways the old hash might be typed: all of what the old site kept,
    // and the hash alone. Neither is a password.
    await checkedCounting(this, oldHash.slice(4, 32), importedOf(this));
    assert.equal(
      this.passwordCheck?.matches,
      false,
      "The old site's hash, typed in as a password, matches.",
    );
    await checkedCounting(this, oldHash, importedOf(this));
  },
);

Then("argon2id was asked once", function (this: SpecWorld) {
  assert.equal(passwordsOf(this).argon2.asked, 1);
});

Then("the old hasher was not asked", function (this: SpecWorld) {
  assert.equal(passwordsOf(this).oldSite.asked, 0);
});

When(
  "the hash is made again from {string}",
  async function (this: SpecWorld, password: string) {
    const passwords = passwordsOf(this);
    passwords.remade = await passwords.hasher.hash(password);
  },
);

const remadeOf = (world: SpecWorld): string => {
  const remade = passwordsOf(world).remade;
  assert.ok(remade !== undefined, "The hash has not been made again.");
  return remade;
};

Then(
  "the hash made again does not say it was imported",
  function (this: SpecWorld) {
    assert.ok(!remadeOf(this).startsWith(importedMark));
  },
);

When(
  "{string} is checked against the hash made again",
  async function (this: SpecWorld, password: string) {
    await checkedCounting(this, password, remadeOf(this));
  },
);
