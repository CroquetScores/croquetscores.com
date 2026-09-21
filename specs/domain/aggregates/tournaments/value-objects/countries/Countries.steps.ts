import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Countries } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import { Flags } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Flags.js";
import type { SpecWorld } from "../../../../../support/world.js";

const countriesOfWorld = (world: SpecWorld): Countries => {
  assert.ok(
    world.countries !== undefined,
    `No countries have been made: ${inspect(world.failure)}`,
  );
  return world.countries;
};

// The country the scenario names by position, and the count of those named so
// far, so that "there are no more countries" knows where it is.
const countryAt = (world: SpecWorld, position: number, code: string): void => {
  const country = countriesOfWorld(world).all[position];
  assert.ok(country !== undefined, `There is no country ${position + 1}.`);
  assert.equal(country.code, code);
  world.countriesChecked = position + 1;
};

Given(
  "the name {string} for {string}",
  function (this: SpecWorld, name: string, code: string) {
    this.countryNames.push([code, name]);
  },
);

// Each region as a list of its own, so that regions given for one country in
// more than one list are what two regions named for one country always are.
Given(
  "the region {string} called {string} in {string}",
  function (this: SpecWorld, code: string, name: string, country: string) {
    this.countryRegions.push([country, [[code, name]]]);
  },
);

Given("the countries there are", function (this: SpecWorld) {
  this.countries = Countries.thereAre;
});

// Made from the flags there are, since every country is made from a flag there
// is, and the scenario names only what it is about: the names and the regions.
When("the countries are made", function (this: SpecWorld) {
  try {
    this.countries = Countries.from(
      Flags.thereAre,
      this.countryNames,
      this.countryRegions,
    );
  } catch (failure) {
    this.failure = failure;
  }
});

When("the country {string} is found", function (this: SpecWorld, code: string) {
  const country = countriesOfWorld(this).find(code);
  assert.ok(country !== undefined, `There is no country "${code}".`);
  this.country = country;
});

Then("there is a country {string}", function (this: SpecWorld, code: string) {
  assert.notEqual(countriesOfWorld(this).find(code), undefined);
});

Then("there is no country {string}", function (this: SpecWorld, code: string) {
  assert.equal(countriesOfWorld(this).find(code), undefined);
});

Then("the first country is {string}", function (this: SpecWorld, code: string) {
  countryAt(this, 0, code);
});

Then(
  "the second country is {string}",
  function (this: SpecWorld, code: string) {
    countryAt(this, 1, code);
  },
);

Then("the third country is {string}", function (this: SpecWorld, code: string) {
  countryAt(this, 2, code);
});

Then("there are no more countries", function (this: SpecWorld) {
  assert.deepEqual(
    countriesOfWorld(this)
      .all.slice(this.countriesChecked)
      .map((country) => country.code),
    [],
  );
});

// Named in full when it fails, so that whoever reads it knows which flags the
// list of names left out.
Then(
  "every flag there is but {string} is one of them",
  function (this: SpecWorld, notACountry: string) {
    const countries = countriesOfWorld(this);
    assert.deepEqual(
      Flags.thereAre.all
        .map(String)
        .filter(
          (name) => name !== notACountry && countries.find(name) === undefined,
        ),
      [],
      "These flags are no country's.",
    );
  },
);

// Named in full when it fails, so that whoever reads it knows which countries
// have no region to put a tournament in.
Then("every one of them has at least one region", function (this: SpecWorld) {
  assert.deepEqual(
    countriesOfWorld(this)
      .all.filter((country) => country.regions.length === 0)
      .map((country) => country.code),
    [],
    "These countries have no region.",
  );
});
