import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { CompetitionId } from "../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { SpecWorld } from "../../../../support/world.js";
import { positionOf } from "../ordinals.js";
import {
  dayOf,
  teamNamed,
  teamPlayerNamed,
  teamScenarioOf,
  teamToAdd,
  testNamed,
  testToAdd,
} from "./aTeamTournament.js";
import {
  byOf,
  happened,
  now,
  scenarioOf,
  tournamentOf,
} from "./aTournament.js";

// The steps more than one of the features of a tournament played by teams
// uses: the teams, their players and the tests a stream holds, and what each
// of them is. Each method's own steps are beside its feature, in the folder
// named for it.

// The stream --------------------------------------------------------------

Given(
  "the team is to be known for short as {string}",
  function (this: SpecWorld, shortName: string) {
    teamScenarioOf(this).team.shortName = shortName;
  },
);

Given(
  "the team is to fly the flag {string}",
  function (this: SpecWorld, flag: string) {
    teamScenarioOf(this).team.flag = flag;
  },
);

Given(
  "the team {string} was added to it",
  function (this: SpecWorld, name: string) {
    const { id, details } = teamToAdd(this, name);
    happened(this, (tournament) =>
      tournament.addTeam(id, details, byOf(this), now(this)),
    );
  },
);

Given(
  "the team {string} was archived",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.archiveTeam(
        teamNamed(tournament, name).id,
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the player {string} was added to the team {string}",
  function (this: SpecWorld, name: string, team: string) {
    happened(this, (tournament) =>
      tournament.addTeamPlayer(
        teamNamed(tournament, team).id,
        TeamPlayerId.create(),
        { name, worldRankingName: scenarioOf(this).player.worldRankingName },
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the player {string} of the team {string} was archived",
  function (this: SpecWorld, name: string, team: string) {
    happened(this, (tournament) => {
      const found = teamNamed(tournament, team);
      tournament.archiveTeamPlayer(
        found.id,
        teamPlayerNamed(found, name).id,
        false,
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  "the test between {string} and {string} was added to it",
  function (this: SpecWorld, first: string, second: string) {
    happened(this, (tournament) =>
      tournament.addTest(
        CompetitionId.create(),
        testToAdd(
          this,
          tournament,
          teamNamed(tournament, first).id,
          teamNamed(tournament, second).id,
        ),
        byOf(this),
        now(this),
      ),
    );
  },
);

// What its teams are ----------------------------------------------------------

Then(
  "the tournament has the team {string}",
  function (this: SpecWorld, name: string) {
    teamNamed(tournamentOf(this), name);
  },
);

Then(
  "the tournament has no team {string}",
  function (this: SpecWorld, name: string) {
    const names = tournamentOf(this).teams.map(String);
    assert.ok(!names.includes(name), `It has ${inspect(names)}.`);
  },
);

Then(
  "the tournament's {word} team is {string}",
  function (this: SpecWorld, ordinal: string, name: string) {
    assert.equal(String(tournamentOf(this).teams[positionOf(ordinal)]), name);
  },
);

Then(
  "the tournament's team {string} is known for short as {string}",
  function (this: SpecWorld, name: string, shortName: string) {
    assert.equal(
      String(teamNamed(tournamentOf(this), name).shortName),
      shortName,
    );
  },
);

Then(
  "the tournament's team {string} flies the flag {string}",
  function (this: SpecWorld, name: string, flag: string) {
    assert.equal(String(teamNamed(tournamentOf(this), name).flag), flag);
  },
);

Then(
  "the tournament's team {string} has the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(String(teamNamed(tournamentOf(this), name).slug), slug);
  },
);

Then(
  "the tournament's team {string} has the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    assert.equal(teamNamed(tournamentOf(this), name).order, order);
  },
);

Then(
  "the tournament's team {string} is archived",
  function (this: SpecWorld, name: string) {
    assert.equal(teamNamed(tournamentOf(this), name).archived, true);
  },
);

Then(
  "the tournament's team {string} is not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(teamNamed(tournamentOf(this), name).archived, false);
  },
);

Then(
  "the tournament's team {string} has no players",
  function (this: SpecWorld, name: string) {
    assert.deepEqual(
      teamNamed(tournamentOf(this), name).players.map(String),
      [],
    );
  },
);

Then(
  "the tournament's team {string} has the player {string}",
  function (this: SpecWorld, team: string, name: string) {
    teamPlayerNamed(teamNamed(tournamentOf(this), team), name);
  },
);

// What their players are ------------------------------------------------------

Then(
  "the team {string} has the player {string}",
  function (this: SpecWorld, team: string, name: string) {
    teamPlayerNamed(teamNamed(tournamentOf(this), team), name);
  },
);

Then(
  "the team {string} has no players",
  function (this: SpecWorld, team: string) {
    assert.deepEqual(
      teamNamed(tournamentOf(this), team).players.map(String),
      [],
    );
  },
);

Then(
  "the team {string} has no player {string}",
  function (this: SpecWorld, team: string, name: string) {
    const names = teamNamed(tournamentOf(this), team).players.map(String);
    assert.ok(!names.includes(name), `It has ${inspect(names)}.`);
  },
);

Then(
  "the team {string}'s {word} player is {string}",
  function (this: SpecWorld, team: string, ordinal: string, name: string) {
    const { players } = teamNamed(tournamentOf(this), team);
    assert.equal(String(players[positionOf(ordinal)]), name);
  },
);

Then(
  "the player {string} of the team {string} has the order {int}",
  function (this: SpecWorld, name: string, team: string, order: number) {
    assert.equal(
      teamPlayerNamed(teamNamed(tournamentOf(this), team), name).order,
      order,
    );
  },
);

Then(
  "the player {string} of the team {string} has the slug {string}",
  function (this: SpecWorld, name: string, team: string, slug: string) {
    assert.equal(
      teamPlayerNamed(
        teamNamed(tournamentOf(this), team),
        name,
      ).slug.toString(),
      slug,
    );
  },
);

Then(
  "the team {string}'s player {string} is archived",
  function (this: SpecWorld, team: string, name: string) {
    assert.equal(
      teamPlayerNamed(teamNamed(tournamentOf(this), team), name).archived,
      true,
    );
  },
);

Then(
  "the team {string}'s player {string} has the world ranking name {string}",
  function (
    this: SpecWorld,
    team: string,
    name: string,
    worldRankingName: string,
  ) {
    assert.equal(
      String(
        teamPlayerNamed(teamNamed(tournamentOf(this), team), name)
          .worldRankingName,
      ),
      worldRankingName,
    );
  },
);

Then(
  "the team {string}'s player {string} has no world ranking name",
  function (this: SpecWorld, team: string, name: string) {
    assert.equal(
      teamPlayerNamed(teamNamed(tournamentOf(this), team), name)
        .worldRankingName,
      undefined,
    );
  },
);

Then(
  "the team {string}'s player {string} is not archived",
  function (this: SpecWorld, team: string, name: string) {
    assert.equal(
      teamPlayerNamed(teamNamed(tournamentOf(this), team), name).archived,
      false,
    );
  },
);

// What its tests are ----------------------------------------------------------

Then(
  "the test {string} starts on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(dayOf(testNamed(tournamentOf(this), name).shape.starts), day);
  },
);

Then(
  "the test {string} finishes on {string}",
  function (this: SpecWorld, name: string, day: string) {
    assert.equal(
      dayOf(testNamed(tournamentOf(this), name).shape.finishes),
      day,
    );
  },
);

Then(
  /^the (first|second) team of the test "([^"]*)" is "([^"]*)"$/,
  function (this: SpecWorld, which: string, name: string, team: string) {
    const tournament = tournamentOf(this);
    const { shape } = testNamed(tournament, name);
    const id = which === "first" ? shape.firstTeam : shape.secondTeam;
    assert.equal(String(teamNamed(tournament, team).id), String(id));
  },
);

Then(
  "the test {string} is expected to have {int} match(es)",
  function (this: SpecWorld, name: string, count: number) {
    assert.equal(
      testNamed(tournamentOf(this), name).shape.expectedMatches.count,
      count,
    );
  },
);

Then(
  "each match of the test {string} is the best of {int}",
  function (this: SpecWorld, name: string, games: number) {
    assert.equal(testNamed(tournamentOf(this), name).shape.bestOf.games, games);
  },
);

Then(
  "the test {string} is in the group {string}",
  function (this: SpecWorld, name: string, group: string) {
    assert.equal(
      String(testNamed(tournamentOf(this), name).shape.group),
      group,
    );
  },
);

Then(
  "the test {string} is in no group",
  function (this: SpecWorld, name: string) {
    assert.equal(testNamed(tournamentOf(this), name).shape.group, undefined);
  },
);
