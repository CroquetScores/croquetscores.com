import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { TournamentOfAccount } from "../../../../src/application/operations/tournaments/TournamentsOfAccount.js";
import { Website } from "../../../../src/domain/common/Website.js";
import { TournamentsByAccount } from "../../../../src/infrastructure/read-models/TournamentsByAccount.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  accountFor,
  at,
  doneTo,
  foundCalled,
  scenarioOf,
  standUp,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What a tournament is, what is done to it and what is found of it are said in
// the words every read model of tournaments shares
// (specs/infrastructure/support/tournamentReadModels.ts). What is here is the
// parts accounts have, and what is asked of an account.

// What the read model last found, as it found it: the shared steps see only
// what every read model of tournaments finds.
const foundByAccount = new WeakMap<SpecWorld, readonly TournamentOfAccount[]>();

const found = (world: SpecWorld, name: string): TournamentOfAccount =>
  foundCalled(foundByAccount.get(world) ?? [], name);

const readModelOf = (world: SpecWorld): TournamentsByAccount => {
  const { readModel } = scenarioOf(world);
  assert.ok(readModel instanceof TournamentsByAccount);
  return readModel;
};

Given("the tournaments by account read model", function (this: SpecWorld) {
  standUp(this, new TournamentsByAccount(unitOfWorkOf(this)), {
    country: "au",
    region: "vic",
  });
});

// What is done to it ------------------------------------------------------------------

Given(
  "the account for {string} is made a manager of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await doneTo(this, name, (tournament, by) => {
      tournament.addManager(accountFor(this, address), by, at);
    });
  },
);

Given(
  "the account for {string} is taken off the managers of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await doneTo(this, name, (tournament, by) => {
      tournament.removeManager(accountFor(this, address), by, at);
    });
  },
);

Given(
  "the account for {string} is made a scorer of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await doneTo(this, name, (tournament, by) => {
      tournament.addScorer(accountFor(this, address), by, at);
    });
  },
);

Given(
  "the account for {string} is taken off the scorers of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await doneTo(this, name, (tournament, by) => {
      tournament.removeScorer(accountFor(this, address), by, at);
    });
  },
);

// Looking ------------------------------------------------------------------------------

const lookFor = async (
  world: SpecWorld,
  address: string,
  website: string,
  year: number,
): Promise<void> => {
  const scenario = scenarioOf(world);
  const answer = await world.asARequest(() =>
    readModelOf(world).tournamentsOf(
      accountFor(world, address),
      Website.from(website),
      year,
    ),
  );
  foundByAccount.set(world, answer);
  scenario.found = answer;
};

When(
  "the tournaments of the account for {string} in {int} are looked for",
  async function (this: SpecWorld, address: string, year: number) {
    await lookFor(this, address, "croquetscores.com", year);
  },
);

When(
  "the tournaments of the account for {string} on {string} in {int} are looked for",
  async function (
    this: SpecWorld,
    address: string,
    website: string,
    year: number,
  ) {
    await lookFor(this, address, website, year);
  },
);

const lookForYears = async (
  world: SpecWorld,
  address: string,
  website: string,
): Promise<void> => {
  const scenario = scenarioOf(world);
  scenario.years = await world.asARequest(() =>
    readModelOf(world).yearsOf(
      accountFor(world, address),
      Website.from(website),
    ),
  );
};

When(
  "the years of the account for {string} are looked for",
  async function (this: SpecWorld, address: string) {
    await lookForYears(this, address, "croquetscores.com");
  },
);

When(
  "the years of the account for {string} on {string} are looked for",
  async function (this: SpecWorld, address: string, website: string) {
    await lookForYears(this, address, website);
  },
);

// What was found -------------------------------------------------------------------------

Then(
  "{string} is held as one it manages",
  function (this: SpecWorld, name: string) {
    assert.equal(found(this, name).part, "manager");
  },
);

Then(
  "{string} is held as one it scores",
  function (this: SpecWorld, name: string) {
    assert.equal(found(this, name).part, "scorer");
  },
);

Then("{string} is held as archived", function (this: SpecWorld, name: string) {
  assert.equal(found(this, name).archived, true);
});

Then(
  "{string} is held as not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(found(this, name).archived, false);
  },
);
