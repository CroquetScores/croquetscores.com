import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Countries } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import { TournamentFilter } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TournamentFilter.js";
import { Website } from "../../../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { scenarioOf } from "../../tournament/aTournament.js";

// The country and the region are named by the steps a tournament's creation
// names them by, and the sport and the website by their own: the words are the
// same, and two definitions of them leave Cucumber unable to choose.

const filters = new WeakMap<SpecWorld, TournamentFilter>();

// The days are said in their own steps, and kept beside the filter rather than
// on the world, since nothing else asks for them.
const days = new WeakMap<
  SpecWorld,
  { firstDay?: string | undefined; lastDay?: string | undefined }
>();

Given("the first day {string}", function (this: SpecWorld, day: string) {
  days.set(this, { ...days.get(this), firstDay: day });
});

Given("the last day {string}", function (this: SpecWorld, day: string) {
  days.set(this, { ...days.get(this), lastDay: day });
});

const filterOf = (world: SpecWorld): TournamentFilter => {
  const filter = filters.get(world);
  assert.ok(
    filter !== undefined,
    `No filter has been made: ${inspect(world.failure)}`,
  );
  return filter;
};

// Making a filter may be refused, and the scenario says which it expects. The
// country is found by the scenario rather than by the filter, as the
// application finds it.
When("the filter is made", function (this: SpecWorld) {
  const { country, region } = scenarioOf(this).creating;
  try {
    filters.set(
      this,
      TournamentFilter.from(this.website ?? Website.croquetScores, {
        country:
          country === undefined ? undefined : Countries.thereAre.find(country),
        region: region ?? undefined,
        sport: this.sportSaid,
        ...days.get(this),
      }),
    );
  } catch (failure) {
    this.failure = failure;
  }
});

Then("it filters by no country", function (this: SpecWorld) {
  assert.equal(filterOf(this).country, undefined);
});

Then("it filters by no region", function (this: SpecWorld) {
  assert.equal(filterOf(this).region, undefined);
});

Then("it filters by no sport", function (this: SpecWorld) {
  assert.equal(filterOf(this).sport, undefined);
});

Then(
  "it filters by the country {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(filterOf(this).country?.code, code);
  },
);

Then(
  "it filters by the region {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(filterOf(this).region?.code, code);
  },
);

Then(
  "it filters by the sport {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(filterOf(this).sport?.code, code);
  },
);

Then("it filters by no first day", function (this: SpecWorld) {
  assert.equal(filterOf(this).firstDay, undefined);
});

Then("it filters by no last day", function (this: SpecWorld) {
  assert.equal(filterOf(this).lastDay, undefined);
});

Then(
  "it filters by the first day {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(filterOf(this).firstDay, day);
  },
);

Then(
  "it filters by the last day {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(filterOf(this).lastDay, day);
  },
);
