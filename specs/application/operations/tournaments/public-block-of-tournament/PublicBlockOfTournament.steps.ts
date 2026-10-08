import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type BlockToRead,
  type GameOfBlock,
  type PlayerOfBlock,
  PublicBlockOfTournament,
} from "../../../../../src/application/operations/tournaments/PublicBlockOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, and what is the
// block's own: its players, its games and each player's totals.

const answered = (world: SpecWorld): BlockToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as BlockToRead;
};

const places = ["first", "second", "third"];

const playerAnswered = (world: SpecWorld, name: string): PlayerOfBlock => {
  const player = answered(world).players.find((each) => each.name === name);
  assert.ok(player !== undefined, `${name} is not answered.`);
  return player;
};

const gameAnswered = (world: SpecWorld, which: string): GameOfBlock => {
  const game = answered(world).games[places.indexOf(which)];
  assert.ok(game !== undefined, `No ${which} game was answered.`);
  return game;
};

// The name of the player of the block a game names by `id`.
const nameOf = (world: SpecWorld, id: string): string | undefined =>
  answered(world).players.find((each) => each.id === id)?.name;

// Asked with nobody signed in.
When(
  "the block {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, slug: string, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicBlockOfTournament("croquetscores.com", address, slug),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the block answered is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(answered(this).block.name, name);
  },
);

Then(
  "the block answered is the best of {int}",
  function (this: SpecWorld, games: number) {
    assert.equal(answered(this).block.bestOf, games);
  },
);

// Its players ------------------------------------------------------------------------

Then(
  /^the (first|second|third) player of the block answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).players[places.indexOf(which)]?.name, name);
  },
);

Then(
  /^(\d+) players? of the block (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).players.length, Number(count));
  },
);

Then(
  /^the player of the block "(.*)" is (not )?answered as withdrawn$/,
  function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(playerAnswered(this, name).withdrawn, not === null);
  },
);

Then(
  "the player of the block {string} is answered as found at {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(playerAnswered(this, name).address, address);
  },
);

// Its games --------------------------------------------------------------------------

Then(
  /^the (first|second|third) game of the block answered was (won|lost) by "(.*)"$/,
  function (this: SpecWorld, which: string, result: string, name: string) {
    const game = gameAnswered(this, which);
    assert.equal(
      nameOf(this, result === "won" ? game.winner : game.loser),
      name,
    );
  },
);

Then(
  /^the (first|second|third) game of the block answered was played to "(.*)" against "(.*)"$/,
  function (
    this: SpecWorld,
    which: string,
    winnerScore: string,
    loserScore: string,
  ) {
    const game = gameAnswered(this, which);
    assert.deepEqual(
      [game.winnerScore, game.loserScore],
      [winnerScore, loserScore],
    );
  },
);

Then(
  /^the (first|second|third) game of the block answered was (not )?withdrawn$/,
  function (this: SpecWorld, which: string, not: string | null) {
    assert.equal(gameAnswered(this, which).withdrawn, not === null);
  },
);

Then(
  /^the (first|second|third) game of the block answered was drawn$/,
  function (this: SpecWorld, which: string) {
    assert.equal(gameAnswered(this, which).drawn, true);
  },
);

Then(
  /^the (first|second|third) game of the block answered was added at "(.*)"$/,
  function (this: SpecWorld, which: string, at: string) {
    // As a moment, since a scenario writes it without the milliseconds.
    assert.equal(
      gameAnswered(this, which).addedAt?.toDate().getTime(),
      new Date(at).getTime(),
    );
  },
);

// Its players ranked -----------------------------------------------------------------

Then(
  /^the (first|second|third) player of the block ranked is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    const id = answered(this).ranked[places.indexOf(which)];
    assert.ok(id !== undefined, `No ${which} player is ranked.`);
    assert.equal(nameOf(this, id), name);
  },
);

Then(
  /^(\d+) games? of the block (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).games.length, Number(count));
  },
);

// Each player's totals ---------------------------------------------------------------

Then(
  /^the player of the block "(.*)" is answered with (\d+) (?:match|matches) won$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).matchesWon, Number(count));
  },
);

Then(
  /^the player of the block "(.*)" is answered with (\d+) (?:match|matches) lost$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).matchesLost, Number(count));
  },
);

Then(
  /^the player of the block "(.*)" is answered with (\d+) games? won$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).gamesWon, Number(count));
  },
);

Then(
  /^the player of the block "(.*)" is answered with net games of (-?\d+)$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).netGames, Number(count));
  },
);

Then(
  /^the player of the block "(.*)" is answered with net hoops of (-?\d+)$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).netHoops, Number(count));
  },
);
