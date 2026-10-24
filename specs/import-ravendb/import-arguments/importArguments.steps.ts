import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  readImportArguments,
  type ImportArguments,
} from "../../../src/import-ravendb/importArguments.js";
import type { SpecWorld } from "../../support/world.js";

interface Reading {
  read?: ImportArguments | undefined;
  refused?: unknown;
}

const readings = new WeakMap<SpecWorld, Reading>();

const readingOf = (world: SpecWorld): Reading => {
  const found = readings.get(world) ?? {};
  readings.set(world, found);
  return found;
};

// What the import was run with, in the order it was given.
const read = (world: SpecWorld, given: readonly string[]): void => {
  const reading = readingOf(world);
  try {
    reading.read = readImportArguments(given);
    reading.refused = undefined;
  } catch (failure) {
    reading.read = undefined;
    reading.refused = failure;
  }
};

When("the import is run with no switches", function (this: SpecWorld) {
  read(this, []);
});

// Each of up to four words in quotes, parted by "and", as the command line
// would part them.
When(
  /^the import is run with ((?:"[^"]*")(?: and "[^"]*")*)$/,
  function (this: SpecWorld, given: string) {
    read(
      this,
      [...given.matchAll(/"([^"]*)"/g)].map((word) => word[1] ?? ""),
    );
  },
);

const readOf = (world: SpecWorld): ImportArguments => {
  const { read: found, refused } = readingOf(world);
  assert.equal(refused, undefined, `Refused: ${inspect(refused)}`);
  assert.ok(found !== undefined, "The import has not been run.");
  return found;
};

Then(
  /^the import is asked to stop after (\d+) errors?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(readOf(this).stopAfterErrors, Number(count));
  },
);

Then(
  "the import is not asked to stop after any number of errors",
  function (this: SpecWorld) {
    assert.equal(readOf(this).stopAfterErrors, undefined);
  },
);

Then("the import is not asked for a first day", function (this: SpecWorld) {
  assert.equal(readOf(this).from, undefined);
});

Then("the import is not asked for a last day", function (this: SpecWorld) {
  assert.equal(readOf(this).to, undefined);
});

Then(
  "the import is asked for tournaments from {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(readOf(this).from, day);
  },
);

Then(
  "the import is asked for tournaments to {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(readOf(this).to, day);
  },
);

Then(
  "running the import is refused with {string}",
  function (this: SpecWorld, code: string) {
    const { refused } = readingOf(this);
    assert.ok(refused !== undefined, "Running the import was not refused.");
    assert.equal((refused as { code?: unknown }).code, code, inspect(refused));
  },
);
