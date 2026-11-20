import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type {
  PeopleOfTournament,
  TournamentOfPage,
} from "../../../../src/application/operations/tournaments/tournamentPages.js";
import type { CompetitionOfApps } from "../../../../src/application/operations/tournaments/tournamentContents.js";
import type { TournamentForAppsRead } from "../../../../src/application/operations/tournaments/TournamentForApps.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { TournamentPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { TeamDetails } from "../../../../src/domain/aggregates/tournaments/Team.js";
import type { TeamPlayerDetails } from "../../../../src/domain/aggregates/tournaments/TeamPlayer.js";
import type { TournamentPlayerDetails } from "../../../../src/domain/aggregates/tournaments/TournamentPlayer.js";
import { BestOf } from "../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { ExpectedMatches } from "../../../../src/domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { KnockoutDraw } from "../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { Rounds } from "../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { TournamentContents } from "../../../../src/infrastructure/read-models/TournamentContents.js";
import { TournamentPages } from "../../../../src/infrastructure/read-models/TournamentPages.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  at,
  doneTo,
  scenarioOf,
  standUp,
  tournamentNamed,
  update,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What a tournament is, what is done to it and what is found of it are said in
// the words every read model of tournaments shares
// (specs/infrastructure/support/tournamentReadModels.ts). What is here is its
// players, its teams and its competitions, and what the API is told of them.

interface Scenario {
  // Each thing by its name and where it is, written "Sam Someone of Spring
  // Open", so that two tournaments can each have one, with what it was last
  // said to be, since an update says everything it is again.
  readonly players: Map<
    string,
    { id: TournamentPlayerId; details: TournamentPlayerDetails }
  >;
  readonly teams: Map<string, { id: TeamId; details: TeamDetails }>;
  readonly teamPlayers: Map<
    string,
    { team: TeamId; id: TeamPlayerId; details: TeamPlayerDetails }
  >;
  readonly competitions: Map<string, CompetitionId>;
  tournament: TournamentForAppsRead | undefined;
  competition: CompetitionOfApps | undefined;
  // What the players' pages are told, which is asked of the same tables.
  people: PeopleOfTournament | undefined;
  page: TournamentOfPage | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const ownScenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      players: new Map(),
      teams: new Map(),
      teamPlayers: new Map(),
      competitions: new Map(),
      tournament: undefined,
      competition: undefined,
      people: undefined,
      page: undefined,
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

const readModelOf = (world: SpecWorld): TournamentContents => {
  const { readModel } = scenarioOf(world);
  assert.ok(readModel instanceof TournamentContents);
  return readModel;
};

const found = <T>(map: Map<string, T>, key: string): T => {
  const one = map.get(key);
  assert.ok(one !== undefined, `Nothing was made called ${key}.`);
  return one;
};

Given("the tournament contents read model", function (this: SpecWorld) {
  standUp(this, new TournamentContents(unitOfWorkOf(this)), {
    country: "au",
    region: "vic",
  });
});

Given(
  "{string} is played by teams",
  async function (this: SpecWorld, tournament: string) {
    await doneTo(this, tournament, (each, by) => {
      update(each, { format: "Teams" }, by);
    });
  },
);

// Its players --------------------------------------------------------------------------

Given(
  /^the player "([^"]*)" is added to "([^"]*)"(?: with the (world ranking name|handicap) "([^"]*)"| representing "([^"]*)")?$/,
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    which: string | undefined,
    value: string | undefined,
    representing: string | undefined,
  ) {
    const id = TournamentPlayerId.create();
    const details: TournamentPlayerDetails = {
      name,
      ...(which === "world ranking name" ? { worldRankingName: value } : {}),
      ...(which === "handicap" ? { handicap: value } : {}),
      ...(representing === undefined ? {} : { representing }),
    };
    ownScenarioOf(this).players.set(`${name} of ${tournament}`, {
      id,
      details,
    });
    await doneTo(this, tournament, (each, by) => {
      each.addPlayer(id, details, by, at);
    });
  },
);

const changePlayer = async (
  world: SpecWorld,
  name: string,
  tournament: string,
  changed: Partial<TournamentPlayerDetails>,
): Promise<void> => {
  const own = ownScenarioOf(world).players;
  const player = found(own, `${name} of ${tournament}`);
  const details = { ...player.details, ...changed };
  own.set(`${name} of ${tournament}`, { id: player.id, details });
  if (changed.name !== undefined) {
    own.set(`${changed.name} of ${tournament}`, { id: player.id, details });
  }
  await doneTo(world, tournament, (each, by) => {
    each.updatePlayer(player.id, details, by, at);
  });
};

Given(
  "the player {string} of {string} is renamed {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    renamed: string,
  ) {
    await changePlayer(this, name, tournament, { name: renamed });
  },
);

Given(
  "the player {string} of {string} is given the world ranking name {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    worldRankingName: string,
  ) {
    await changePlayer(this, name, tournament, { worldRankingName });
  },
);

Given(
  "the player {string} of {string} is given the handicap {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    handicap: string,
  ) {
    await changePlayer(this, name, tournament, { handicap });
  },
);

Given(
  "the player {string} of {string} is made to represent {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    representing: string,
  ) {
    await changePlayer(this, name, tournament, { representing });
  },
);

Given(
  /^the player "([^"]*)" of "([^"]*)" is (archived|restored)$/,
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    what: string,
  ) {
    const { id } = found(
      ownScenarioOf(this).players,
      `${name} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      if (what === "archived") each.archivePlayer(id, false, by, at);
      else each.restorePlayer(id, by, at);
    });
  },
);

// Its teams and their players ---------------------------------------------------------

Given(
  "the team {string} is added to {string} with the short name {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    shortName: string,
  ) {
    const id = TeamId.create();
    const details = { name, shortName };
    ownScenarioOf(this).teams.set(`${name} of ${tournament}`, { id, details });
    await doneTo(this, tournament, (each, by) => {
      each.addTeam(id, details, by, at);
    });
  },
);

const changeTeam = async (
  world: SpecWorld,
  name: string,
  tournament: string,
  changed: Partial<TeamDetails>,
): Promise<void> => {
  const own = ownScenarioOf(world).teams;
  const team = found(own, `${name} of ${tournament}`);
  const details = { ...team.details, ...changed };
  own.set(`${name} of ${tournament}`, { id: team.id, details });
  await doneTo(world, tournament, (each, by) => {
    each.updateTeam(team.id, details, by, at);
  });
};

Given(
  "the team {string} of {string} is renamed {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    renamed: string,
  ) {
    await changeTeam(this, name, tournament, { name: renamed });
  },
);

Given(
  "the team {string} of {string} is given the short name {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    shortName: string,
  ) {
    await changeTeam(this, name, tournament, { shortName });
  },
);

Given(
  /^the team "([^"]*)" of "([^"]*)" is (archived|restored|moved up)$/,
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    what: string,
  ) {
    const { id } = found(ownScenarioOf(this).teams, `${name} of ${tournament}`);
    await doneTo(this, tournament, (each, by) => {
      if (what === "archived") each.archiveTeam(id, by, at);
      else if (what === "restored") each.restoreTeam(id, by, at);
      else each.moveTeam(id, "up", by, at);
    });
  },
);

Given(
  "the player {string} is added to the team {string} of {string}",
  async function (
    this: SpecWorld,
    name: string,
    team: string,
    tournament: string,
  ) {
    const own = found(ownScenarioOf(this).teams, `${team} of ${tournament}`);
    const id = TeamPlayerId.create();
    const details = { name };
    ownScenarioOf(this).teamPlayers.set(`${name} of ${team} of ${tournament}`, {
      team: own.id,
      id,
      details,
    });
    await doneTo(this, tournament, (each, by) => {
      each.addTeamPlayer(own.id, id, details, by, at);
    });
  },
);

Given(
  "the player {string} of the team {string} of {string} is renamed {string}",
  async function (
    this: SpecWorld,
    name: string,
    team: string,
    tournament: string,
    renamed: string,
  ) {
    const player = found(
      ownScenarioOf(this).teamPlayers,
      `${name} of ${team} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      each.updateTeamPlayer(
        player.team,
        player.id,
        { ...player.details, name: renamed },
        by,
        at,
      );
    });
  },
);

Given(
  /^the player "([^"]*)" of the team "([^"]*)" of "([^"]*)" is (archived|restored)$/,
  async function (
    this: SpecWorld,
    name: string,
    team: string,
    tournament: string,
    what: string,
  ) {
    const player = found(
      ownScenarioOf(this).teamPlayers,
      `${name} of ${team} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      if (what === "archived") {
        each.archiveTeamPlayer(player.team, player.id, false, by, at);
      } else each.restoreTeamPlayer(player.team, player.id, by, at);
    });
  },
);

// Its competitions ---------------------------------------------------------------------

Given(
  /^a (block|Swiss|knockout) called "([^"]*)" is added( again)? to "([^"]*)"$/,
  async function (
    this: SpecWorld,
    kind: string,
    name: string,
    _again: string | undefined,
    tournament: string,
  ) {
    const id = CompetitionId.create();
    ownScenarioOf(this).competitions.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      const called = CompetitionName.from(name);
      if (kind === "block") {
        each.addBlock(id, called, BestOf.from(1), Rounds.from(1), by, at);
      } else if (kind === "Swiss") {
        each.addSwiss(id, called, BestOf.from(1), by, at);
      } else {
        each.addKnockout(id, called, KnockoutDraw.from(2, [1]), by, at);
      }
    });
  },
);

Given(
  "the test between {string} and {string} is added to {string}",
  async function (
    this: SpecWorld,
    first: string,
    second: string,
    tournament: string,
  ) {
    const own = ownScenarioOf(this);
    const one = found(own.teams, `${first} of ${tournament}`);
    const other = found(own.teams, `${second} of ${tournament}`);
    const id = CompetitionId.create();
    own.competitions.set(
      `${one.details.shortName} v ${other.details.shortName} of ${tournament}`,
      id,
    );
    await doneTo(this, tournament, (each, by) => {
      each.addTest(
        id,
        {
          firstTeam: one.id,
          secondTeam: other.id,
          starts: each.starts,
          finishes: each.finishes,
          expectedMatches: ExpectedMatches.from(10),
          bestOf: BestOf.from(1),
        },
        by,
        at,
      );
    });
  },
);

Given(
  "the block {string} of {string} is renamed {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    renamed: string,
  ) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${name} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      each.updateBlock(
        id,
        CompetitionName.from(renamed),
        BestOf.from(1),
        Rounds.from(1),
        false,
        by,
        at,
      );
    });
  },
);

Given(
  /^the (block|test) "([^"]*)" is (archived|restored|moved up) in "([^"]*)"$/,
  async function (
    this: SpecWorld,
    _kind: string,
    name: string,
    what: string,
    tournament: string,
  ) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${name} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      if (what === "archived") each.archiveCompetition(id, by, at);
      else if (what === "restored") each.restoreCompetition(id, by, at);
      else each.moveCompetition(id, "up", by, at);
    });
  },
);

// What the API is told ----------------------------------------------------------------

const itsWebsite = "croquetscores.com";

When(
  /^"([^"]*)" is read for an app(?: on the website "([^"]*)")?$/,
  async function (
    this: SpecWorld,
    tournament: string,
    website: string | undefined,
  ) {
    const id = tournamentNamed(this, tournament).value;
    await this.asARequest(async () => {
      ownScenarioOf(this).tournament = await readModelOf(this).tournament(
        website ?? itsWebsite,
        id,
      );
    });
  },
);

When(
  "a tournament there is not is read for an app",
  async function (this: SpecWorld) {
    await this.asARequest(async () => {
      ownScenarioOf(this).tournament = await readModelOf(this).tournament(
        itsWebsite,
        "tournament/there-is-not",
      );
    });
  },
);

When(
  /^the competition "([^"]*)" of "([^"]*)" is read for an app(?: as one of "([^"]*)")?$/,
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    asOneOf: string | undefined,
  ) {
    const competition = found(
      ownScenarioOf(this).competitions,
      `${name} of ${tournament}`,
    ).value;
    const of = tournamentNamed(this, asOneOf ?? tournament).value;
    await this.asARequest(async () => {
      ownScenarioOf(this).competition = await readModelOf(this).competition(
        itsWebsite,
        of,
        competition,
      );
    });
  },
);

When(
  "a competition of a tournament there is not is read for an app",
  async function (this: SpecWorld) {
    await this.asARequest(async () => {
      ownScenarioOf(this).competition = await readModelOf(this).competition(
        itsWebsite,
        "tournament/there-is-not",
        "competition/there-is-not",
      );
    });
  },
);

const read = (world: SpecWorld): TournamentForAppsRead => {
  const { tournament } = ownScenarioOf(world);
  assert.ok(tournament !== undefined, "No tournament was read.");
  return tournament;
};

const quoted = (said: string): string[] =>
  [...said.matchAll(/"([^"]*)"/g)].map((each) => each[1]!);

Then("no tournament is read", function (this: SpecWorld) {
  assert.equal(ownScenarioOf(this).tournament, undefined);
});

Then(/^the players read are (.+)$/, function (this: SpecWorld, said: string) {
  assert.deepEqual(
    read(this).players.map((each) => each.name),
    quoted(said),
  );
});

Then("no players are read", function (this: SpecWorld) {
  assert.deepEqual(read(this).players, []);
});

const playerRead = (world: SpecWorld, name: string) => {
  const player = read(world).players.find((each) => each.name === name);
  assert.ok(player !== undefined, `${name} was not read.`);
  return player;
};

Then(
  "the player {string} is read with the world ranking name {string}",
  function (this: SpecWorld, name: string, said: string) {
    assert.equal(playerRead(this, name).worldRankingName, said);
  },
);

Then(
  "the player {string} is read with the handicap {string}",
  function (this: SpecWorld, name: string, said: string) {
    assert.equal(playerRead(this, name).handicap, said);
  },
);

Then(
  "the player {string} is read with no handicap",
  function (this: SpecWorld, name: string) {
    assert.equal(playerRead(this, name).handicap, undefined);
  },
);

Then(
  "the player {string} is read representing {string}",
  function (this: SpecWorld, name: string, said: string) {
    assert.equal(playerRead(this, name).representing, said);
  },
);

Then(/^the teams read are (.+)$/, function (this: SpecWorld, said: string) {
  assert.deepEqual(
    read(this).teams.map((each) => each.name),
    quoted(said),
  );
});

const teamRead = (world: SpecWorld, name: string) => {
  const team = read(world).teams.find((each) => each.name === name);
  assert.ok(team !== undefined, `${name} was not read.`);
  return team;
};

Then(
  "the team {string} is read with the short name {string}",
  function (this: SpecWorld, name: string, said: string) {
    assert.equal(teamRead(this, name).shortName, said);
  },
);

Then(
  /^the team "([^"]*)" is read with the players (.+)$/,
  function (this: SpecWorld, name: string, said: string) {
    assert.deepEqual(
      teamRead(this, name).players.map((each) => each.name),
      quoted(said),
    );
  },
);

Then(
  "the team {string} is read with no players",
  function (this: SpecWorld, name: string) {
    assert.deepEqual(teamRead(this, name).players, []);
  },
);

Then(
  "the player {string} of the team {string} is read with the world ranking name {string}",
  function (this: SpecWorld, name: string, team: string, said: string) {
    const player = teamRead(this, team).players.find(
      (each) => each.name === name,
    );
    assert.ok(player !== undefined, `${name} was not read.`);
    assert.equal(player.worldRankingName, said);
  },
);

Then(
  /^the competitions read are (.+)$/,
  function (this: SpecWorld, said: string) {
    assert.deepEqual(
      read(this).competitions.map((each) => each.name),
      quoted(said),
    );
  },
);

Then("no competitions are read", function (this: SpecWorld) {
  assert.deepEqual(read(this).competitions, []);
});

const competitionRead = (world: SpecWorld, name: string) => {
  const competition = read(world).competitions.find(
    (each) => each.name === name,
  );
  assert.ok(competition !== undefined, `${name} was not read.`);
  return competition;
};

Then(
  /^the competition "([^"]*)" is read as an? (block|swiss|knockout|test)$/,
  function (this: SpecWorld, name: string, kind: string) {
    assert.equal(competitionRead(this, name).kind, kind);
  },
);

Then(
  "the competition {string} is read at the address {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(competitionRead(this, name).address, address);
  },
);

Then("the competition is found", function (this: SpecWorld) {
  assert.equal(ownScenarioOf(this).competition?.found, "competition");
});

Then("no competition is found", function (this: SpecWorld) {
  assert.equal(ownScenarioOf(this).competition?.found, "no competition");
});

Then("no tournament is found", function (this: SpecWorld) {
  assert.equal(ownScenarioOf(this).competition?.found, "no tournament");
});

// What the players' pages are told ------------------------------------------------------

When(
  "the people of {string} are read back for its pages",
  async function (this: SpecWorld, tournament: string) {
    const id = tournamentNamed(this, tournament).value;
    const pages = new TournamentPages(unitOfWorkOf(this));
    // A refusal is what some scenarios are about, so it is kept to be asked of.
    try {
      await this.asARequest(async () => {
        const scenario = ownScenarioOf(this);
        scenario.people = await pages.peopleOf(id);
        scenario.page = await pages.tournament(id);
      });
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Given(
  "the slug kept for {string} of {string} is lost",
  async function (this: SpecWorld, name: string, tournament: string) {
    const player = found(
      ownScenarioOf(this).players,
      `${name} of ${tournament}`,
    );
    await this.asARequest(async () => {
      await unitOfWorkOf(this)
        .connection()
        .query(
          `update tournament_players set slug = null where player_id = $1`,
          [player.id.value],
        );
    });
  },
);

Then(
  "the player {string} is read with no slug",
  function (this: SpecWorld, name: string) {
    const player = peopleRead(this).players.find((each) => each.name === name);
    assert.ok(player !== undefined, `${name} was not read.`);
    assert.equal(player.slug, undefined);
  },
);

Then("the people are not read back", function (this: SpecWorld) {
  assert.equal(ownScenarioOf(this).people, undefined);
  assert.ok(this.failure !== undefined, "Reading them back did not fail.");
});

const peopleRead = (world: SpecWorld): PeopleOfTournament => {
  const { people } = ownScenarioOf(world);
  assert.ok(people !== undefined, "Nobody was read back.");
  return people;
};

Then(
  "the player {string} of the team {string} is read with the slug {string}",
  function (this: SpecWorld, name: string, team: string, slug: string) {
    const player = peopleRead(this)
      .teams.find((each) => each.name === team)
      ?.players.find((each) => each.name === name);
    assert.ok(player !== undefined, `${name} was not read.`);
    assert.equal(player.slug, slug);
  },
);

Then(
  "the player {string} of the team {string} is read as archived",
  function (this: SpecWorld, name: string, team: string) {
    const player = peopleRead(this)
      .teams.find((each) => each.name === team)
      ?.players.find((each) => each.name === name);
    assert.ok(player !== undefined, `${name} was not read.`);
    assert.equal(player.archived, true);
  },
);

Then(
  "the player {string} is read as archived",
  function (this: SpecWorld, name: string) {
    const player = peopleRead(this).players.find((each) => each.name === name);
    assert.ok(player !== undefined, `${name} was not read.`);
    assert.equal(player.archived, true);
  },
);
