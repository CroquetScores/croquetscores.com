import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type pg from "pg";

import { createPool } from "../../../../src/infrastructure/database/pool.js";
import type { SpecWorld } from "../../../support/world.js";

// Kept here, beside the steps that use them, and not on the world every spec
// shares: nothing else has any use for the address a pool was asked for.
const addresses = new WeakMap<SpecWorld, string>();
const pools = new WeakMap<SpecWorld, pg.Pool>();

Given(
  "the database address {string}",
  function (this: SpecWorld, address: string) {
    addresses.set(this, address);
  },
);

// An address is made here from what a scenario says of it, so that the
// scenarios say a password and not how an address spells one.
const onLocalhost = (
  world: SpecWorld,
  password = "postgres",
  asked: Readonly<Record<string, string>> = {},
): void => {
  const address = new URL(
    "postgres://postgres@localhost:5432/croquet_scores_development",
  );
  address.password = password;
  for (const [name, value] of Object.entries(asked)) {
    address.searchParams.set(name, value);
  }
  addresses.set(world, address.toString());
};

Given(
  "a database on localhost with the password {string}",
  function (this: SpecWorld, password: string) {
    onLocalhost(this, password);
  },
);

Given(
  "a database on localhost asked for with the application name {string}",
  function (this: SpecWorld, name: string) {
    onLocalhost(this, undefined, { application_name: name });
  },
);

Given(
  "a database on localhost that is connected to with encryption",
  function (this: SpecWorld) {
    onLocalhost(this, undefined, { sslmode: "require" });
  },
);

Given(
  "a database on localhost that is connected to without encryption",
  function (this: SpecWorld) {
    onLocalhost(this, undefined, { sslmode: "disable" });
  },
);

When("a pool is made for it", function (this: SpecWorld) {
  const address = addresses.get(this);
  assert.ok(address !== undefined, "No address was given.");
  pools.set(this, createPool(address));
});

const poolOf = (world: SpecWorld): pg.Pool => {
  const pool = pools.get(world);
  assert.ok(pool !== undefined, "No pool was made.");
  return pool;
};

// Read off the pool and not off a connection made with it: nothing here needs
// a database, which is what keeps these scenarios quick. A pool connects only
// when it is first used, so the one made here never does and has nothing to
// end.
const addressOf = (world: SpecWorld): URL => {
  const address = poolOf(world).options.connectionString;
  assert.ok(address !== undefined, "The pool was given no address.");
  return new URL(address);
};

Then(
  "the pool connects to {string}",
  function (this: SpecWorld, expected: string) {
    assert.equal(poolOf(this).options.connectionString, expected);
  },
);

Then(
  "the pool connects to the host {string}",
  function (this: SpecWorld, host: string) {
    assert.equal(addressOf(this).hostname, host);
  },
);

Then(
  "the pool connects with the password {string}",
  function (this: SpecWorld, password: string) {
    assert.equal(decodeURIComponent(addressOf(this).password), password);
  },
);

Then(
  "the pool connects with the application name {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(addressOf(this).searchParams.get("application_name"), name);
  },
);
