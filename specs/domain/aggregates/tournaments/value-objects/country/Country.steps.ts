import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Country } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Country.js";
import type { Flag } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Flag.js";
import type { SpecWorld } from "../../../../../support/world.js";

// The flags a country is made from are made by the flag's own steps.
const flagOfWorld = (world: SpecWorld): Flag => {
  assert.ok(world.flag !== undefined, "No flag has been made.");
  return world.flag;
};

const otherFlagOfWorld = (world: SpecWorld): Flag => {
  assert.ok(world.otherFlag !== undefined, "No other flag has been made.");
  return world.otherFlag;
};

const countryOfWorld = (world: SpecWorld): Country => {
  assert.ok(
    world.country !== undefined,
    `No country has been made: ${inspect(world.failure)}`,
  );
  return world.country;
};

const otherCountryOfWorld = (world: SpecWorld): Country => {
  assert.ok(world.otherCountry !== undefined, "No other country is made.");
  return world.otherCountry;
};

Given("the country named {string}", function (this: SpecWorld, name: string) {
  this.country = Country.from(flagOfWorld(this), name);
});

Given(
  "the other country named {string}",
  function (this: SpecWorld, name: string) {
    this.otherCountry = Country.from(otherFlagOfWorld(this), name);
  },
);

// Making a country may be refused, and the scenario says which it expects.
When(
  "the country named {string} is made",
  function (this: SpecWorld, name: string) {
    try {
      this.country = Country.from(flagOfWorld(this), name);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

When("the countries are compared", function (this: SpecWorld) {
  this.sameCountry = countryOfWorld(this).equals(otherCountryOfWorld(this));
});

Then("they are the same country", function (this: SpecWorld) {
  assert.equal(this.sameCountry, true);
});

Then("they are different countries", function (this: SpecWorld) {
  assert.equal(this.sameCountry, false);
});

Then(
  "the country's code is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(countryOfWorld(this).code, code);
  },
);

Then(
  "the country's name is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(countryOfWorld(this).name, name);
  },
);

Then(
  "the country's flag is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(String(countryOfWorld(this).flag), name);
  },
);
