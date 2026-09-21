import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { TournamentFormat } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TournamentFormat.js";
import {
  croquetScoresFormats,
  gateballScoresFormats,
} from "../../../../../../src/domain/aggregates/tournaments/value-objects/tournamentFormats.js";
import type { SpecWorld } from "../../../../../support/world.js";

// The feature names a site as a reader would, and the domain keeps a list for
// each, so this is where the one is turned into the other.
const formatsOfSite: ReadonlyMap<string, readonly TournamentFormat[]> = new Map(
  [
    ["Croquet Scores", croquetScoresFormats],
    ["Gateball Scores", gateballScoresFormats],
  ],
);

const offeredOfWorld = (world: SpecWorld): readonly TournamentFormat[] => {
  assert.ok(
    world.offeredFormats !== undefined,
    "The formats a site offers have not been found.",
  );
  return world.offeredFormats;
};

const namesOffered = (world: SpecWorld): string[] =>
  offeredOfWorld(world).map((format) => format.name);

// The format the scenario names by position, and the count of those named so
// far, so that "there are no more formats" knows where it is.
const formatAt = (world: SpecWorld, position: number, name: string): void => {
  const format = offeredOfWorld(world)[position];
  assert.ok(format !== undefined, `There is no format ${position + 1}.`);
  assert.equal(format.name, name);
  world.offeredFormatsChecked = position + 1;
};

Given("the site {string}", function (this: SpecWorld, site: string) {
  assert.ok(formatsOfSite.has(site), `There is no site "${site}".`);
  this.site = site;
});

When("the formats it offers are found", function (this: SpecWorld) {
  assert.ok(this.site !== undefined, "No site has been named.");
  this.offeredFormats = formatsOfSite.get(this.site);
});

Then("{string} is one of them", function (this: SpecWorld, name: string) {
  assert.ok(namesOffered(this).includes(name), `"${name}" is not offered.`);
});

Then("{string} is not one of them", function (this: SpecWorld, name: string) {
  assert.ok(!namesOffered(this).includes(name), `"${name}" is offered.`);
});

Then("the first format is {string}", function (this: SpecWorld, name: string) {
  formatAt(this, 0, name);
});

Then("the second format is {string}", function (this: SpecWorld, name: string) {
  formatAt(this, 1, name);
});

Then("the third format is {string}", function (this: SpecWorld, name: string) {
  formatAt(this, 2, name);
});

Then("the fourth format is {string}", function (this: SpecWorld, name: string) {
  formatAt(this, 3, name);
});

Then("the fifth format is {string}", function (this: SpecWorld, name: string) {
  formatAt(this, 4, name);
});

Then("there are no more formats", function (this: SpecWorld) {
  assert.deepEqual(namesOffered(this).slice(this.offeredFormatsChecked), []);
});
