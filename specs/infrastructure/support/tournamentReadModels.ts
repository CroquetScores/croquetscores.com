// What the read models of tournaments share: making the tournaments a scenario
// names, and keeping them with the scenario's read model in front of the store,
// and the words for what is found of them. One read model is stood up in a
// scenario, and says here which, with the country and the region a tournament
// is played in where a scenario says nothing.
//
// Here rather than beside one read model's steps because two read models say
// the same words of a tournament, and two definitions of the same words leave
// Cucumber unable to choose between them.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AggregateRepository } from "../../../src/application/common/AggregateRepository.js";
import type { Projection } from "../../../src/application/common/Projection.js";
import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import {
  detailsFrom,
  type TournamentRequest,
} from "../../../src/application/operations/tournaments/tournamentOperations.js";
import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { Competition } from "../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import { nameCompetitionEvents } from "../../../src/domain/aggregates/tournaments/competitions/events/competitionEvents.js";
import { nameTournamentEvents } from "../../../src/domain/aggregates/tournaments/events/tournamentEvents.js";
import type { CompetitionId } from "../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TournamentId } from "../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import { EventRegistry } from "../../../src/domain/common/EventRegistry.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { Website } from "../../../src/domain/common/Website.js";
import {
  PostgresEventStore,
  type StoredEvent,
} from "../../../src/infrastructure/event-store/PostgresEventStore.js";
import type { SpecWorld } from "../../support/world.js";
import { rebuildsWith } from "./projections.js";
import { rebuildFromEvents, type Rebuildable } from "./rebuild.js";
import { unitOfWorkOf } from "./transactions.js";

/** What every read model of tournaments finds of one. */
export interface Found {
  readonly name: string;
  /** Each a day, written as the year, the month and the day. */
  readonly starts: string;
  readonly finishes: string;
  readonly address: string;
  /** The code of the country it is played in, where the read model holds it. */
  readonly country?: string | undefined;
  /** The code of the region of it, where it is in one. */
  readonly region?: string | undefined;
  /** Whether its organiser ticked national or international, where the read model holds them. */
  readonly national?: boolean | undefined;
  readonly international?: boolean | undefined;
}

/** A read model of tournaments, as its scenarios stand it up. */
export interface TournamentReadModel extends Projection, Rebuildable {}

/** What a tournament is to be when it is created, as it is asked for. */
export type ToBe = TournamentRequest & { readonly website: string };

interface Scenario {
  readonly readModel: TournamentReadModel;
  readonly store: PostgresEventStore;
  readonly tournaments: AggregateRepository<Tournament, TournamentId>;
  readonly competitions: AggregateRepository<Competition, CompetitionId>;
  // Where a scenario names neither, which differs by read model, since each
  // feature says its own.
  readonly country: string;
  readonly region: string;
  // An account for each address the scenario names, made the first time it is
  // named. The read models know accounts by their ids and nothing else.
  readonly accounts: Map<string, AccountId>;
  // What each tournament is to be when it is created, by name, and each
  // tournament created, by the name it has now.
  readonly toBe: Map<string, ToBe>;
  readonly byName: Map<string, TournamentId>;
  found: readonly Found[];
  years: readonly number[];
  // Whether a rebuild is to be given every competition's stream before any
  // tournament's, rather than in the order reading them back gives.
  competitionsFirst: boolean;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

/** The read model of tournaments the scenario stood up, and what it made. */
export const scenarioOf = (world: SpecWorld): Scenario => {
  const scenario = scenarios.get(world);
  assert.ok(
    scenario !== undefined,
    "No read model of tournaments is stood up.",
  );
  return scenario;
};

/**
 * Stands `readModel` up in front of the Postgres store, as the application
 * keeps tournaments and their competitions, a tournament being played in the
 * region `region` of the country `country` unless the scenario says otherwise.
 * The tournaments are made by the tournament itself, so what the read model
 * is given is what the application would give it, and not events made up to
 * look like it.
 */
export const standUp = (
  world: SpecWorld,
  readModel: TournamentReadModel,
  { country, region }: { readonly country: string; readonly region: string },
): void => {
  const unitOfWork = unitOfWorkOf(world);
  world.asARequest = (work) => unitOfWork.inTransaction(work);
  const store = new PostgresEventStore(
    unitOfWork,
    nameCompetitionEvents(nameTournamentEvents(new EventRegistry())),
  );
  const projecting = new ProjectingEventStore(store, [readModel]);
  const scenario: Scenario = {
    readModel,
    store,
    tournaments: new AggregateRepository(projecting, (id, events) =>
      Tournament.rebuiltFrom(id, events),
    ),
    competitions: new AggregateRepository(projecting, (id, events) =>
      Competition.rebuiltFrom(id, events),
    ),
    country,
    region,
    accounts: new Map(),
    toBe: new Map(),
    byName: new Map(),
    found: [],
    years: [],
    competitionsFirst: false,
  };
  scenarios.set(world, scenario);
  rebuildsWith(world, () =>
    world.asARequest(async () => {
      const events = await store.readAll();
      const isTournaments = ({ stream }: StoredEvent): boolean =>
        stream.startsWith("tournament/");
      await rebuildFromEvents(
        readModel,
        scenario.competitionsFirst
          ? [
              ...events.filter((each) => !isTournaments(each)),
              ...events.filter(isTournaments),
            ]
          : events,
      );
    }),
  );
};

// Every change is made at the same moment, unless a scenario says when: when
// is not what most of these scenarios are about.
export const at = ReadOnlyDate.from(new Date("2026-09-26T10:00:00Z"));

export const accountFor = (world: SpecWorld, address: string): AccountId => {
  const { accounts } = scenarioOf(world);
  let account = accounts.get(address);
  if (account === undefined) {
    account = AccountId.create();
    accounts.set(address, account);
  }
  return account;
};

export const tournamentNamed = (
  world: SpecWorld,
  name: string,
): TournamentId => {
  const id = scenarioOf(world).byName.get(name);
  assert.ok(id !== undefined, `No tournament called ${name} was created.`);
  return id;
};

// What a tournament is to be -------------------------------------------------------

// A tournament of one day on Croquet Scores unless the scenario says otherwise.
Given(
  "a tournament {string} to start on {string}",
  function (this: SpecWorld, name: string, day: string) {
    const { toBe, country, region } = scenarioOf(this);
    const starts = `${day}T00:00:00Z`;
    toBe.set(name, {
      name,
      starts,
      finishes: starts,
      format: "Standard",
      sport: "ac",
      country,
      region,
      website: "croquetscores.com",
    });
  },
);

export const toBeOf = (world: SpecWorld, name: string): ToBe => {
  const found = scenarioOf(world).toBe.get(name);
  assert.ok(found !== undefined, `Nothing says what ${name} is to be.`);
  return found;
};

/** Says `name` is to be as `changed` says, and otherwise as it was to be. */
export const toBeChanged = (
  world: SpecWorld,
  name: string,
  changed: Partial<ToBe>,
): void => {
  scenarioOf(world).toBe.set(name, { ...toBeOf(world, name), ...changed });
};

Given(
  "{string} to finish on {string}",
  function (this: SpecWorld, name: string, day: string) {
    toBeChanged(this, name, { finishes: `${day}T00:00:00Z` });
  },
);

// In the first sport the website offers, since a tournament on Gateball Scores
// is a game of gateball whatever else it is.
Given(
  "{string} to be on the website {string}",
  function (this: SpecWorld, name: string, website: string) {
    toBeChanged(this, name, {
      website,
      sport: Website.from(website).site === "gateballScores" ? "gb" : "ac",
    });
  },
);

Given(
  "{string} to be for the sport {string}",
  function (this: SpecWorld, name: string, sport: string) {
    toBeChanged(this, name, { sport });
  },
);

Given(
  "{string} to be played in the country {string}",
  function (this: SpecWorld, name: string, country: string) {
    toBeChanged(this, name, { country });
  },
);

Given(
  "{string} to be played in the region {string}",
  function (this: SpecWorld, name: string, region: string) {
    toBeChanged(this, name, { region });
  },
);

Given("{string} to be national", function (this: SpecWorld, name: string) {
  toBeChanged(this, name, { national: true, international: false });
});

Given("{string} to be international", function (this: SpecWorld, name: string) {
  toBeChanged(this, name, { national: false, international: true });
});

Given(
  "{string} to be played in no region",
  function (this: SpecWorld, name: string) {
    toBeChanged(this, name, { region: undefined });
  },
);

// What is done to it ------------------------------------------------------------------

Given(
  "{string} is created by the account for {string}",
  async function (this: SpecWorld, name: string, address: string) {
    const scenario = scenarioOf(this);
    const { website, ...request } = toBeOf(this, name);
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

/** Done to the tournament `name` by whoever created it, who manages it. */
export const doneTo = async (
  world: SpecWorld,
  name: string,
  doing: (tournament: Tournament, by: AccountId) => void | Promise<void>,
): Promise<void> => {
  const { tournaments } = scenarioOf(world);
  const id = tournamentNamed(world, name);
  await world.asARequest(async () => {
    const tournament = await tournaments.load(id);
    assert.ok(tournament !== undefined, `${name} has no events.`);
    const creator = tournament.managers[0];
    assert.ok(creator !== undefined, `${name} has no manager.`);
    await doing(tournament, creator);
    await tournaments.save(tournament);
  });
};

/**
 * Everything `tournament` is, said again with `changed`, as updating one says
 * everything it is.
 */
export const update = (
  tournament: Tournament,
  changed: Partial<TournamentRequest>,
  by: AccountId,
): void => {
  tournament.update(
    detailsFrom({
      name: tournament.name.toString(),
      starts: tournament.starts.toISOString(),
      finishes: tournament.finishes.toISOString(),
      format: tournament.format.name,
      sport: tournament.sport.code,
      country: tournament.country.code,
      region: tournament.region?.code,
      levelTestsDrawn: tournament.levelTestsDrawn,
      national: tournament.national,
      international: tournament.international,
      ...changed,
    }),
    () => false,
    by,
    at,
  );
};

/** The tournament `name` updated to be as `changed` says. */
export const updated = async (
  world: SpecWorld,
  name: string,
  changed: Partial<TournamentRequest>,
): Promise<void> => {
  await doneTo(world, name, (tournament, by) => {
    update(tournament, changed, by);
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

// Everything it is to be but its website, which a tournament keeps as it was
// created, said again as an update says it.
Given(
  "{string} is updated to be national",
  async function (this: SpecWorld, name: string) {
    await updated(this, name, { national: true, international: false });
  },
);

Given(
  "{string} is updated to be international",
  async function (this: SpecWorld, name: string) {
    await updated(this, name, { national: false, international: true });
  },
);

Given(
  "{string} is updated to be as it is to be",
  async function (this: SpecWorld, name: string) {
    const { website, ...request } = toBeOf(this, name);
    void website;
    await updated(this, name, request);
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

Given(
  "the competitions' streams are to be rebuilt before the tournament's",
  function (this: SpecWorld) {
    scenarioOf(this).competitionsFirst = true;
  },
);

// What was found -------------------------------------------------------------------------

/** The one tournament found called `name`, as the read model found it. */
export const foundCalled = <T extends Found>(
  found: readonly T[],
  name: string,
): T => {
  const called = found.filter((each) => each.name === name);
  assert.equal(
    called.length,
    1,
    `${String(called.length)} are called ${name}.`,
  );
  return called[0]!;
};

Then("{string} is found", function (this: SpecWorld, name: string) {
  foundCalled(scenarioOf(this).found, name);
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
  /^the (first|second) tournament found is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    const place = ["first", "second"].indexOf(which);
    assert.equal(scenarioOf(this).found[place]?.name, name);
  },
);

Then(
  "{string} is held as starting on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).starts, day);
  },
);

Then(
  "{string} is held as finishing on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).finishes, day);
  },
);

Then(
  "{string} is held at the address {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).address, address);
  },
);

Then(
  /^the (first|second) year is (\d+)$/,
  function (this: SpecWorld, which: string, year: string) {
    const place = ["first", "second"].indexOf(which);
    assert.equal(scenarioOf(this).years[place], Number(year));
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

Then(
  "{string} is held as played in the country {string}",
  function (this: SpecWorld, name: string, country: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).country, country);
  },
);

Then(
  "{string} is held as played in the region {string}",
  function (this: SpecWorld, name: string, region: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).region, region);
  },
);

Then(
  "{string} is held as played in no region",
  function (this: SpecWorld, name: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).region, undefined);
  },
);

Then("{string} is held as national", function (this: SpecWorld, name: string) {
  assert.equal(foundCalled(scenarioOf(this).found, name).national, true);
});

Then(
  "{string} is not held as national",
  function (this: SpecWorld, name: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).national, false);
  },
);

Then(
  "{string} is held as international",
  function (this: SpecWorld, name: string) {
    assert.equal(foundCalled(scenarioOf(this).found, name).international, true);
  },
);

Then(
  "{string} is not held as international",
  function (this: SpecWorld, name: string) {
    assert.equal(
      foundCalled(scenarioOf(this).found, name).international,
      false,
    );
  },
);
