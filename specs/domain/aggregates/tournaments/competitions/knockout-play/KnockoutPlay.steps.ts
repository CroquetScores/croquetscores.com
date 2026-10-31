import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CompetitionPlayer } from "../../../../../../src/domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import { Game } from "../../../../../../src/domain/aggregates/tournaments/competitions/Game.js";
import {
  drawnAgainst,
  isPlayer,
  knockoutPlay,
  losersOfRound,
  type Loser,
  type Match,
} from "../../../../../../src/domain/aggregates/tournaments/competitions/KnockoutPlay.js";
import { CompetitionPlayerId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { GameId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { KnockoutDraw } from "../../../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { Website } from "../../../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a knockout's play is worked out from: its draw, its players by name in
// the order drawn, those withdrawn in the order they withdrew, and its games;
// and the matches worked out. Kept here rather
// than on the world, which has no business knowing what a knockout is.
interface Scenario {
  draw: KnockoutDraw | undefined;
  readonly players: Map<string, CompetitionPlayer>;
  readonly withdrawals: CompetitionPlayerId[];
  readonly games: Game[];
  play: readonly Match[] | undefined;
  losers: readonly Loser[] | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      draw: undefined,
      players: new Map(),
      withdrawals: [],
      games: [],
      play: undefined,
      losers: undefined,
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

const drawnPlayer = (world: SpecWorld, name: string): CompetitionPlayer => {
  const player = scenarioOf(world).players.get(name);
  assert.ok(player !== undefined, `"${name}" is not drawn.`);
  return player;
};

const playOf = (world: SpecWorld): readonly Match[] => {
  const { play } = scenarioOf(world);
  assert.ok(play !== undefined, "The knockout was not played out.");
  return play;
};

// Rounds and places are spoken of as ordinals, as people say them, and counted
// from 0 in the code.
const ordinals = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
];

const ordinal = (word: string): number => {
  const index = ordinals.indexOf(word);
  assert.ok(index >= 0, `"${word}" is not an ordinal the steps know.`);
  return index;
};

const loserAt = (world: SpecWorld, word: string): Loser => {
  const { losers } = scenarioOf(world);
  assert.ok(losers !== undefined, "The losers were not read.");
  const loser = losers[ordinal(word)];
  assert.ok(loser !== undefined, `There is no ${word} loser.`);
  return loser;
};

// The final is the last match worked out, since the rounds come in order.
const finalOf = (world: SpecWorld): Match => {
  const final = playOf(world).at(-1);
  assert.ok(final !== undefined, "The knockout has no matches.");
  return final;
};

Given(
  "a knockout draw of {int} places, each round the best of {int}",
  function (this: SpecWorld, places: number, games: number) {
    scenarioOf(this).draw = KnockoutDraw.from(
      places,
      Array.from({ length: Math.log2(places) }, () => games),
    );
  },
);

Given(
  "{string} is drawn in the next place",
  function (this: SpecWorld, name: string) {
    const { players } = scenarioOf(this);
    players.set(
      name,
      CompetitionPlayer.from(CompetitionPlayerId.create(), {
        tournamentPlayerId: TournamentPlayerId.create(),
        order: (players.size + 1) * 10_000,
      }),
    );
  },
);

Given("{string} is not drawn", function (this: SpecWorld, name: string) {
  drawnPlayer(this, name);
  scenarioOf(this).players.delete(name);
});

Given(
  "the drawn player {string} has withdrawn",
  function (this: SpecWorld, name: string) {
    const player = drawnPlayer(this, name);
    scenarioOf(this).players.set(name, player.withdraw());
    scenarioOf(this).withdrawals.push(player.id);
  },
);

Given(
  "{string} beat {string} in the knockout",
  function (this: SpecWorld, winner: string, loser: string) {
    scenarioOf(this).games.push(
      Game.from(
        GameId.create(),
        {
          winner: drawnPlayer(this, winner).id,
          winnerScore: Score.read("26", Website.croquetScores),
          loser: drawnPlayer(this, loser).id,
          loserScore: Score.read("17", Website.croquetScores),
        },
        { drawsAllowed: false },
      ),
    );
  },
);

When("the knockout is played out", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  assert.ok(scenario.draw !== undefined, "No draw was given.");
  scenario.play = knockoutPlay(
    scenario.draw,
    [...scenario.players.values()],
    scenario.withdrawals,
    scenario.games,
  );
});

Then(
  "the knockout is won by {string}",
  function (this: SpecWorld, name: string) {
    const { winner } = finalOf(this);
    const id = drawnPlayer(this, name).id;
    assert.ok(
      winner.is === "player" && winner.player.id.equals(id),
      `The knockout is won by ${winner.is}.`,
    );
  },
);

Then(
  "{string} goes through their match with {string}",
  function (this: SpecWorld, winner: string, loser: string) {
    const winnerId = drawnPlayer(this, winner).id;
    const loserId = drawnPlayer(this, loser).id;
    const theirs = playOf(this).find(
      (match) =>
        match.sides.some((side) => isPlayer(side, winnerId)) &&
        match.sides.some((side) => isPlayer(side, loserId)),
    );
    assert.ok(
      theirs !== undefined,
      "These players are not currently drawn to play each other in the knockout.",
    );
    assert.ok(
      isPlayer(theirs.winner, winnerId),
      `Their match goes to ${theirs.winner.is === "player" ? "the other" : theirs.winner.is}.`,
    );
  },
);

Then("nobody wins the knockout", function (this: SpecWorld) {
  assert.equal(finalOf(this).winner.is, "nobody");
});

Then("the knockout's winner is not yet known", function (this: SpecWorld) {
  assert.equal(finalOf(this).winner.is, "not yet known");
});

Then(
  "the game of {string} beating {string} counts",
  function (this: SpecWorld, winner: string, loser: string) {
    const winnerId = drawnPlayer(this, winner).id;
    const loserId = drawnPlayer(this, loser).id;
    assert.ok(
      playOf(this).some((match) =>
        match.games.some(
          (game) => game.winner.equals(winnerId) && game.loser.equals(loserId),
        ),
      ),
      "The game counts in none of the knockout's matches.",
    );
  },
);

Then(
  "{string} is drawn against {string}",
  function (this: SpecWorld, name: string, other: string) {
    const against = drawnAgainst(playOf(this), drawnPlayer(this, name).id);
    assert.ok(
      against?.id.equals(drawnPlayer(this, other).id),
      `${name} is drawn against ${against === undefined ? "nobody" : "another"}.`,
    );
  },
);

Then(
  "{string} is drawn against nobody",
  function (this: SpecWorld, name: string) {
    assert.equal(
      drawnAgainst(playOf(this), drawnPlayer(this, name).id),
      undefined,
    );
  },
);

When(
  "the losers of the {word} round are read",
  function (this: SpecWorld, round: string) {
    scenarioOf(this).losers = losersOfRound(playOf(this), ordinal(round));
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh|eighth) loser is "([^"]*)"$/,
  function (this: SpecWorld, place: string, name: string) {
    const loser = loserAt(this, place);
    assert.ok(
      loser.is === "player" &&
        loser.player.id.equals(drawnPlayer(this, name).id),
      `The ${place} loser is ${loser.is}.`,
    );
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh|eighth) loser is a bye$/,
  function (this: SpecWorld, place: string) {
    assert.equal(loserAt(this, place).is, "bye");
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh|eighth) loser is not yet known$/,
  function (this: SpecWorld, place: string) {
    assert.equal(loserAt(this, place).is, "not yet known");
  },
);
