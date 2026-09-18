import { Given, Then, When } from "@cucumber/cucumber";
import { hash, type Algorithm } from "@node-rs/argon2";
import { strict as assert } from "node:assert";

import {
  costOf,
  todaysCost,
} from "../../../../src/infrastructure/identity/Argon2id.js";
import { Argon2PasswordHasher } from "../../../../src/infrastructure/identity/Argon2PasswordHasher.js";
import { checked } from "../../../application/services/password-hasher/PasswordHasher.steps.js";
import type { SpecWorld } from "../../../support/world.js";

const argon2id = 2 as Algorithm;

// A hash made some older way, at a cost of the scenario's choosing.
const olderHashes = new WeakMap<SpecWorld, string>();

Given("the argon2 password hasher", function (this: SpecWorld) {
  this.passwordHasher = new Argon2PasswordHasher();
});

const costOfTheHash = (world: SpecWorld) => {
  const made = world.passwordHashes[0];
  assert.ok(made !== undefined, "No hash has been made.");
  const cost = costOf(made);
  assert.ok(cost !== undefined, `The hash says nothing of its cost: ${made}`);
  return cost;
};

Then(
  "the hash says it was made with {string}",
  function (this: SpecWorld, algorithm: string) {
    assert.equal(costOfTheHash(this).algorithm, algorithm);
  },
);

Then(
  "the hash says it costs at least {int} KiB of memory",
  function (this: SpecWorld, least: number) {
    assert.ok(costOfTheHash(this).memoryCost >= least);
  },
);

Then(
  "the hash says it costs at least {int} passes",
  function (this: SpecWorld, least: number) {
    assert.ok(costOfTheHash(this).timeCost >= least);
  },
);

// Made by the library directly, as a hash kept from before today's cost was
// raised would have been made.
const madeOtherwise = async (
  world: SpecWorld,
  cost: { memoryCost: number; timeCost: number; parallelism: number },
): Promise<void> => {
  assert.ok(world.password !== undefined, "No password has been given.");
  olderHashes.set(
    world,
    await hash(world.password.normalize("NFC"), {
      ...cost,
      algorithm: argon2id,
    }),
  );
};

Given(
  "a hash of it made at {int} KiB of memory and {int} pass",
  async function (this: SpecWorld, memoryCost: number, timeCost: number) {
    await madeOtherwise(this, { memoryCost, timeCost, parallelism: 1 });
  },
);

// At today's memory and passes, so that the lanes are the only difference.
Given(
  "a hash of it made with {int} lanes",
  async function (this: SpecWorld, parallelism: number) {
    await madeOtherwise(this, { ...todaysCost, parallelism });
  },
);

When(
  "{string} is checked against that hash",
  async function (this: SpecWorld, password: string) {
    const older = olderHashes.get(this);
    const hasher = this.passwordHasher;
    assert.ok(older !== undefined && hasher !== undefined);
    await checked(this, () => hasher.check(password, older));
  },
);
