import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type CompetitionOfRanking,
  PublicRankingsOfTournament,
  type RankingsToRead,
  type ResultOfRanking,
  type WhyNoRankings,
} from "../../../../../src/application/operations/tournaments/PublicRankingsOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's games
// share (GamesOfTournament.steps.ts). What is here is asking, and what is the
// rankings' own: the competitions with a result, and each result.

const answered = (world: SpecWorld): RankingsToRead => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as RankingsToRead;
};

const competitionsOf = (world: SpecWorld): readonly CompetitionOfRanking[] => {
  const { rankings } = answered(world);
  assert.equal(rankings.is, "available", "The rankings are not available.");
  return rankings.is === "available" ? rankings.competitions : [];
};

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

// The results of the first competition, which is the one a scenario with
// results in a single competition is about.
const resultAnswered = (world: SpecWorld, which: string): ResultOfRanking => {
  const [competition] = competitionsOf(world);
  const result = competition?.results[placeOf(which)];
  assert.ok(result !== undefined, `No ${which} result was answered.`);
  return result;
};

// Asked with nobody signed in.
When(
  "the rankings of the tournament at {string} are asked for",
  async function (this: SpecWorld, address: string) {
    try {
      this.answer = await inHandOf(this).ask(
        new PublicRankingsOfTournament("croquetscores.com", address),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

// The tournament -------------------------------------------------------------------

Then(
  "the tournament answered starts on {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(answered(this).starts, day);
  },
);

Then(
  "the tournament answered finishes on {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(answered(this).finishes, day);
  },
);

Then(
  "the tournament answered is for the sport {string}",
  function (this: SpecWorld, sport: string) {
    assert.equal(answered(this).sport, sport);
  },
);

// Whether there are rankings ----------------------------------------------------------

Then("the rankings answered are available", function (this: SpecWorld) {
  assert.equal(answered(this).rankings.is, "available");
});

Then("the rankings answered are not available", function (this: SpecWorld) {
  assert.equal(answered(this).rankings.is, "not available");
});

// The reasons, in the words the feature says them in.
const reasons: Readonly<Record<string, WhyNoRankings>> = {
  "the sport": "sport",
  handicap: "handicap",
  "drawn games": "drawnGames",
  "its manager's choice": "notCounted",
};

Then(
  "the reason the rankings answered are not available is {string}",
  function (this: SpecWorld, reason: string) {
    const { rankings } = answered(this);
    assert.equal(rankings.is, "not available");
    assert.equal(
      rankings.is === "not available" ? rankings.because : undefined,
      reasons[reason],
    );
  },
);

// Its competitions ----------------------------------------------------------------------

// Where there are no rankings there are no competitions either.
Then("no competition is answered", function (this: SpecWorld) {
  const { rankings } = answered(this);
  assert.deepEqual(
    rankings.is === "available" ? rankings.competitions : [],
    [],
  );
});

Then(
  /^the (first|second|third) competition of the rankings answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(competitionsOf(this)[placeOf(which)]?.name, name);
  },
);

Then(
  /^the (first|second|third) competition of the rankings answered has (\d+) results?$/,
  function (this: SpecWorld, which: string, count: string) {
    assert.equal(
      competitionsOf(this)[placeOf(which)]?.results.length,
      Number(count),
    );
  },
);

// Its results ---------------------------------------------------------------------------

Then(
  /^the winner of the (first|second|third) result is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(resultAnswered(this, which).winner, name);
  },
);

Then(
  /^the loser of the (first|second|third) result is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(resultAnswered(this, which).loser, name);
  },
);

Then(
  /^the (first|second|third) result has (\d+) games?$/,
  function (this: SpecWorld, which: string, count: string) {
    assert.equal(resultAnswered(this, which).games.length, Number(count));
  },
);

Then(
  "the winner's score in the first game of the first result is {string}",
  function (this: SpecWorld, score: string) {
    assert.equal(resultAnswered(this, "first").games[0]?.winnerScore, score);
  },
);

Then(
  "the loser's score in the first game of the first result is {string}",
  function (this: SpecWorld, score: string) {
    assert.equal(resultAnswered(this, "first").games[0]?.loserScore, score);
  },
);
