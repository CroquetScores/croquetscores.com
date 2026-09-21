import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Sport } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Sport.js";
import {
  croquetScoresSports,
  gateballScoresSports,
} from "../../../../../../src/domain/aggregates/tournaments/value-objects/sports.js";
import { siteOfWorld, type Site } from "../../../../../support/sites.js";
import type { SpecWorld } from "../../../../../support/world.js";

// The feature names a site as a reader would, and the domain keeps a list for
// each, so this is where the one is turned into the other.
const sportsOfSite: Readonly<Record<Site, readonly Sport[]>> = {
  "Croquet Scores": croquetScoresSports,
  "Gateball Scores": gateballScoresSports,
};

const offeredOfWorld = (world: SpecWorld): readonly Sport[] => {
  assert.ok(
    world.offeredSports !== undefined,
    "The sports a site offers have not been found.",
  );
  return world.offeredSports;
};

const codesOffered = (world: SpecWorld): string[] =>
  offeredOfWorld(world).map((sport) => sport.code);

// The sport the scenario names by position, and the count of those named so
// far, so that "there are no more sports" knows where it is.
const sportAt = (world: SpecWorld, position: number, code: string): void => {
  const sport = offeredOfWorld(world)[position];
  assert.ok(sport !== undefined, `There is no sport ${position + 1}.`);
  assert.equal(sport.code, code);
  world.offeredSportsChecked = position + 1;
};

When("the sports it offers are found", function (this: SpecWorld) {
  this.offeredSports = sportsOfSite[siteOfWorld(this)];
});

Then("the sport {string} is offered", function (this: SpecWorld, code: string) {
  assert.ok(codesOffered(this).includes(code), `"${code}" is not offered.`);
});

Then(
  "the sport {string} is not offered",
  function (this: SpecWorld, code: string) {
    assert.ok(!codesOffered(this).includes(code), `"${code}" is offered.`);
  },
);

Then("the first sport is {string}", function (this: SpecWorld, code: string) {
  sportAt(this, 0, code);
});

Then("the second sport is {string}", function (this: SpecWorld, code: string) {
  sportAt(this, 1, code);
});

Then("the third sport is {string}", function (this: SpecWorld, code: string) {
  sportAt(this, 2, code);
});

Then("the fourth sport is {string}", function (this: SpecWorld, code: string) {
  sportAt(this, 3, code);
});

Then("there are no more sports", function (this: SpecWorld) {
  assert.deepEqual(codesOffered(this).slice(this.offeredSportsChecked), []);
});
