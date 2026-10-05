import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type MatchOfTest,
  PublicTestOfTournament,
  type TestToRead,
} from "../../../../../src/application/operations/tournaments/PublicTestOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, and what is the
// test's own: its teams, its matches and its games.

const answered = (world: SpecWorld): TestToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as TestToRead;
};

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const matchAnswered = (world: SpecWorld, which: string): MatchOfTest => {
  const match = answered(world).matches[placeOf(which)];
  assert.ok(match !== undefined, `No ${which} match was answered.`);
  return match;
};

// Asked with nobody signed in.
When(
  "the test {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, slug: string, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicTestOfTournament("croquetscores.com", address, slug),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

// Its teams --------------------------------------------------------------------

Then(
  /^the (first|second) team of the test answered is "(.*)"$/,
  function (this: SpecWorld, which: string, shortName: string) {
    assert.equal(
      answered(this).test.teams[placeOf(which)]?.shortName,
      shortName,
    );
  },
);

Then(
  /^the (first|second) team of the test answered is called "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).test.teams[placeOf(which)]?.name, name);
  },
);

Then(
  "the test answered is the best of {int}",
  function (this: SpecWorld, games: number) {
    assert.equal(answered(this).test.bestOf, games);
  },
);

Then(
  /^the (first|second) team of the test is answered with (\d+) match(?:es)?$/,
  function (this: SpecWorld, which: string, count: string) {
    assert.equal(
      answered(this).test.teams[placeOf(which)]?.matches,
      Number(count),
    );
  },
);

Then(
  /^the (first|second) team of the test is answered with (\d+) games?$/,
  function (this: SpecWorld, which: string, count: string) {
    assert.equal(
      answered(this).test.teams[placeOf(which)]?.games,
      Number(count),
    );
  },
);

Then(
  /^the (first|second) team of the test is answered with (\d+) hoops$/,
  function (this: SpecWorld, which: string, count: string) {
    assert.equal(
      answered(this).test.teams[placeOf(which)]?.hoops,
      Number(count),
    );
  },
);

// Its matches -------------------------------------------------------------------

Then(
  /^the (first|second) side of the (first|second) match of the test answered is "(.*)"$/,
  function (this: SpecWorld, side: string, match: string, name: string) {
    assert.equal(matchAnswered(this, match).sides[placeOf(side)], name);
  },
);

Then(
  /^(\d+) match(?:es)? of the test (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).matches.length, Number(count));
  },
);

Then(
  /^the (first|second) side scored "(.*)" in the (first|second|third) game of the (first|second) match of the test answered$/,
  function (
    this: SpecWorld,
    side: string,
    score: string,
    game: string,
    match: string,
  ) {
    assert.equal(
      matchAnswered(this, match).games[placeOf(game)]?.scores[placeOf(side)],
      score,
    );
  },
);

Then(
  /^the (first|second|third) game of the (first|second) match of the test answered was won by the (first|second) side$/,
  function (this: SpecWorld, game: string, match: string, side: string) {
    assert.equal(
      matchAnswered(this, match).games[placeOf(game)]?.winner,
      placeOf(side),
    );
  },
);

Then(
  /^the (first|second) match of the test answered was won by its (first|second) side$/,
  function (this: SpecWorld, match: string, side: string) {
    assert.equal(matchAnswered(this, match).winner, placeOf(side));
  },
);

Then(
  /^the (first|second) match of the test answered is not yet decided$/,
  function (this: SpecWorld, match: string) {
    assert.equal(matchAnswered(this, match).winner, undefined);
  },
);

// Its games in the order they were added ---------------------------------------

Then(
  /^the (first|second|third) game of the test answered was won by "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).games[placeOf(which)]?.winner.name, name);
  },
);

Then(
  /^the (first|second|third) game of the test answered was won by a player representing "(.*)"$/,
  function (this: SpecWorld, which: string, team: string) {
    assert.equal(
      answered(this).games[placeOf(which)]?.winner.representing,
      team,
    );
  },
);

Then(
  /^the (first|second|third) game of the test answered was added at "(.*)"$/,
  function (this: SpecWorld, which: string, at: string) {
    // As a moment, since a scenario writes it without the milliseconds.
    assert.equal(
      answered(this).games[placeOf(which)]?.addedAt?.toDate().getTime(),
      new Date(at).getTime(),
    );
  },
);
