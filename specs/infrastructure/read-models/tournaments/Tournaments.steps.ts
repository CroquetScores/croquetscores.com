import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { Tournaments } from "../../../../src/infrastructure/read-models/Tournaments.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  at,
  doneTo,
  scenarioOf,
  standUp,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What a tournament is, what is done to it and what is held of it are said in
// the words every read model of tournaments shares
// (specs/infrastructure/support/tournamentReadModels.ts). What is here is the
// facts only these tables hold, its competitions, and reading the tables back.

interface TournamentRow {
  tournament_id: string;
  website: string;
  name: string;
  starts: string;
  finishes: string;
  address: string;
  country: string;
  region: string | null;
  sport: string;
  archived: boolean;
  national: boolean;
  international: boolean;
}

interface CompetitionRow {
  competition_id: string;
  tournament_name: string;
  world_rankings: boolean;
  archived: boolean;
}

interface Scenario {
  // Each competition by its name, which a scenario keeps different from every
  // other's, with the tournament it was added to.
  readonly added: Map<string, { id: CompetitionId; tournament: string }>;
  tournaments: readonly TournamentRow[];
  competitions: readonly CompetitionRow[];
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const ownScenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = { added: new Map(), tournaments: [], competitions: [] };
    scenarios.set(world, scenario);
  }
  return scenario;
};

Given(
  "the tournaments and competitions read model",
  function (this: SpecWorld) {
    standUp(this, new Tournaments(unitOfWorkOf(this)), {
      country: "au",
      region: "vic",
    });
  },
);

// Its competitions ---------------------------------------------------------------------

const competitionNamed = (
  world: SpecWorld,
  competition: string,
  tournament: string,
): CompetitionId => {
  const found = ownScenarioOf(world).added.get(competition);
  assert.ok(
    found?.tournament === tournament,
    `${tournament} has no ${competition}.`,
  );
  return found.id;
};

const addBlock = async (
  world: SpecWorld,
  tournament: string,
  block: string,
  worldRankings: boolean,
): Promise<void> => {
  const id = CompetitionId.create();
  ownScenarioOf(world).added.set(block, { id, tournament });
  await doneTo(world, tournament, (each, by) => {
    each.addBlock(
      id,
      CompetitionName.from(block),
      BestOf.from(1),
      Rounds.from(1),
      by,
      at,
      { worldRankings },
    );
  });
};

const changeBlock = async (
  world: SpecWorld,
  block: string,
  tournament: string,
  worldRankings: boolean,
): Promise<void> => {
  const id = competitionNamed(world, block, tournament);
  await doneTo(world, tournament, (each, by) => {
    each.updateBlock(
      id,
      CompetitionName.from(block),
      BestOf.from(1),
      Rounds.from(1),
      by,
      at,
      { worldRankings },
    );
  });
};

Given(
  "{string} has a competition {string} that counts towards the world rankings",
  async function (this: SpecWorld, tournament: string, competition: string) {
    await addBlock(this, tournament, competition, true);
  },
);

Given(
  "{string} has a competition {string} that does not count towards the world rankings",
  async function (this: SpecWorld, tournament: string, competition: string) {
    await addBlock(this, tournament, competition, false);
  },
);

Given(
  "the competition {string} of {string} is changed to count towards the world rankings",
  async function (this: SpecWorld, competition: string, tournament: string) {
    await changeBlock(this, competition, tournament, true);
  },
);

Given(
  "the competition {string} of {string} is changed not to count towards the world rankings",
  async function (this: SpecWorld, competition: string, tournament: string) {
    await changeBlock(this, competition, tournament, false);
  },
);

Given(
  "{string} has its competition {string} archived",
  async function (this: SpecWorld, tournament: string, competition: string) {
    const id = competitionNamed(this, competition, tournament);
    await doneTo(this, tournament, (each, by) => {
      each.archiveCompetition(id, by, at);
    });
  },
);

Given(
  "{string} has its competition {string} restored",
  async function (this: SpecWorld, tournament: string, competition: string) {
    const id = competitionNamed(this, competition, tournament);
    await doneTo(this, tournament, (each, by) => {
      each.restoreCompetition(id, by, at);
    });
  },
);

// Reading the tables back ----------------------------------------------------------------

When("the tournaments are read back", async function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  // The days as text, since pg makes a date into a moment at midnight
  // wherever the server happens to be, and a day is what is kept.
  const rows = await this.asARequest(async () => {
    const { rows } = await unitOfWork.connection().query<TournamentRow>(
      `select tournament_id, website, name,
              to_char(starts, 'YYYY-MM-DD') as starts,
              to_char(finishes, 'YYYY-MM-DD') as finishes,
              address, country, region, sport, archived, national,
              international
         from tournaments
        order by name`,
    );
    return rows;
  });
  ownScenarioOf(this).tournaments = rows;
  scenarioOf(this).found = rows.map((row) => ({
    name: row.name,
    starts: row.starts,
    finishes: row.finishes,
    address: row.address,
    country: row.country,
    region: row.region ?? undefined,
    national: row.national,
    international: row.international,
  }));
});

When("the competitions are read back", async function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  ownScenarioOf(this).competitions = await this.asARequest(async () => {
    const { rows } = await unitOfWork.connection().query<CompetitionRow>(
      `select c.competition_id, t.name as tournament_name, c.world_rankings,
              c.archived
         from competitions c
         join tournaments t using (tournament_id)
        order by c.competition_id`,
    );
    return rows;
  });
});

// What was held of a tournament ---------------------------------------------------------

const tournamentCalled = (world: SpecWorld, name: string): TournamentRow => {
  const called = ownScenarioOf(world).tournaments.filter(
    (each) => each.name === name,
  );
  assert.equal(
    called.length,
    1,
    `${String(called.length)} are called ${name}.`,
  );
  return called[0]!;
};

Then(
  "{string} is held as for the sport {string}",
  function (this: SpecWorld, name: string, sport: string) {
    assert.equal(tournamentCalled(this, name).sport, sport);
  },
);

Then(
  "{string} is held as on the website {string}",
  function (this: SpecWorld, name: string, website: string) {
    assert.equal(tournamentCalled(this, name).website, website);
  },
);

Then(
  "the tournament {string} is held as archived",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentCalled(this, name).archived, true);
  },
);

Then(
  "the tournament {string} is held as not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentCalled(this, name).archived, false);
  },
);

// What was held of a competition ---------------------------------------------------------

const competitionHeld = (world: SpecWorld, name: string): CompetitionRow => {
  const added = ownScenarioOf(world).added.get(name);
  assert.ok(added !== undefined, `No competition called ${name} was added.`);
  const held = ownScenarioOf(world).competitions.filter(
    (each) => each.competition_id === added.id.value,
  );
  assert.equal(held.length, 1, `${String(held.length)} are called ${name}.`);
  return held[0]!;
};

Then(
  /^(\d+) competitions? (?:is|are) found$/,
  function (this: SpecWorld, count: string) {
    assert.equal(ownScenarioOf(this).competitions.length, Number(count));
  },
);

Then(
  "the competition {string} is held as in {string}",
  function (this: SpecWorld, competition: string, tournament: string) {
    assert.equal(
      competitionHeld(this, competition).tournament_name,
      tournament,
    );
  },
);

Then(
  "the competition {string} is held as archived",
  function (this: SpecWorld, competition: string) {
    assert.equal(competitionHeld(this, competition).archived, true);
  },
);

Then(
  "the competition {string} is held as not archived",
  function (this: SpecWorld, competition: string) {
    assert.equal(competitionHeld(this, competition).archived, false);
  },
);

Then(
  "the competition {string} is held as counting towards the world rankings",
  function (this: SpecWorld, competition: string) {
    assert.equal(competitionHeld(this, competition).world_rankings, true);
  },
);

Then(
  "the competition {string} is held as not counting towards the world rankings",
  function (this: SpecWorld, competition: string) {
    assert.equal(competitionHeld(this, competition).world_rankings, false);
  },
);
