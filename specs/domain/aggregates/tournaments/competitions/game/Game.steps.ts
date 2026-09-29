import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Game } from "../../../../../../src/domain/aggregates/tournaments/competitions/Game.js";
import { CompetitionPlayerId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { GameId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { Website } from "../../../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { scenarioOf as competitionScenarioOf } from "../competition/aCompetition.js";

// What a game's features say: the players, by name, so that a name means the
// same player throughout; whether drawn games are allowed; and the game made,
// the one before it was changed, and another to compare it with. Kept here
// rather than on the world, which has no business knowing what a game is.
interface Scenario {
  readonly players: Map<string, CompetitionPlayerId>;
  drawsAllowed: boolean;
  game: Game | undefined;
  other: Game | undefined;
  same: boolean | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      players: new Map(),
      drawsAllowed: false,
      game: undefined,
      other: undefined,
      same: undefined,
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

const playerNamed = (world: SpecWorld, name: string): CompetitionPlayerId => {
  const { players } = scenarioOf(world);
  let id = players.get(name);
  if (id === undefined) {
    id = CompetitionPlayerId.create();
    players.set(name, id);
  }
  return id;
};

const nameOf = (world: SpecWorld, id: CompetitionPlayerId): string =>
  [...scenarioOf(world).players].find(([, each]) => each.equals(id))?.[0] ??
  "nobody";

// Made on Croquet Scores, whose marks are the ones a scenario here uses.
const made = (
  world: SpecWorld,
  winner: string,
  loser: string,
  winnerScore: string,
  loserScore: string,
  id: GameId = GameId.create(),
): Game =>
  Game.from(
    id,
    {
      winner: playerNamed(world, winner),
      winnerScore: Score.read(winnerScore, Website.croquetScores),
      loser: playerNamed(world, loser),
      loserScore: Score.read(loserScore, Website.croquetScores),
    },
    { drawsAllowed: scenarioOf(world).drawsAllowed },
  );

const gameOf = (world: SpecWorld): Game => {
  const { game } = scenarioOf(world);
  assert.ok(game !== undefined, `No game was made: ${inspect(world.failure)}`);
  return game;
};

// Said of a game and of a competition alike, since whether drawn games are
// allowed is what each is told by the tournament.
Given("drawn games are allowed", function (this: SpecWorld) {
  scenarioOf(this).drawsAllowed = true;
  const competition = competitionScenarioOf(this);
  competition.told = { ...competition.told, drawsAllowed: true };
});

When(
  /^a game of "([^"]*)" beating "([^"]*)" (\S+) to (\S+) is made$/,
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    try {
      scenarioOf(this).game = made(
        this,
        winner,
        loser,
        winnerScore,
        loserScore,
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Given(
  /^a game of "([^"]*)" beating "([^"]*)" (\S+) to (\S+)( that is archived)?$/,
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    archived: string | null,
  ) {
    const game = made(this, winner, loser, winnerScore, loserScore);
    scenarioOf(this).game = archived === null ? game : game.archive();
  },
);

Given(
  /^another game (with the same id )?of "([^"]*)" beating "([^"]*)" (\S+) to (\S+)$/,
  function (
    this: SpecWorld,
    sameId: string | null,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    scenarioOf(this).other = made(
      this,
      winner,
      loser,
      winnerScore,
      loserScore,
      sameId === null ? GameId.create() : gameOf(this).id,
    );
  },
);

When("the competition archives the game", function (this: SpecWorld) {
  scenarioOf(this).game = gameOf(this).archive();
});

When("the competition restores the game", function (this: SpecWorld) {
  scenarioOf(this).game = gameOf(this).restore();
});

When("the games are compared", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  scenario.same = gameOf(this).equals(scenario.other);
});

Then("the game's winner is {string}", function (this: SpecWorld, name: string) {
  assert.equal(nameOf(this, gameOf(this).winner), name);
});

Then("the game's loser is {string}", function (this: SpecWorld, name: string) {
  assert.equal(nameOf(this, gameOf(this).loser), name);
});

Then(
  "the game's winner's score is {int}",
  function (this: SpecWorld, points: number) {
    assert.equal(gameOf(this).winnerScore.points, points);
  },
);

Then(
  "the game's loser's score is {int}",
  function (this: SpecWorld, points: number) {
    assert.equal(gameOf(this).loserScore.points, points);
  },
);

Then(
  "the game's winner's score is written {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(String(gameOf(this).winnerScore), written);
  },
);

Then(
  "the game's winner's score is marked as the winner's",
  function (this: SpecWorld) {
    assert.equal(gameOf(this).winnerScore.marked, true);
  },
);

Then(
  "the game's winner's score is not marked as the winner's",
  function (this: SpecWorld) {
    assert.equal(gameOf(this).winnerScore.marked, false);
  },
);

When(
  /^the game is corrected to (\S+) to (\S+)$/,
  function (this: SpecWorld, winnerScore: string, loserScore: string) {
    const scenario = scenarioOf(this);
    try {
      scenario.game = gameOf(this).correct(
        Score.read(winnerScore, Website.croquetScores),
        Score.read(loserScore, Website.croquetScores),
        { drawsAllowed: scenario.drawsAllowed },
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then("the game is drawn", function (this: SpecWorld) {
  assert.equal(gameOf(this).drawn, true);
});

Then("the game is not drawn", function (this: SpecWorld) {
  assert.equal(gameOf(this).drawn, false);
});

Then("the game is archived", function (this: SpecWorld) {
  assert.equal(gameOf(this).archived, true);
});

Then("the game is not archived", function (this: SpecWorld) {
  assert.equal(gameOf(this).archived, false);
});

Then("they are the same game", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).same, true);
});

Then("they are different games", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).same, false);
});
