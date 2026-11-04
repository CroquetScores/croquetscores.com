// The pages a search found, as the scenarios of the index and of the site
// both read them back, with the steps that read them.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

export interface Found {
  readonly title: string;
  readonly score: number;
  readonly snippet: string;
  /** The page's name in the help, where the search says it. */
  readonly name?: string;
  /** Where the page is, where the search says it. */
  readonly url?: string;
}

const found = new WeakMap<SpecWorld, readonly Found[]>();

/** Keeps what the scenario's search found. */
export const keepResults = (
  world: SpecWorld,
  results: readonly Found[],
): void => {
  found.set(world, results);
};

const resultAt = (world: SpecWorld, at: number): Found => {
  const result = found.get(world)?.[at];
  assert.ok(result !== undefined, `There is no result number ${at + 1}.`);
  return result;
};

const count = (world: SpecWorld): number => found.get(world)?.length ?? 0;

Then("there is one result", function (this: SpecWorld) {
  assert.equal(count(this), 1);
});

Then("there are no results", function (this: SpecWorld) {
  assert.ok(found.has(this), "Nothing was searched for.");
  assert.equal(count(this), 0);
});

Then("there are {int} results", function (this: SpecWorld, many: number) {
  assert.equal(count(this), many);
});

Then(
  "the first result is the page {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(resultAt(this, 0).name, name);
  },
);

Then(
  "the second result is the page {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(resultAt(this, 1).name, name);
  },
);

Then("the first result is {string}", function (this: SpecWorld, title: string) {
  assert.equal(resultAt(this, 0).title, title);
});

Then(
  "the title of the first result is {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(resultAt(this, 0).title, title);
  },
);

Then(
  "the page of the first result is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(resultAt(this, 0).name, name);
  },
);

Then(
  "the snippet of the first result says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(resultAt(this, 0).snippet.includes(words));
  },
);

Then(
  "the score of the first result is more than {int}",
  function (this: SpecWorld, least: number) {
    assert.ok(resultAt(this, 0).score > least);
  },
);

Then(
  "the first result leads to the page {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(resultAt(this, 0).url, `/help/${name}`);
  },
);
