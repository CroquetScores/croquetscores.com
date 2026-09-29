import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Score } from "../../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { Website } from "../../../../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../../../../support/world.js";

// The score a scenario reads, and whether it was more than another. Kept here
// rather than on the world, which has no business knowing what a score is.
interface Scenario {
  score: Score | undefined;
  more: boolean | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = { score: undefined, more: undefined };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// Read with the website the scenario names, which the feature's Background
// does.
const read = (world: SpecWorld, typed: string): Score =>
  Score.read(typed, world.website ?? Website.croquetScores);

const scoreOf = (world: SpecWorld): Score => {
  const { score } = scenarioOf(world);
  assert.ok(
    score !== undefined,
    `No score was read: ${inspect(world.failure)}`,
  );
  return score;
};

When("the score {string} is read", function (this: SpecWorld, typed: string) {
  try {
    scenarioOf(this).score = read(this, typed);
  } catch (failure) {
    this.failure = failure;
  }
});

Given("the score {string}", function (this: SpecWorld, typed: string) {
  scenarioOf(this).score = read(this, typed);
});

When(
  "it is compared with the score {string}",
  function (this: SpecWorld, typed: string) {
    scenarioOf(this).more = scoreOf(this).isMoreThan(read(this, typed));
  },
);

Then("it is more", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).more, true);
});

Then("it is not more", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).more, false);
});

Then(
  "the score's points are {int}",
  function (this: SpecWorld, points: number) {
    assert.equal(scoreOf(this).points, points);
  },
);

Then(
  "the score is written {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(String(scoreOf(this)), written);
  },
);

Then("the score is marked as the winner's", function (this: SpecWorld) {
  assert.equal(scoreOf(this).marked, true);
});

Then("the score is not marked as the winner's", function (this: SpecWorld) {
  assert.equal(scoreOf(this).marked, false);
});
