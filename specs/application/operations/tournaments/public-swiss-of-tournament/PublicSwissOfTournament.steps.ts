import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type PlayerOfSwiss,
  PublicSwissOfTournament,
  type ResultOfSwiss,
  type SwissToRead,
} from "../../../../../src/application/operations/tournaments/PublicSwissOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, and what is the
// Swiss's own: its players, their results and their ranking, and its games.

const answered = (world: SpecWorld): SwissToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as SwissToRead;
};

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const playerAnswered = (world: SpecWorld, name: string): PlayerOfSwiss => {
  const player = answered(world).players.find((each) => each.name === name);
  assert.ok(player !== undefined, `${name} is not answered.`);
  return player;
};

const resultAnswered = (
  world: SpecWorld,
  which: string,
  name: string,
): ResultOfSwiss => {
  const result = playerAnswered(world, name).results[placeOf(which)];
  assert.ok(result !== undefined, `${name} has no ${which} result.`);
  return result;
};

// Asked with nobody signed in.
When(
  "the Swiss {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, slug: string, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicSwissOfTournament("croquetscores.com", address, slug),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the Swiss answered is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(answered(this).swiss.name, name);
  },
);

// Its players ---------------------------------------------------------------------

Then(
  /^the (first|second|third) player of the Swiss answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).players[placeOf(which)]?.name, name);
  },
);

Then(
  "the player of the Swiss {string} is answered as found at {string}",
  function (this: SpecWorld, name: string, address: string) {
    assert.equal(playerAnswered(this, name).address, address);
  },
);

Then(
  /^the player of the Swiss "(.*)" is (not )?answered as withdrawn$/,
  function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(playerAnswered(this, name).withdrawn, not === null);
  },
);

Then(
  /^the player of the Swiss "(.*)" is answered with (\d+) games? played$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).gamesPlayed, Number(count));
  },
);

Then(
  /^the player of the Swiss "(.*)" is answered with (\d+) games? won$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).gamesWon, Number(count));
  },
);

Then(
  /^the player of the Swiss "(.*)" is answered with net hoops of (-?\d+)$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).netHoops, Number(count));
  },
);

Then(
  /^the player of the Swiss "(.*)" is answered with (\d+) results?$/,
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(playerAnswered(this, name).results.length, Number(count));
  },
);

// Their results ---------------------------------------------------------------------

const RESULT =
  'the (first|second|third) result of the player of the Swiss "(.*)"';

Then(
  new RegExp(`^${RESULT} was against "(.*)"$`),
  function (this: SpecWorld, which: string, name: string, opponent: string) {
    assert.equal(resultAnswered(this, which, name).opponent.name, opponent);
  },
);

Then(
  new RegExp(`^${RESULT} was against a player found at "(.*)"$`),
  function (this: SpecWorld, which: string, name: string, address: string) {
    assert.equal(resultAnswered(this, which, name).opponent.address, address);
  },
);

Then(
  new RegExp(`^${RESULT} was (won|lost) by (\\d+)$`),
  function (
    this: SpecWorld,
    which: string,
    name: string,
    result: string,
    by: string,
  ) {
    const found = resultAnswered(this, which, name);
    assert.deepEqual(
      [found.result, found.margin],
      [result, result === "won" ? Number(by) : -Number(by)],
    );
  },
);

Then(
  new RegExp(`^${RESULT} was drawn$`),
  function (this: SpecWorld, which: string, name: string) {
    const found = resultAnswered(this, which, name);
    assert.deepEqual([found.result, found.margin], ["drawn", 0]);
  },
);

// Its players ranked -------------------------------------------------------------

Then(
  /^the (first|second|third) player of the Swiss ranked is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    const id = answered(this).ranked[placeOf(which)];
    assert.ok(id !== undefined, `No ${which} player is ranked.`);
    assert.equal(
      answered(this).players.find((each) => each.id === id)?.name,
      name,
    );
  },
);

// Its games in the order they were added ------------------------------------------

Then(
  /^the (first|second|third) game of the Swiss answered was won by "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).games[placeOf(which)]?.winner.name, name);
  },
);

Then(
  /^the (first|second|third) game of the Swiss answered was added at "(.*)"$/,
  function (this: SpecWorld, which: string, at: string) {
    // As a moment, since a scenario writes it without the milliseconds.
    assert.equal(
      answered(this).games[placeOf(which)]?.addedAt?.toDate().getTime(),
      new Date(at).getTime(),
    );
  },
);
