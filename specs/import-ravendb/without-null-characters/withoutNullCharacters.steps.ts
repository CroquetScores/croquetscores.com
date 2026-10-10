import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { withoutNullCharacters } from "../../../src/import-ravendb/withoutNullCharacters.js";
import type { SpecWorld } from "../../support/world.js";

// A null character cannot be typed into a scenario, so "␀" stands for one.
const nullsIn = (said: string): string => said.replaceAll("␀", "\u0000");

interface Scenario {
  read: Record<string, unknown>;
  taken?: unknown;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = { read: {} };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// A field by its path, as "Results.0._Players.0.Name": a number names a place
// in a list, and anything else a field.
const partsOf = (path: string): (string | number)[] =>
  path.split(".").map((part) => (/^\d+$/.test(part) ? Number(part) : part));

const put = (
  document: Record<string, unknown>,
  path: string,
  value: unknown,
): void => {
  const parts = partsOf(path);
  let at: Record<string | number, unknown> = document;
  parts.slice(0, -1).forEach((part, index) => {
    if (at[part] === undefined) {
      at[part] = typeof parts[index + 1] === "number" ? [] : {};
    }
    at = at[part] as Record<string | number, unknown>;
  });
  at[parts.at(-1)!] = value;
};

const valueAt = (document: unknown, path: string): unknown =>
  partsOf(path).reduce<unknown>(
    (at, part) =>
      at === undefined || at === null
        ? undefined
        : (at as Record<string | number, unknown>)[part],
    document,
  );

const taken = (world: SpecWorld): unknown => {
  const { taken } = scenarioOf(world);
  assert.ok(taken !== undefined, "Nothing has been taken out yet.");
  return taken;
};

Given(
  /^(?:a document )?whose "([^"]*)" is "([^"]*)"$/,
  function (this: SpecWorld, path: string, said: string) {
    put(scenarioOf(this).read, path, nullsIn(said));
  },
);

Given(
  "a document whose {string} is the number {int}",
  function (this: SpecWorld, path: string, number: number) {
    put(scenarioOf(this).read, path, number);
  },
);

Given(
  "a document whose {string} is true",
  function (this: SpecWorld, path: string) {
    put(scenarioOf(this).read, path, true);
  },
);

Given(
  "a document whose {string} is empty",
  function (this: SpecWorld, path: string) {
    put(scenarioOf(this).read, path, null);
  },
);

When("the null characters are taken out of it", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  scenario.taken = withoutNullCharacters(scenario.read);
});

Then(
  /^its "([^"]*)" is "([^"]*)"$/,
  function (this: SpecWorld, path: string, said: string) {
    assert.equal(valueAt(taken(this), path), nullsIn(said));
  },
);

Then(
  "its {string} is the number {int}",
  function (this: SpecWorld, path: string, number: number) {
    assert.equal(valueAt(taken(this), path), number);
  },
);

Then("its {string} is true", function (this: SpecWorld, path: string) {
  assert.equal(valueAt(taken(this), path), true);
});

Then("its {string} is empty", function (this: SpecWorld, path: string) {
  assert.equal(valueAt(taken(this), path), null);
});

Then(
  "the document read has {string} as {string}",
  function (this: SpecWorld, path: string, said: string) {
    assert.equal(valueAt(scenarioOf(this).read, path), nullsIn(said));
  },
);
