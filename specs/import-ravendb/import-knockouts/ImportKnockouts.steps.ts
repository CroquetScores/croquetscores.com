import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TournamentPlayerId } from "../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";
import {
  aCompetition,
  aCompetitionPlayer,
  competitionKeptFor,
  competitionWritten,
  imported,
  nameOf,
  startWriting,
} from "../importingTournaments.js";

Given(
  "the knockout {string} of {string} on {string}",
  function (this: SpecWorld, id: string, tournament: string, website: string) {
    startWriting(this, {
      kind: "knockout",
      website,
      id,
      document: aCompetition("knockout", tournament),
    });
  },
);

// A knockout of two byes, which is a knockout whose draw is filled without a
// player having to be brought over first. The byes are a player of the
// tournament the old sites called "Bye", numbered past any a scenario names.
const BYES = 999;

Given(
  "the knockout {string} of {string} on {string} is imported as {string}",
  async function (
    this: SpecWorld,
    id: string,
    tournament: string,
    website: string,
    name: string,
  ) {
    const database = importDatabaseOf(this);
    if (
      (await database.findPlayerOf(website, tournament, BYES)) === undefined
    ) {
      await database.recordImportedPlayer(
        website,
        tournament,
        BYES,
        TournamentPlayerId.bye().value,
      );
    }
    await imported(this, {
      kind: "knockout",
      website,
      id,
      document: {
        ...aCompetition("knockout", tournament),
        Name: name,
        Size: 2,
        Players: {
          _Players: [aCompetitionPlayer(BYES), aCompetitionPlayer(BYES)],
        },
      },
    });
  },
);

Given("the knockout's size is {int}", function (this: SpecWorld, size: number) {
  competitionWritten(this).Size = size;
});

// The knockout's draw ------------------------------------------------------------

// Who stands against the competition player called `name` in the first round,
// by the order the knockout is drawn in: the first two meet, then the next two.
const drawnAgainst = async (
  world: SpecWorld,
  name: string,
  id: string,
  website: string,
): Promise<string> => {
  const { tournament, competition } = await competitionKeptFor(
    world,
    id,
    website,
  );
  const places = competition.players;
  const at = places.findIndex(
    (player) =>
      !player.isBye && nameOf(tournament, competition, player.id) === name,
  );
  assert.ok(at >= 0, `${name} is not in the knockout.`);
  // The other of the two places a first-round match is between.
  const other = places[at % 2 === 0 ? at + 1 : at - 1];
  assert.ok(other !== undefined, `${name} stands against nobody.`);
  return other.isBye ? "a bye" : nameOf(tournament, competition, other.id);
};

Then(
  "{string} is drawn against {string} in the competition kept for {string} on {string}",
  async function (
    this: SpecWorld,
    name: string,
    opponent: string,
    id: string,
    website: string,
  ) {
    assert.equal(await drawnAgainst(this, name, id, website), opponent);
  },
);

Then(
  "{string} is drawn against a bye in the competition kept for {string} on {string}",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    assert.equal(await drawnAgainst(this, name, id, website), "a bye");
  },
);

Then(
  /^the competition kept for "(.*)" on "(.*)" has (\d+) byes?$/,
  async function (this: SpecWorld, id: string, website: string, count: string) {
    const { competition } = await competitionKeptFor(this, id, website);
    assert.equal(
      competition.players.filter((player) => player.isBye).length,
      Number(count),
    );
  },
);

// The knockout's shape -----------------------------------------------------------

const drawOf = async (world: SpecWorld, id: string, website: string) => {
  const { inTournament } = await competitionKeptFor(world, id, website);
  const { shape } = inTournament;
  assert.equal(shape.kind, "knockout", `It is a ${shape.kind}.`);
  return shape.draw;
};

Then(
  "the competition kept for {string} on {string} has {int} places",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    places: number,
  ) {
    assert.equal((await drawOf(this, id, website)).places, places);
  },
);

Then(
  "round {int} of the competition kept for {string} on {string} is the best of {int}",
  async function (
    this: SpecWorld,
    round: number,
    id: string,
    website: string,
    games: number,
  ) {
    const rounds = (await drawOf(this, id, website)).rounds;
    assert.equal(rounds[round - 1]?.games, games);
  },
);
