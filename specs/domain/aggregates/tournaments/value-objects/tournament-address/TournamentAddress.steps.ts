import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TournamentAddress } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TournamentAddress.js";
import { Slug } from "../../../../../../src/domain/common/Slug.js";
import type { SpecWorld } from "../../../../../support/world.js";

const addressOfWorld = (world: SpecWorld): TournamentAddress => {
  assert.ok(
    world.tournamentAddress !== undefined,
    `No tournament address has been made: ${inspect(world.failure)}`,
  );
  return world.tournamentAddress;
};

// Making or reading an address may be refused, and the scenario says which it
// expects.
const tryTo = (world: SpecWorld, make: () => TournamentAddress): void => {
  try {
    world.tournamentAddress = make();
  } catch (failure) {
    world.failure = failure;
  }
};

Given("the year {int}", function (this: SpecWorld, year: number) {
  this.year = year;
});

Given("the slug {string}", function (this: SpecWorld, written: string) {
  this.slug = Slug.from(written);
});

Given(
  "the tournament address {string}",
  function (this: SpecWorld, written: string) {
    this.tournamentAddress = TournamentAddress.read(written);
  },
);

When("a tournament address is made from them", function (this: SpecWorld) {
  const { year, sport, slug } = this;
  assert.ok(year !== undefined, "No year has been named.");
  assert.ok(sport !== undefined, "No sport has been named.");
  assert.ok(slug !== undefined, "No slug has been named.");
  tryTo(this, () => TournamentAddress.from(year, sport, slug));
});

When(
  "a tournament address is read from {string}",
  function (this: SpecWorld, written: string) {
    tryTo(this, () => TournamentAddress.read(written));
  },
);

When(
  "it is compared with the tournament address {string}",
  function (this: SpecWorld, written: string) {
    this.otherTournamentAddress = TournamentAddress.read(written);
    this.sameTournamentAddress = addressOfWorld(this).equals(
      this.otherTournamentAddress,
    );
  },
);

Then(
  "the tournament address is written {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(addressOfWorld(this).toString(), written);
  },
);

Then(
  "the tournament address's year is {int}",
  function (this: SpecWorld, year: number) {
    assert.equal(addressOfWorld(this).year, year);
  },
);

Then(
  "the tournament address's sport is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(addressOfWorld(this).sport.code, code);
  },
);

Then(
  "the tournament address's slug is {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(addressOfWorld(this).slug.toString(), written);
  },
);

Then("they are the same tournament address", function (this: SpecWorld) {
  assert.equal(this.sameTournamentAddress, true);
});

Then("they are different tournament addresses", function (this: SpecWorld) {
  assert.equal(this.sameTournamentAddress, false);
});
