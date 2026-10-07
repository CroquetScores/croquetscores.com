import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { WorldRankingName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/WorldRankingName.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What making a world ranking name came to, kept here rather than on the
// world, which has no business knowing what one is. Making one can come to
// none at all, which is not the same as not having been made.
const made = new WeakMap<
  SpecWorld,
  { readonly name: WorldRankingName | undefined }
>();

// Making one may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, given: string): void => {
  try {
    made.set(world, { name: WorldRankingName.from(given) });
  } catch (failure) {
    world.failure = failure;
  }
};

const madeOf = (world: SpecWorld): WorldRankingName | undefined => {
  const kept = made.get(world);
  assert.ok(
    kept !== undefined,
    `No world ranking name has been made: ${inspect(world.failure)}`,
  );
  return kept.name;
};

When(
  "the world ranking name {string} is made",
  function (this: SpecWorld, given: string) {
    tryToMake(this, given);
  },
);

When(
  "a world ranking name of {int} characters is made",
  function (this: SpecWorld, length: number) {
    tryToMake(this, "a".repeat(length));
  },
);

Then(
  "the world ranking name is written {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(String(madeOf(this)), name);
  },
);

Then("there is no world ranking name", function (this: SpecWorld) {
  assert.equal(madeOf(this), undefined);
});
