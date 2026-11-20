import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type {
  CompetitionOfPage,
  PlayerOfPage,
  TeamsToStand,
  TournamentOfPage,
} from "../../../../src/application/operations/tournaments/tournamentPages.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { TournamentPages } from "../../../../src/infrastructure/read-models/TournamentPages.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  at,
  doneTo,
  toBeChanged,
  tournamentNamed,
  update,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";
import {
  found,
  ownScenarioOf,
} from "../competition-games/CompetitionGames.steps.js";

// What a tournament, its competitions and their players are, and what is done
// to them, is said in the words the games' read model shares
// (CompetitionGames.steps.ts). What is here is what a page asks of them.

interface Read {
  tournament?: TournamentOfPage | undefined;
  competition?: CompetitionOfPage | undefined;
  asked: boolean;
  players?: readonly PlayerOfPage[];
  teams?: TeamsToStand | undefined;
}

const reads = new WeakMap<SpecWorld, Read>();
const readOf = (world: SpecWorld): Read => {
  let read = reads.get(world);
  if (read === undefined) {
    read = { asked: false };
    reads.set(world, read);
  }
  return read;
};

const pagesOf = (world: SpecWorld): TournamentPages =>
  new TournamentPages(unitOfWorkOf(world));

Given(
  "{string} is subtitled {string}",
  function (this: SpecWorld, name: string, subtitle: string) {
    toBeChanged(this, name, { subtitle });
  },
);

Given(
  "a block named {string} played in {int} rounds is made in {string}",
  async function (
    this: SpecWorld,
    name: string,
    rounds: number,
    tournament: string,
  ) {
    const id = CompetitionId.create();
    ownScenarioOf(this).competitions.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      each.addBlock(
        id,
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(rounds),
        by,
        at,
      );
    });
  },
);

Given(
  "a block named {string} played to {int} hoops is made in {string}",
  async function (
    this: SpecWorld,
    name: string,
    hoops: number,
    tournament: string,
  ) {
    const id = CompetitionId.create();
    ownScenarioOf(this).competitions.set(`${name} of ${tournament}`, id);
    await doneTo(this, tournament, (each, by) => {
      each.addBlock(
        id,
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(1),
        by,
        at,
        { maximumHoops: hoops },
      );
    });
  },
);

Given(
  "the block {string} of {string} is set aside",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${competition} of ${tournament}`,
    );
    await doneTo(this, tournament, (each, by) => {
      each.archiveCompetition(id, by, at);
    });
  },
);

When(
  "the page of {string} is read back",
  async function (this: SpecWorld, name: string) {
    const id = tournamentNamed(this, name).value;
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      readOf(this).tournament = await pages.tournament(id);
    });
  },
);

Given(
  "{string} is to be played by teams",
  function (this: SpecWorld, name: string) {
    toBeChanged(this, name, { format: "Teams" });
  },
);

// As the read models are before they are made again after an upgrade.
Given(
  "the format of {string} is not kept",
  async function (this: SpecWorld, name: string) {
    const id = tournamentNamed(this, name).value;
    await this.asARequest(() =>
      unitOfWorkOf(this)
        .connection()
        .query(
          `update tournaments set format = null where tournament_id = $1`,
          [id],
        ),
    );
  },
);

Given(
  "the level tests of {string} are drawn",
  async function (this: SpecWorld, tournament: string) {
    await doneTo(this, tournament, (each, by) => {
      update(each, { levelTestsDrawn: true }, by);
    });
  },
);

Given(
  "the team {string} of {string} is set aside",
  async function (this: SpecWorld, team: string, tournament: string) {
    await doneTo(this, tournament, (each, by) => {
      const found = each.teams.find((one) => one.name.toString() === team);
      assert.ok(found !== undefined, `${team} is not a team of ${tournament}.`);
      each.archiveTeam(found.id, by, at);
    });
  },
);

When(
  "the teams of {string} are read back to be stood",
  async function (this: SpecWorld, tournament: string) {
    const id = tournamentNamed(this, tournament).value;
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      readOf(this).teams = await pages.teamsToStand(id);
    });
  },
);

When(
  "the competition {string} of {string} is read back",
  async function (this: SpecWorld, slug: string, tournament: string) {
    const id = tournamentNamed(this, tournament).value;
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      const read = readOf(this);
      read.asked = true;
      read.competition = await pages.competition(id, slug);
    });
  },
);

When(
  "the players of {string} of {string} are read back for its page",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = found(
      ownScenarioOf(this).competitions,
      `${competition} of ${tournament}`,
    ).value;
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      readOf(this).players = await pages.playersOf(id);
    });
  },
);

const tournamentRead = (world: SpecWorld): TournamentOfPage => {
  const { tournament } = readOf(world);
  assert.ok(tournament !== undefined, "No tournament was read back.");
  return tournament;
};

const competitionRead = (world: SpecWorld): CompetitionOfPage => {
  const { competition } = readOf(world);
  assert.ok(competition !== undefined, "No competition was found.");
  return competition;
};

const quoted = (said: string): string[] =>
  [...said.matchAll(/"([^"]*)"/g)].map((each) => each[1]!);

Then(
  "the tournament's page is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentRead(this).name, name);
  },
);

Then(
  "the tournament's page has the subtitle {string}",
  function (this: SpecWorld, subtitle: string) {
    assert.equal(tournamentRead(this).subtitle, subtitle);
  },
);

Then("the tournament's page has no subtitle", function (this: SpecWorld) {
  assert.equal(tournamentRead(this).subtitle, undefined);
});

Then(
  "the tournament's page is played in the country {string}",
  function (this: SpecWorld, country: string) {
    assert.equal(tournamentRead(this).country, country);
  },
);

Then(
  "the tournament's page starts on {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(tournamentRead(this).starts, day);
  },
);

Then(
  "the tournament's page finishes on {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(tournamentRead(this).finishes, day);
  },
);

Then(
  /^the competitions of the page are (.+)$/,
  function (this: SpecWorld, said: string) {
    assert.deepEqual(
      tournamentRead(this).competitions.map((each) => each.name),
      quoted(said),
    );
  },
);

Then(
  "the competition found is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionRead(this).name, name);
  },
);

Then("no competition is found for the page", function (this: SpecWorld) {
  const read = readOf(this);
  assert.ok(read.asked, "No competition was asked for.");
  assert.equal(read.competition, undefined);
});

Then(
  "the competition found is played as the best of {int}",
  function (this: SpecWorld, games: number) {
    assert.equal(competitionRead(this).bestOf, games);
  },
);

Then(
  "the competition found is played in {int} rounds",
  function (this: SpecWorld, rounds: number) {
    assert.equal(competitionRead(this).rounds, rounds);
  },
);

Then(
  "the competition found is played to {int} hoops",
  function (this: SpecWorld, hoops: number) {
    assert.equal(competitionRead(this).maximumHoops, hoops);
  },
);

Then(
  /^the players of the page are (.+)$/,
  function (this: SpecWorld, said: string) {
    assert.deepEqual(
      (readOf(this).players ?? []).map((each) => each.name),
      quoted(said),
    );
  },
);

const playerRead = (world: SpecWorld, name: string): PlayerOfPage => {
  const player = (readOf(world).players ?? []).find(
    (each) => each.name === name,
  );
  assert.ok(player !== undefined, `${name} is not read back.`);
  return player;
};

Then(
  "the player {string} of the page has the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(playerRead(this, name).slug, slug);
  },
);

Then(
  "the player {string} of the page is withdrawn",
  function (this: SpecWorld, name: string) {
    assert.equal(playerRead(this, name).withdrawn, true);
  },
);

Then(
  "the tournament's page is played in the format {string}",
  function (this: SpecWorld, format: string) {
    assert.equal(tournamentRead(this).format, format);
  },
);

Then(
  /^the tournament's page (draws|does not draw) a test level on matches$/,
  function (this: SpecWorld, which: string) {
    assert.equal(tournamentRead(this).levelTestsDrawn, which === "draws");
  },
);

Then(
  "the competition found is a test between {string} and {string}",
  async function (this: SpecWorld, first: string, second: string) {
    const teams = competitionRead(this).teams;
    assert.ok(teams !== undefined, "The competition has no teams.");
    const pages = pagesOf(this);
    await this.asARequest(async () => {
      assert.equal((await pages.team(teams.first))?.name, first);
      assert.equal((await pages.team(teams.second))?.name, second);
    });
  },
);

const teamsRead = (world: SpecWorld): TeamsToStand => {
  const { teams } = readOf(world);
  assert.ok(teams !== undefined, "No teams were read back.");
  return teams;
};

const teamToStand = (world: SpecWorld, name: string) => {
  const team = teamsRead(world).teams.find((each) => each.name === name);
  assert.ok(team !== undefined, `${name} is not read back.`);
  return team;
};

Then(/^the teams to stand are (.+)$/, function (this: SpecWorld, said: string) {
  assert.deepEqual(
    teamsRead(this).teams.map((each) => each.name),
    quoted(said),
  );
});

Then(
  "the team {string} to stand is archived",
  function (this: SpecWorld, name: string) {
    assert.equal(teamToStand(this, name).archived, true);
  },
);

Then(
  "the team {string} to stand is known for short as {string}",
  function (this: SpecWorld, name: string, shortName: string) {
    assert.equal(teamToStand(this, name).shortName, shortName);
  },
);

Then(
  "the team player {string} to stand plays for {string}",
  function (this: SpecWorld, player: string, team: string) {
    const kept = teamsRead(this);
    // A team player is named in the scenario as they were made, in the test.
    const playerId = [...ownScenarioOf(this).entries].find(([label]) =>
      label.startsWith(`${player} in the test of `),
    )?.[1];
    assert.ok(playerId !== undefined, `${player} was not made.`);
    assert.equal(kept.teamOf.get(playerId.value), teamToStand(this, team).id);
  },
);

Then(
  /^the first test to stand has (\d+) games?$/,
  function (this: SpecWorld, games: number) {
    assert.equal(teamsRead(this).tests[0]?.games.length, Number(games));
  },
);

Then(
  "the first test to stand is expected to have {int} matches",
  function (this: SpecWorld, matches: number) {
    assert.equal(teamsRead(this).tests[0]?.expectedMatches, matches);
  },
);

Then("the tournament's page has no format", function (this: SpecWorld) {
  assert.equal(tournamentRead(this).format, undefined);
});
