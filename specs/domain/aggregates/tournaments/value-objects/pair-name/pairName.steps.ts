import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { pairName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/pairName.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a scenario has said of the two names, and what the pair came to be
// called.
const scenarios = new WeakMap<
  SpecWorld,
  { first?: string; second?: string; called?: string }
>();

const scenarioOf = (world: SpecWorld) => {
  const found = scenarios.get(world) ?? {};
  scenarios.set(world, found);
  return found;
};

Given("the first name {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).first = name;
});

Given("the second name {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).second = name;
});

When("the pair is named", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  assert.ok(scenario.first !== undefined, "No first name has been given.");
  assert.ok(scenario.second !== undefined, "No second name has been given.");
  scenario.called = pairName(scenario.first, scenario.second);
});

Then("the pair is called {string}", function (this: SpecWorld, name: string) {
  assert.equal(scenarioOf(this).called, name);
});
