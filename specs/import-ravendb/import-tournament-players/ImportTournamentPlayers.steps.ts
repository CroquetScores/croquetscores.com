import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Tournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import type { TournamentPlayer } from "../../../src/domain/aggregates/tournaments/TournamentPlayer.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";
import { startWriting, tournamentKeptFor } from "../importingTournaments.js";
import { TournamentPlayerId } from "../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";

Given(
  "the players {string} of {string} on {string}",
  function (this: SpecWorld, id: string, tournament: string, website: string) {
    startWriting(this, {
      kind: "players",
      website,
      id,
      document: { Tournament: { Id: tournament }, _Players: [] },
    });
  },
);

const playerCalled = (
  tournament: Tournament,
  name: string,
): TournamentPlayer => {
  const found = tournament.players.find(
    (player) => player.name.toString() === name,
  );
  assert.ok(
    found !== undefined,
    `Nobody is called ${name}: ${tournament.players.map(String).join(", ")}.`,
  );
  return found;
};

Then(
  "the tournament kept for {string} on {string} has the player {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    playerCalled(await tournamentKeptFor(this, id, website), name);
  },
);

Then(
  "the first player of the tournament kept for {string} on {string} is {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const [first] = (await tournamentKeptFor(this, id, website)).players;
    assert.equal(first?.name.toString(), name);
  },
);

Then(
  "{string} in the tournament kept for {string} on {string} represents {string}",
  async function (
    this: SpecWorld,
    name: string,
    id: string,
    website: string,
    representing: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(playerCalled(tournament, name).representing, representing);
  },
);

Then(
  "{string} in the tournament kept for {string} on {string} represents nothing",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(playerCalled(tournament, name).representing, undefined);
  },
);

Then(
  "{string} in the tournament kept for {string} on {string} has no world ranking name",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(playerCalled(tournament, name).worldRankingName, undefined);
  },
);

Then(
  "{string} in the tournament kept for {string} on {string} has the world ranking name {string}",
  async function (
    this: SpecWorld,
    name: string,
    id: string,
    website: string,
    worldRankingName: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(
      String(playerCalled(tournament, name).worldRankingName),
      worldRankingName,
    );
  },
);

Then(
  "{string} in the tournament kept for {string} on {string} flies the flag {string}",
  async function (
    this: SpecWorld,
    name: string,
    id: string,
    website: string,
    flag: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(String(playerCalled(tournament, name).flag), flag);
  },
);

Then(
  "{string} in the tournament kept for {string} on {string} flies no flag",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(playerCalled(tournament, name).flag, undefined);
  },
);

Then(
  "player {int} of {string} on {string} is kept as the bye",
  async function (
    this: SpecWorld,
    number: number,
    id: string,
    website: string,
  ) {
    assert.equal(
      await importDatabaseOf(this).findPlayerOf(website, id, number),
      TournamentPlayerId.bye().value,
    );
  },
);
