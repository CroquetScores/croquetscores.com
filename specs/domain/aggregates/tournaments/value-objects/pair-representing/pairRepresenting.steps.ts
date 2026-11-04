import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { pairRepresenting } from "../../../../../../src/domain/aggregates/tournaments/value-objects/pairRepresenting.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a scenario has said each of the two represents, and what the pair came
// to represent.
const scenarios = new WeakMap<
  SpecWorld,
  {
    first?: string | undefined;
    second?: string | undefined;
    represented?: string | undefined;
  }
>();

const scenarioOf = (world: SpecWorld) => {
  const found = scenarios.get(world) ?? {};
  scenarios.set(world, found);
  return found;
};

Given(
  "the first represents {string}",
  function (this: SpecWorld, what: string) {
    scenarioOf(this).first = what;
  },
);

Given("the first represents nothing", function (this: SpecWorld) {
  scenarioOf(this).first = undefined;
});

Given(
  "the second represents {string}",
  function (this: SpecWorld, what: string) {
    scenarioOf(this).second = what;
  },
);

Given("the second represents nothing", function (this: SpecWorld) {
  scenarioOf(this).second = undefined;
});

When("what the pair represents is made", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  scenario.represented = pairRepresenting(scenario.first, scenario.second);
});

Then("the pair represents {string}", function (this: SpecWorld, what: string) {
  assert.equal(scenarioOf(this).represented, what);
});

Then("the pair represents nothing", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).represented, undefined);
});
