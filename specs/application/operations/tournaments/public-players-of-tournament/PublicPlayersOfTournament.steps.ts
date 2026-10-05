import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  PublicPlayersOfTournament,
  type TournamentPlayersToRead,
} from "../../../../../src/application/operations/tournaments/PublicPlayersOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the players answered are, and what the tournament is answered as, are
// said in the words the managers' list of players and a tournament's games
// share (PlayersOfTournament.steps.ts, GamesOfTournament.steps.ts). What is
// here is asking, and where each player's page is found.

// Asked with nobody signed in.
const ask = async (
  world: SpecWorld,
  website: string,
  address: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new PublicPlayersOfTournament(website, address),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the public players of the tournament at {string} are asked for",
  async function (this: SpecWorld, address: string) {
    await ask(this, "croquetscores.com", address);
  },
);

When(
  "the public players of the tournament on {string} at {string} are asked for",
  async function (this: SpecWorld, website: string, address: string) {
    await ask(this, website, address);
  },
);

Then(
  "the player {string} is answered as found at {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(
      this.failure,
      undefined,
      `It was refused: ${inspect(this.failure)}`,
    );
    const found = (this.answer as TournamentPlayersToRead).players.find(
      (player) => player.name === name,
    );
    assert.ok(found !== undefined, `${name} is not answered.`);
    assert.equal(found.address, address);
  },
);

// A tournament played by teams, team by team -------------------------------------

const answered = (world: SpecWorld): TournamentPlayersToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as TournamentPlayersToRead;
};

const places = ["first", "second", "third"];

const teamAnswered = (world: SpecWorld, name: string) => {
  const team = answered(world).teams.find((each) => each.name === name);
  assert.ok(team !== undefined, `${name} is not answered.`);
  return team;
};

Then(
  /^the (first|second|third) team of the players answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).teams[places.indexOf(which)]?.name, name);
  },
);

Then(
  /^(\d+) teams? of the players (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).teams.length, Number(count));
  },
);

Then(
  /^the (first|second|third) player of the team "(.*)" among the players answered is "(.*)"$/,
  function (this: SpecWorld, which: string, team: string, name: string) {
    assert.equal(
      teamAnswered(this, team).players[places.indexOf(which)]?.name,
      name,
    );
  },
);

Then(
  /^(\d+) players? of the team "(.*)" (?:is|are) among the players answered$/,
  function (this: SpecWorld, count: string, team: string) {
    assert.equal(teamAnswered(this, team).players.length, Number(count));
  },
);

Then(
  "the player {string} of the team {string} is answered as found at {string}",
  function (this: SpecWorld, name: string, team: string, address: string) {
    const found = teamAnswered(this, team).players.find(
      (player) => player.name === name,
    );
    assert.ok(found !== undefined, `${name} is not answered.`);
    assert.equal(found.address, address);
  },
);
