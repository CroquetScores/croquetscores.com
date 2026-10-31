import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TournamentFormat } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import type { SpecWorld } from "../../../../../support/world.js";

const formatOfWorld = (world: SpecWorld): TournamentFormat => {
  assert.ok(
    world.tournamentFormat !== undefined,
    `No format has been made: ${inspect(world.failure)}`,
  );
  return world.tournamentFormat;
};

Given("the format {string}", function (this: SpecWorld, name: string) {
  this.tournamentFormat = TournamentFormat.from(name);
});

// Making a format may be refused, and the scenario says which it expects.
When("the format {string} is made", function (this: SpecWorld, name: string) {
  try {
    this.tournamentFormat = TournamentFormat.from(name);
  } catch (failure) {
    this.failure = failure;
  }
});

When(
  "it is compared with the format {string}",
  function (this: SpecWorld, name: string) {
    this.sameTournamentFormat = formatOfWorld(this).equals(
      TournamentFormat.from(name),
    );
  },
);

Then("they are the same format", function (this: SpecWorld) {
  assert.equal(this.sameTournamentFormat, true);
});

Then("they are different formats", function (this: SpecWorld) {
  assert.equal(this.sameTournamentFormat, false);
});

Then("the format's name is {string}", function (this: SpecWorld, name: string) {
  assert.equal(formatOfWorld(this).name, name);
});

Then("the format's code is {string}", function (this: SpecWorld, code: string) {
  assert.equal(formatOfWorld(this).code, code);
});

Then("it is played by teams", function (this: SpecWorld) {
  assert.equal(formatOfWorld(this).isTeamFormat, true);
});

Then("it is not played by teams", function (this: SpecWorld) {
  assert.equal(formatOfWorld(this).isTeamFormat, false);
});

Then("it has groups", function (this: SpecWorld) {
  assert.equal(formatOfWorld(this).hasGroups, true);
});

Then("it has no groups", function (this: SpecWorld) {
  assert.equal(formatOfWorld(this).hasGroups, false);
});
