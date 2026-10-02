import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../support/world.js";
import { positionOf } from "../../../../domain/aggregates/tournaments/ordinals.js";
import { teamAnswered, teamsAnswered } from "./teamsAnswered.js";

// What any list of teams is answered with, in the words both a tournament's
// teams and a test's are read in.

Then("no teams are answered", function (this: SpecWorld) {
  assert.deepEqual(teamsAnswered(this), []);
});

Then("the team {string} is answered", function (this: SpecWorld, name: string) {
  teamAnswered(this, name);
});

Then(
  "the team {string} is not answered",
  function (this: SpecWorld, name: string) {
    const names = teamsAnswered(this).map((team) => team.name);
    assert.ok(!names.includes(name), `It answered ${JSON.stringify(names)}.`);
  },
);

Then(
  "the {word} team answered is {string}",
  function (this: SpecWorld, ordinal: string, name: string) {
    assert.equal(teamsAnswered(this)[positionOf(ordinal)]?.name, name);
  },
);

Then(
  "the team {string} is answered known for short as {string}",
  function (this: SpecWorld, name: string, shortName: string) {
    assert.equal(teamAnswered(this, name).shortName, shortName);
  },
);
