// Listing the tournaments played in countries the world rankings do not list
// (TournamentsInUnlistedCountries.feature, countries.feature), through the
// mediator "the application's tournaments" stands up, with the countries the
// lists name as the scenario says they do.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type TournamentInUnlistedCountry,
  TournamentsInUnlistedCountries,
} from "../../../../../src/application/operations/world-rankings/TournamentsInUnlistedCountries.js";
import { Countries } from "../../../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import type { SpecWorld } from "../../../../support/world.js";
import { accountAt, keepingWhatCameOf } from "../../accounts/roleRequests.js";
import { inHandOf } from "../../tournaments/aRequest.js";

Given(
  /^the (Association Croquet|Golf Croquet) world rankings list names the country "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    const country = Countries.thereAre.all.find((each) => each.name === name);
    assert.ok(country !== undefined, `The site has no country ${name}.`);
    inHandOf(this).listedCountries[
      which === "Association Croquet" ? "ac" : "gc"
    ].add(country.code);
  },
);

When(
  "the reader signed in to the account for {string} lists the tournaments in unlisted countries",
  async function (this: SpecWorld, reader: string) {
    const asking = await accountAt(this, reader);
    await keepingWhatCameOf(this, () =>
      inHandOf(this).ask(new TournamentsInUnlistedCountries(asking.id.value)),
    );
  },
);

const answeredCalled = (
  world: SpecWorld,
  name: string,
): TournamentInUnlistedCountry => {
  assert.equal(world.failure, undefined, "Listing was refused.");
  const called = (
    world.answer as readonly TournamentInUnlistedCountry[]
  ).filter((each) => each.name === name);
  assert.equal(
    called.length,
    1,
    `${String(called.length)} are called ${name}.`,
  );
  return called[0]!;
};

Then(
  "{string} is answered as played in {string}",
  function (this: SpecWorld, name: string, country: string) {
    assert.equal(answeredCalled(this, name).countryName, country);
  },
);

Then(
  "{string} is answered as found at {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(answeredCalled(this, name).address, address);
  },
);

Then(
  "listing the tournaments in unlisted countries is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal((this.failure as { code?: string } | undefined)?.code, code);
  },
);
