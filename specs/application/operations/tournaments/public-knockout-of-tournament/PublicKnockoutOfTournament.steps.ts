import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type KnockoutToRead,
  type MatchOfKnockout,
  PublicKnockoutOfTournament,
  type SideOfKnockout,
} from "../../../../../src/application/operations/tournaments/PublicKnockoutOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, and what is the
// knockout's own: its rounds, their matches and its games.

const answered = (world: SpecWorld): KnockoutToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as KnockoutToRead;
};

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const matchAnswered = (
  world: SpecWorld,
  match: string,
  round: string,
): MatchOfKnockout => {
  const found = answered(world).rounds[placeOf(round)]?.matches[placeOf(match)];
  assert.ok(found !== undefined, `No ${match} match of the ${round} round.`);
  return found;
};

const sideAnswered = (
  world: SpecWorld,
  side: string,
  match: string,
  round: string,
): SideOfKnockout => matchAnswered(world, match, round).sides[placeOf(side)]!;

const playerOf = (side: SideOfKnockout) => {
  assert.equal(side.is, "player", `The side is ${side.is}.`);
  return side.player;
};

// Asked with nobody signed in.
When(
  "the knockout {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, slug: string, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicKnockoutOfTournament("croquetscores.com", address, slug),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then(
  "the knockout answered is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(answered(this).knockout.name, name);
  },
);

// Its rounds ------------------------------------------------------------------------

Then(
  /^(\d+) rounds? of the knockout (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).rounds.length, Number(count));
  },
);

Then(
  /^the (first|second|third) round of the knockout answered is the best of (\d+)$/,
  function (this: SpecWorld, round: string, games: string) {
    assert.equal(answered(this).rounds[placeOf(round)]?.bestOf, Number(games));
  },
);

Then(
  /^(\d+) match(?:es)? of the (first|second|third) round of the knockout (?:is|are) answered$/,
  function (this: SpecWorld, count: string, round: string) {
    assert.equal(
      answered(this).rounds[placeOf(round)]?.matches.length,
      Number(count),
    );
  },
);

// Its matches' sides -----------------------------------------------------------------

const SIDE =
  "the (first|second) side of the (first|second) match of the (first|second|third) round answered";

Then(
  new RegExp(`^${SIDE} is "(.*)"$`),
  function (
    this: SpecWorld,
    side: string,
    match: string,
    round: string,
    name: string,
  ) {
    assert.equal(playerOf(sideAnswered(this, side, match, round)).name, name);
  },
);

Then(
  new RegExp(`^${SIDE} is (a bye|not yet known)$`),
  function (
    this: SpecWorld,
    side: string,
    match: string,
    round: string,
    what: string,
  ) {
    assert.equal(
      sideAnswered(this, side, match, round).is,
      what === "a bye" ? "bye" : "not yet known",
    );
  },
);

Then(
  new RegExp(`^${SIDE} has withdrawn$`),
  function (this: SpecWorld, side: string, match: string, round: string) {
    assert.equal(
      playerOf(sideAnswered(this, side, match, round)).withdrawn,
      true,
    );
  },
);

Then(
  new RegExp(`^${SIDE} is found at "(.*)"$`),
  function (
    this: SpecWorld,
    side: string,
    match: string,
    round: string,
    address: string,
  ) {
    assert.equal(
      playerOf(sideAnswered(this, side, match, round)).address,
      address,
    );
  },
);

// Its matches' games and winners -----------------------------------------------------

const MATCH =
  "the (first|second) match of the (first|second|third) round answered";

Then(
  new RegExp(
    `^the (first|second|third) game of ${MATCH} was won by the (first|second) side$`,
  ),
  function (
    this: SpecWorld,
    game: string,
    match: string,
    round: string,
    side: string,
  ) {
    assert.equal(
      matchAnswered(this, match, round).games[placeOf(game)]?.winner,
      placeOf(side),
    );
  },
);

Then(
  new RegExp(
    `^the (first|second) side scored "(.*)" in the (first|second|third) game of ${MATCH}$`,
  ),
  function (
    this: SpecWorld,
    side: string,
    score: string,
    game: string,
    match: string,
    round: string,
  ) {
    assert.equal(
      matchAnswered(this, match, round).games[placeOf(game)]?.scores[
        placeOf(side)
      ],
      score,
    );
  },
);

Then(
  new RegExp(
    `^(\\d+) games? of ${MATCH.slice(0, -" answered".length)} (?:is|are) answered$`,
  ),
  function (this: SpecWorld, count: string, match: string, round: string) {
    assert.equal(matchAnswered(this, match, round).games.length, Number(count));
  },
);

Then(
  new RegExp(`^${MATCH} was won by its (first|second) side$`),
  function (this: SpecWorld, match: string, round: string, side: string) {
    assert.equal(matchAnswered(this, match, round).winner, placeOf(side));
  },
);

Then(
  new RegExp(`^${MATCH} is not yet decided$`),
  function (this: SpecWorld, match: string, round: string) {
    assert.equal(matchAnswered(this, match, round).winner, undefined);
  },
);

// Its games in the order they were added ------------------------------------------

Then(
  /^the (first|second|third) game of the knockout answered was won by "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(answered(this).games[placeOf(which)]?.winner.name, name);
  },
);

Then(
  /^the (first|second|third) game of the knockout answered was added at "(.*)"$/,
  function (this: SpecWorld, which: string, at: string) {
    // As a moment, since a scenario writes it without the milliseconds.
    assert.equal(
      answered(this).games[placeOf(which)]?.addedAt?.toDate().getTime(),
      new Date(at).getTime(),
    );
  },
);

Then(
  /^(\d+) games? of the knockout (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).games.length, Number(count));
  },
);
