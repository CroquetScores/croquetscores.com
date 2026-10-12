import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Team } from "../../../src/domain/aggregates/tournaments/Team.js";
import type { Tournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";
import {
  aCompetition,
  competitionKeptFor,
  competitionPlayerWritten,
  competitionWritten,
  gamesInUse,
  nameOf,
  startWriting,
  tournamentKeptFor,
} from "../importingTournaments.js";

// The team match being written --------------------------------------------------

Given(
  "the team match {string} of {string} on {string}",
  function (this: SpecWorld, id: string, tournament: string, website: string) {
    startWriting(this, {
      kind: "team match",
      website,
      id,
      document: aCompetition("team match", tournament),
    });
  },
);

Given(
  "the team match is called {string}",
  function (this: SpecWorld, name: string) {
    competitionWritten(this).Name = name;
  },
);

Given("the team match was archived", function (this: SpecWorld) {
  competitionWritten(this).IsArchived = true;
});

Given(
  "the team match started on {string}",
  function (this: SpecWorld, day: string) {
    competitionWritten(this).Start = day;
  },
);

Given(
  "the team match finished on {string}",
  function (this: SpecWorld, day: string) {
    competitionWritten(this).Finish = day;
  },
);

Given(
  "the team match was expected to have {int} match(es)",
  function (this: SpecWorld, matches: number) {
    competitionWritten(this).ExpectedMatches = matches;
  },
);

Given(
  "the team match's matches were the best of {int}",
  function (this: SpecWorld, games: number) {
    competitionWritten(this).BestOf = games;
  },
);

Given(
  "the team match was in the group {string}",
  function (this: SpecWorld, group: string) {
    competitionWritten(this).Group = group;
  },
);

Given("the team match was in no group", function (this: SpecWorld) {
  competitionWritten(this).Group = null;
});

Given(
  "player {int} is in the team match",
  function (this: SpecWorld, number: number) {
    competitionPlayerWritten(this, number);
  },
);

// The test it became ----------------------------------------------------------------

const testKeptFor = async (world: SpecWorld, id: string, website: string) => {
  const kept = await competitionKeptFor(world, id, website);
  const { shape } = kept.inTournament;
  assert.equal(shape.kind, "test", `It is a ${shape.kind}.`);
  return { ...kept, shape: shape };
};

const teamNamed = (tournament: Tournament, name: string): Team => {
  const found = tournament.teams.find((team) => team.name.toString() === name);
  assert.ok(
    found !== undefined,
    `There is no team ${name}: ${tournament.teams.map((team) => team.name.toString()).join(", ")}.`,
  );
  return found;
};

Then(
  "the first game of the test kept for {string} on {string} was won by {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const { tournament, competition } = await testKeptFor(this, id, website);
    const [first] = gamesInUse(competition);
    assert.ok(first !== undefined, "The test has no game.");
    assert.equal(nameOf(tournament, competition, first.winner), name);
  },
);

Then(
  /^the (second|third) game of the test kept for "(.*)" on "(.*)" was won by "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    id: string,
    website: string,
    name: string,
  ) {
    const { tournament, competition } = await testKeptFor(this, id, website);
    const game = gamesInUse(competition)[which === "second" ? 1 : 2];
    assert.ok(game !== undefined, `The test has no ${which} game.`);
    assert.equal(nameOf(tournament, competition, game.winner), name);
  },
);

Then(
  "{string} on {string} is kept as a test",
  async function (this: SpecWorld, id: string, website: string) {
    await testKeptFor(this, id, website);
  },
);

Then(
  /^the (first|second) team of the test kept for "(.*)" on "(.*)" is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    id: string,
    website: string,
    name: string,
  ) {
    const { tournament, shape } = await testKeptFor(this, id, website);
    const team = which === "first" ? shape.firstTeam : shape.secondTeam;
    const found = tournament.teams.find((each) => each.id.equals(team));
    assert.equal(found?.name.toString(), name);
  },
);

Then(
  /^the test kept for "(.*)" on "(.*)" (starts|finishes) on "(.*)"$/,
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    which: string,
    day: string,
  ) {
    const { shape } = await testKeptFor(this, id, website);
    const moment = which === "starts" ? shape.starts : shape.finishes;
    assert.equal(moment.toISOString().slice(0, 10), day);
  },
);

Then(
  "the test kept for {string} on {string} is expected to have {int} match(es)",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    matches: number,
  ) {
    const { shape } = await testKeptFor(this, id, website);
    assert.equal(shape.expectedMatches.count, matches);
  },
);

Then(
  "the test kept for {string} on {string} is the best of {int}",
  async function (this: SpecWorld, id: string, website: string, games: number) {
    const { shape } = await testKeptFor(this, id, website);
    assert.equal(shape.bestOf.games, games);
  },
);

Then(
  "the test kept for {string} on {string} is in the group {string}",
  async function (this: SpecWorld, id: string, website: string, group: string) {
    const { shape } = await testKeptFor(this, id, website);
    assert.equal(shape.group?.toString(), group);
  },
);

Then(
  "the test kept for {string} on {string} is in no group",
  async function (this: SpecWorld, id: string, website: string) {
    const { shape } = await testKeptFor(this, id, website);
    assert.equal(shape.group, undefined);
  },
);

Then(
  /^the test kept for "(.*)" on "(.*)" has (\d+) games?$/,
  async function (this: SpecWorld, id: string, website: string, count: string) {
    const { competition } = await testKeptFor(this, id, website);
    assert.equal(gamesInUse(competition).length, Number(count));
  },
);

// Its teams ---------------------------------------------------------------------

Then(
  /^the tournament kept for "(.*)" on "(.*)" has (\d+) teams$/,
  async function (this: SpecWorld, id: string, website: string, count: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(tournament.teams.length, Number(count));
  },
);

Then(
  "the tournament kept for {string} on {string} has no teams",
  async function (this: SpecWorld, id: string, website: string) {
    assert.deepEqual((await tournamentKeptFor(this, id, website)).teams, []);
  },
);

Then(
  "the team {string} of the tournament kept for {string} on {string} has the short name {string}",
  async function (
    this: SpecWorld,
    name: string,
    id: string,
    website: string,
    shortName: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(teamNamed(tournament, name).shortName.toString(), shortName);
  },
);

Then(
  "the team {string} of the tournament kept for {string} on {string} flies the flag {string}",
  async function (
    this: SpecWorld,
    name: string,
    id: string,
    website: string,
    flag: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(String(teamNamed(tournament, name).flag), flag);
  },
);

Then(
  "the team {string} of the tournament kept for {string} on {string} flies no flag",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(teamNamed(tournament, name).flag, undefined);
  },
);

Then(
  "the player {string} of the team {string} of the tournament kept for {string} on {string} has no world ranking name",
  async function (
    this: SpecWorld,
    player: string,
    name: string,
    id: string,
    website: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    const found = teamNamed(tournament, name).players.find(
      (each) => each.name.toString() === player,
    );
    assert.ok(found !== undefined, `The team has no player ${player}.`);
    assert.equal(found.worldRankingName, undefined);
  },
);

Then(
  "the team {string} of the tournament kept for {string} on {string} has the player {string}",
  async function (
    this: SpecWorld,
    name: string,
    id: string,
    website: string,
    player: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    const players = teamNamed(tournament, name).players.map((each) =>
      each.name.toString(),
    );
    assert.ok(players.includes(player), `It has ${players.join(", ")}.`);
  },
);

Then(
  /^the team "(.*)" of the tournament kept for "(.*)" on "(.*)" has (\d+) players?$/,
  async function (
    this: SpecWorld,
    name: string,
    id: string,
    website: string,
    count: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(teamNamed(tournament, name).players.length, Number(count));
  },
);

Then(
  "player {int} of {string} on {string} is kept as a player of {string}",
  async function (
    this: SpecWorld,
    number: number,
    id: string,
    website: string,
    team: string,
  ) {
    const kept = await importDatabaseOf(this).findPlayerOf(website, id, number);
    assert.ok(kept !== undefined, `Player ${String(number)} is not kept.`);
    const tournament = await tournamentKeptFor(this, id, website);
    const theirs = tournament.teams.find((each) =>
      each.players.some((player) => player.id.value === kept),
    );
    assert.equal(theirs?.name.toString(), team);
  },
);
