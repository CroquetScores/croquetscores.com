import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type GameOfPlayer,
  PublicPlayerOfTournament,
  type PlayerToRead,
} from "../../../../../src/application/operations/tournaments/PublicPlayerOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as, how many games are answered and the
// competition each was played in are said in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, and what is the
// player's own: how they played each game, and their competitions.

const answered = (world: SpecWorld): PlayerToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as PlayerToRead;
};

const places = ["first", "second", "third"];

const gameAnswered = (world: SpecWorld, which: string): GameOfPlayer => {
  const game = answered(world).games[places.indexOf(which)];
  assert.ok(game !== undefined, `No ${which} game was answered.`);
  return game;
};

// Asked with nobody signed in.
When(
  "the player {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, slug: string, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicPlayerOfTournament("croquetscores.com", address, slug),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the player answered is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(answered(this).player.name, name);
  },
);

// How they played each game -----------------------------------------------------

const results = {
  "won against": "won",
  "lost to": "lost",
  "drawn with": "drawn",
} as const;

Then(
  /^the (first|second|third) game answered was (won against|lost to|drawn with) "(.*)"$/,
  function (
    this: SpecWorld,
    which: string,
    result: keyof typeof results,
    opponent: string,
  ) {
    const game = gameAnswered(this, which);
    assert.deepEqual(
      [game.result, game.opponent.name],
      [results[result], opponent],
    );
  },
);

Then(
  /^the (first|second|third) game answered was played to "(.*)" against "(.*)"$/,
  function (
    this: SpecWorld,
    which: string,
    score: string,
    opponentScore: string,
  ) {
    const game = gameAnswered(this, which);
    assert.deepEqual([game.score, game.opponentScore], [score, opponentScore]);
  },
);

Then(
  /^the (first|second|third) game answered was against a player found at "(.*)"$/,
  function (this: SpecWorld, which: string, address: string) {
    assert.equal(gameAnswered(this, which).opponent.address, address);
  },
);

Then(
  /^the (first|second|third) game answered was against a player of (?:the team "(.*)"|no team)$/,
  function (this: SpecWorld, which: string, team: string | undefined) {
    assert.equal(gameAnswered(this, which).opponent.team, team);
  },
);

// Their competitions ----------------------------------------------------------------

Then(
  /^the (first|second|third) competition of the player answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).entered[places.indexOf(which)]?.name, name);
  },
);

Then(
  /^(\d+) competitions? of the player (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).entered.length, Number(count));
  },
);

Then(
  "the competition of the player {string} is answered as found at {string}",
  function (this: SpecWorld, name: string, address: string) {
    const found = answered(this).entered.find(
      (competition) => competition.name === name,
    );
    assert.ok(found !== undefined, `${name} is not answered.`);
    assert.equal(found.address, address);
  },
);
