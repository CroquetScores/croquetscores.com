import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CountriesRefused } from "../../../../src/application/services/WorldRankingCountries.js";
import type { WorldRankingSport } from "../../../../src/application/services/WorldRankingLists.js";
import { FileWorldRankingCountries } from "../../../../src/infrastructure/world-rankings/FileWorldRankingCountries.js";
import type { SpecWorld } from "../../../support/world.js";

// The lists a scenario gives, written as the files they are kept in and read as
// the site reads them, so that what is read is what the files hold and not what
// the scenario means.
interface Given {
  acRows: string[];
  gcRows: string[];
}

const givens = new WeakMap<SpecWorld, Given>();
const named = new WeakMap<SpecWorld, ReadonlySet<string>>();
const refusals = new WeakMap<SpecWorld, unknown>();

const givenOf = (world: SpecWorld): Given => {
  const found = givens.get(world);
  if (found !== undefined) return found;
  const made: Given = { acRows: [], gcRows: [] };
  givens.set(world, made);
  return made;
};

Given(
  "an Association Croquet list that lists {string}",
  function (this: SpecWorld, country: string) {
    const given = givenOf(this);
    given.acRows.push(`${String(given.acRows.length + 1)},${country},,,`);
  },
);

Given(
  "an Association Croquet list of countries with the row {string}",
  function (this: SpecWorld, row: string) {
    givenOf(this).acRows.push(row);
  },
);

Given(
  "a Golf Croquet event in {string}",
  function (this: SpecWorld, letters: string) {
    const given = givenOf(this);
    const number = String(given.gcRows.length + 1);
    given.gcRows.push(`${number},1,Event,${letters},41000,2,31,1,31,2012`);
  },
);

Given(
  "a Golf Croquet list of events with the row {string}",
  function (this: SpecWorld, row: string) {
    givenOf(this).gcRows.push(row);
  },
);

When(
  /^the countries of the (Association Croquet|Golf Croquet) list are asked for$/,
  function (this: SpecWorld, which: string) {
    const given = givenOf(this);
    const sport: WorldRankingSport =
      which === "Association Croquet" ? "ac" : "gc";
    try {
      named.set(
        this,
        FileWorldRankingCountries.parse({
          acCountries: given.acRows.join("\n"),
          gcEvents: given.gcRows.join("\n"),
        }).countriesOf(sport),
      );
    } catch (failure) {
      refusals.set(this, failure);
    }
  },
);

Then(
  "the list names the country {string}",
  function (this: SpecWorld, code: string) {
    assert.ok(named.get(this)?.has(code));
  },
);

Then("the list names no country", function (this: SpecWorld) {
  assert.equal(named.get(this)?.size, 0);
});

Then("the list names {int} country", function (this: SpecWorld, count: number) {
  assert.equal(named.get(this)?.size, count);
});

Then(
  "reading the list is refused with {string}",
  function (this: SpecWorld, code: string) {
    const refusal = refusals.get(this);
    assert.ok(refusal instanceof CountriesRefused);
    assert.equal(refusal.code, code);
  },
);
