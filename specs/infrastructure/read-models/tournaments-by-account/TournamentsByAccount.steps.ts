import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AggregateRepository } from "../../../../src/application/common/AggregateRepository.js";
import { ProjectingEventStore } from "../../../../src/application/common/ProjectingEventStore.js";
import type { TournamentOfAccount } from "../../../../src/application/operations/tournaments/TournamentsOfAccount.js";
import {
  detailsFrom,
  type TournamentRequest,
} from "../../../../src/application/operations/tournaments/tournamentOperations.js";
import { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import { nameTournamentEvents } from "../../../../src/domain/aggregates/tournaments/events/tournamentEvents.js";
import { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../../../../src/domain/aggregates/tournaments/Tournament.js";
import { EventRegistry } from "../../../../src/domain/common/EventRegistry.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { Website } from "../../../../src/domain/common/Website.js";
import { PostgresEventStore } from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import { TournamentsByAccount } from "../../../../src/infrastructure/read-models/TournamentsByAccount.js";
import type { SpecWorld } from "../../../support/world.js";
import { rebuildsWith } from "../../support/projections.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// The tournaments are made by the tournament itself, and kept by the Postgres
// store with the read model in front of it, as the application keeps them: so
// what the read model is given is what the application would give it, and not
// events made up here to look like it.

interface Scenario {
  readonly readModel: TournamentsByAccount;
  readonly store: PostgresEventStore;
  readonly tournaments: AggregateRepository<Tournament, TournamentId>;
  // An account for each address the scenario names, made the first time it is
  // named. The read model knows accounts by their ids and nothing else.
  readonly accounts: Map<string, AccountId>;
  // What each tournament is to be when it is created, by name, and each
  // tournament created, by the name it has now.
  readonly toBe: Map<string, TournamentRequest & { website: string }>;
  readonly byName: Map<string, TournamentId>;
  found: readonly TournamentOfAccount[];
  years: readonly number[];
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  const scenario = scenarios.get(world);
  assert.ok(scenario !== undefined, "The read model is not stood up.");
  return scenario;
};

// Every change is made at the same moment: when is not what any of these
// scenarios are about.
const at = ReadOnlyDate.from(new Date("2026-09-26T10:00:00Z"));

const accountFor = (world: SpecWorld, address: string): AccountId => {
  const { accounts } = scenarioOf(world);
  let account = accounts.get(address);
  if (account === undefined) {
    account = AccountId.create();
    accounts.set(address, account);
  }
  return account;
};

const tournamentNamed = (world: SpecWorld, name: string): TournamentId => {
  const id = scenarioOf(world).byName.get(name);
  assert.ok(id !== undefined, `No tournament called ${name} was created.`);
  return id;
};

Given("the tournaments by account read model", function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  this.asARequest = (work) => unitOfWork.inTransaction(work);
  const readModel = new TournamentsByAccount(unitOfWork);
  const store = new PostgresEventStore(
    unitOfWork,
    nameTournamentEvents(new EventRegistry()),
  );
  const tournaments = new AggregateRepository(
    new ProjectingEventStore(store, [readModel]),
    (id: TournamentId, events) => Tournament.rebuiltFrom(id, events),
  );
  scenarios.set(this, {
    readModel,
    store,
    tournaments,
    accounts: new Map(),
    toBe: new Map(),
    byName: new Map(),
    found: [],
    years: [],
  });
  rebuildsWith(this, () =>
    this.asARequest(async () => readModel.rebuildFrom(await store.readAll())),
  );
});

// What a tournament is to be -------------------------------------------------------

// A tournament of one day on Croquet Scores unless the scenario says otherwise.
Given(
  "a tournament {string} to start on {string}",
  function (this: SpecWorld, name: string, day: string) {
    const starts = `${day}T00:00:00Z`;
    scenarioOf(this).toBe.set(name, {
      name,
      starts,
      finishes: starts,
      format: "Standard",
      sport: "ac",
      country: "au",
      region: "vic",
      website: "croquetscores.com",
    });
  },
);

const toBe = (
  world: SpecWorld,
  name: string,
): TournamentRequest & { website: string } => {
  const found = scenarioOf(world).toBe.get(name);
  assert.ok(found !== undefined, `Nothing says what ${name} is to be.`);
  return found;
};

Given(
  "{string} to finish on {string}",
  function (this: SpecWorld, name: string, day: string) {
    scenarioOf(this).toBe.set(name, {
      ...toBe(this, name),
      finishes: `${day}T00:00:00Z`,
    });
  },
);

// In the first sport the website offers, since a tournament on Gateball Scores
// is a game of gateball whatever else it is.
Given(
  "{string} to be on the website {string}",
  function (this: SpecWorld, name: string, website: string) {
    scenarioOf(this).toBe.set(name, {
      ...toBe(this, name),
      website,
      sport: Website.from(website).site === "gateballScores" ? "gb" : "ac",
    });
  },
);

Given(
  "{string} to be for the sport {string}",
  function (this: SpecWorld, name: string, sport: string) {
    scenarioOf(this).toBe.set(name, { ...toBe(this, name), sport });
  },
);

// What is done to it ------------------------------------------------------------------

Given(
  "{string} is created by the account for {string}",
  async function (this: SpecWorld, name: string, address: string) {
    const scenario = scenarioOf(this);
    const { website, ...request } = toBe(this, name);
    const id = TournamentId.create();
    const tournament = Tournament.create(
      id,
      Website.from(website),
      detailsFrom(request),
      () => false,
      accountFor(this, address),
      at,
    );
    await this.asARequest(() => scenario.tournaments.save(tournament));
    scenario.byName.set(name, id);
  },
);

// Done to the tournament `name` by whoever created it, who manages it.
const doneTo = async (
  world: SpecWorld,
  name: string,
  doing: (tournament: Tournament, by: AccountId) => void,
): Promise<void> => {
  const { tournaments } = scenarioOf(world);
  const id = tournamentNamed(world, name);
  await world.asARequest(async () => {
    const tournament = await tournaments.load(id);
    assert.ok(tournament !== undefined, `${name} has no events.`);
    const creator = tournament.managers[0];
    assert.ok(creator !== undefined, `${name} has no manager.`);
    doing(tournament, creator);
    await tournaments.save(tournament);
  });
};

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

// Everything the tournament is, said again with `changed`, as updating one
// says everything it is.
const updated = async (
  world: SpecWorld,
  name: string,
  changed: Partial<TournamentRequest>,
): Promise<void> => {
  await doneTo(world, name, (tournament, by) => {
    tournament.update(
      detailsFrom({
        name: tournament.name.toString(),
        starts: tournament.starts.toISOString(),
        finishes: tournament.finishes.toISOString(),
        format: tournament.format.name,
        sport: tournament.sport.code,
        country: tournament.country.code,
        region: tournament.region.code,
        handicap: tournament.handicap,
        worldRankings: tournament.worldRankings,
        national: tournament.national,
        international: tournament.international,
        ...changed,
      }),
      () => false,
      by,
      at,
    );
  });
};

Given(
  "{string} is renamed {string}",
  async function (this: SpecWorld, name: string, renamed: string) {
    await updated(this, name, { name: renamed });
    const { byName } = scenarioOf(this);
    byName.set(renamed, tournamentNamed(this, name));
  },
);

Given(
  "{string} is updated to start on {string}",
  async function (this: SpecWorld, name: string, day: string) {
    // Its finish moved along with it where the new start is after it, since
    // a tournament cannot finish before it starts, and what finish it has is
    // not what these scenarios are about.
    const starts = new Date(`${day}T00:00:00Z`);
    const { tournaments } = scenarioOf(this);
    const tournament = await this.asARequest(() =>
      tournaments.load(tournamentNamed(this, name)),
    );
    const finishes = tournament?.finishes.toDate() ?? starts;
    await updated(this, name, {
      starts: starts.toISOString(),
      finishes: (finishes < starts ? starts : finishes).toISOString(),
    });
  },
);

Given("{string} is archived", async function (this: SpecWorld, name: string) {
  await doneTo(this, name, (tournament, by) => {
    tournament.archive(by, at);
  });
});

Given("{string} is restored", async function (this: SpecWorld, name: string) {
  await doneTo(this, name, (tournament, by) => {
    tournament.restore(by, at);
  });
});

// Every event of the one tournament the scenario made, from its first, as
// rebuilding would give them.
When("its events are projected again", async function (this: SpecWorld) {
  const { byName, readModel, store } = scenarioOf(this);
  const [id] = new Set(byName.values());
  assert.ok(id !== undefined, "No tournament was created.");
  await this.asARequest(async () =>
    readModel.project(id, 1, await store.getEvents(id)),
  );
});

// Looking ------------------------------------------------------------------------------

const lookFor = async (
  world: SpecWorld,
  address: string,
  website: string,
  year: number,
): Promise<void> => {
  const scenario = scenarioOf(world);
  scenario.found = await world.asARequest(() =>
    scenario.readModel.tournamentsOf(
      accountFor(world, address),
      Website.from(website),
      year,
    ),
  );
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
    scenario.readModel.yearsOf(
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

const foundCalled = (world: SpecWorld, name: string): TournamentOfAccount => {
  const found = scenarioOf(world).found.filter((each) => each.name === name);
  assert.equal(found.length, 1, `${String(found.length)} are called ${name}.`);
  return found[0]!;
};

Then("{string} is found", function (this: SpecWorld, name: string) {
  foundCalled(this, name);
});

Then("{string} is not found", function (this: SpecWorld, name: string) {
  assert.ok(
    !scenarioOf(this).found.some((each) => each.name === name),
    `${name} is found.`,
  );
});

Then(
  /^(\d+) tournaments? (?:is|are) found$/,
  function (this: SpecWorld, count: string) {
    assert.equal(scenarioOf(this).found.length, Number(count));
  },
);

Then(
  "{string} is held as one it manages",
  function (this: SpecWorld, name: string) {
    assert.equal(foundCalled(this, name).part, "manager");
  },
);

Then(
  "{string} is held as one it scores",
  function (this: SpecWorld, name: string) {
    assert.equal(foundCalled(this, name).part, "scorer");
  },
);

Then(
  "{string} is held as starting on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(foundCalled(this, name).starts, day);
  },
);

Then(
  "{string} is held as finishing on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(foundCalled(this, name).finishes, day);
  },
);

Then(
  "{string} is held at the address {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(foundCalled(this, name).address, address);
  },
);

Then("{string} is held as archived", function (this: SpecWorld, name: string) {
  assert.equal(foundCalled(this, name).archived, true);
});

Then(
  "{string} is held as not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(foundCalled(this, name).archived, false);
  },
);

Then(
  /^the (first|second) year is (\d+)$/,
  function (this: SpecWorld, which: string, year: string) {
    const at = ["first", "second"].indexOf(which);
    assert.equal(scenarioOf(this).years[at], Number(year));
  },
);

Then(
  /^(\d+) years? (?:is|are) found$/,
  function (this: SpecWorld, count: string) {
    assert.equal(scenarioOf(this).years.length, Number(count));
  },
);

Then("no year is found", function (this: SpecWorld) {
  assert.deepEqual(scenarioOf(this).years, []);
});
