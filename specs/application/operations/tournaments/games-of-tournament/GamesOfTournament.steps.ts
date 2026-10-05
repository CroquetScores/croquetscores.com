import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type GameOfTournament,
  GamesOfTournament,
  type TournamentGames,
} from "../../../../../src/application/operations/tournaments/GamesOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

const answered = (world: SpecWorld): TournamentGames => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as TournamentGames;
};

const places = ["first", "second", "third"];

const gameAnswered = (world: SpecWorld, which: string): GameOfTournament => {
  const game = answered(world).games[places.indexOf(which)];
  assert.ok(game !== undefined, `No ${which} game was answered.`);
  return game;
};

// Asked with nobody signed in.
const ask = async (
  world: SpecWorld,
  website: string,
  address: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new GamesOfTournament(website, address),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the games of the tournament at {string} are asked for",
  async function (this: SpecWorld, address: string) {
    await ask(this, "croquetscores.com", address);
  },
);

When(
  "the games of the tournament on {string} at {string} are asked for",
  async function (this: SpecWorld, website: string, address: string) {
    await ask(this, website, address);
  },
);

// The tournament ------------------------------------------------------------------

Then(
  "the tournament answered is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(answered(this).name, name);
  },
);

// Every query a tournament's page asks answers its notes as this one does, so
// the steps are shared.
Then(
  "the tournament answered has the notes {string}",
  function (this: SpecWorld, notes: string) {
    assert.equal(answered(this).notes, notes);
  },
);

Then("the tournament answered has no notes", function (this: SpecWorld) {
  assert.equal(answered(this).notes, undefined);
});

Then(
  /^the tournament answered is (not )?played by teams$/,
  function (this: SpecWorld, not: string | null) {
    assert.equal(
      (answered(this) as TournamentGames & { playedByTeams: boolean })
        .playedByTeams,
      not === null,
    );
  },
);

Then(
  "the tournament answered is found at {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(answered(this).address, address);
  },
);

Then(
  /^the (first|second|third) competition of the tournament answered is "(.*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.equal(
      answered(this).competitions[places.indexOf(which)]?.name,
      name,
    );
  },
);

Then(
  "the competition {string} is answered as found at {string}",
  function (this: SpecWorld, name: string, address: string) {
    const found = answered(this).competitions.find(
      (competition) => competition.name === name,
    );
    assert.ok(found !== undefined, `${name} is not answered.`);
    assert.equal(found.address, address);
  },
);

Then(
  "the competition {string} is not answered",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !answered(this).competitions.some(
        (competition) => competition.name === name,
      ),
      `${name} is answered.`,
    );
  },
);

// Its games ----------------------------------------------------------------------

Then(
  /^(\d+) games? (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(answered(this).games.length, Number(count));
  },
);

Then(
  /^the (first|second|third) game answered is of "(.*)" beating "(.*)"$/,
  function (this: SpecWorld, which: string, winner: string, loser: string) {
    const game = gameAnswered(this, which);
    assert.deepEqual([game.winner.name, game.loser.name], [winner, loser]);
  },
);

Then(
  /^the (first|second|third) game answered was won with "(.*)"$/,
  function (this: SpecWorld, which: string, score: string) {
    assert.equal(gameAnswered(this, which).winnerScore, score);
  },
);

Then(
  /^the (first|second|third) game answered was lost with "(.*)"$/,
  function (this: SpecWorld, which: string, score: string) {
    assert.equal(gameAnswered(this, which).loserScore, score);
  },
);

Then(
  /^the (first|second|third) game answered was played in "(.*)"$/,
  function (this: SpecWorld, which: string, competition: string) {
    assert.equal(gameAnswered(this, which).competition.name, competition);
  },
);

Then(
  /^the (first|second|third) game answered was added at "(.*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    assert.equal(
      gameAnswered(this, which).addedAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  /^the (first|second|third) game answered is (not )?drawn$/,
  function (this: SpecWorld, which: string, not: string | null) {
    assert.equal(gameAnswered(this, which).drawn, not === null);
  },
);

// Its players ----------------------------------------------------------------------

const playerOf = (world: SpecWorld, which: string, side: string) => {
  const game = gameAnswered(world, which);
  return side === "won" ? game.winner : game.loser;
};

Then(
  /^the (first|second|third) game answered was (won|lost) by a player representing "(.*)"$/,
  function (
    this: SpecWorld,
    which: string,
    side: string,
    representing: string,
  ) {
    assert.equal(playerOf(this, which, side).representing, representing);
  },
);

Then(
  /^the (first|second|third) game answered was (won|lost) by a player representing nothing$/,
  function (this: SpecWorld, which: string, side: string) {
    assert.equal(playerOf(this, which, side).representing, undefined);
  },
);

Then(
  /^the (first|second|third) game answered was (won|lost) by a player flying the flag "(.*)"$/,
  function (this: SpecWorld, which: string, side: string, flag: string) {
    assert.equal(playerOf(this, which, side).flag, flag);
  },
);
