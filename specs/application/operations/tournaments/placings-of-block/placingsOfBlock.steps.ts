import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  placePlayers,
  type PlacedPlayers,
  type PlayerToPlace,
} from "../../../../../src/application/operations/tournaments/placingsOfBlock.js";
import { TieBreak } from "../../../../../src/domain/aggregates/tournaments/value-objects/TieBreak.js";
import type { SpecWorld } from "../../../../support/world.js";

// The players a scenario names and what is said of each, in the order they were
// named, which is the block's order; the matches decided among them; and what
// they were placed as.
interface Scenario {
  bestOf: number;
  readonly players: PlayerToPlace[];
  readonly matches: { winner: string; loser: string }[];
  placed: PlacedPlayers | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = { bestOf: 1, players: [], matches: [], placed: undefined };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// A player is named by the name the scenario gave them, which is all a
// player is here.
const playerNamed = (world: SpecWorld, name: string): PlayerToPlace => {
  const found = scenarioOf(world).players.find(({ id }) => id === name);
  assert.ok(found !== undefined, `The scenario has no player ${name}.`);
  return found;
};

// A player with `change` made to them, in the place they were.
const changed = (
  world: SpecWorld,
  name: string,
  change: Partial<PlayerToPlace>,
): void => {
  const { players } = scenarioOf(world);
  players[players.indexOf(playerNamed(world, name))] = {
    ...playerNamed(world, name),
    ...change,
  };
};

const placedOf = (world: SpecWorld): PlacedPlayers => {
  const { placed } = scenarioOf(world);
  assert.ok(placed !== undefined, "The players have not been placed.");
  return placed;
};

const ORDINALS = ["first", "second", "third", "fourth", "fifth"];

Given(
  "the block is the best of {int}",
  function (this: SpecWorld, games: number) {
    scenarioOf(this).bestOf = games;
  },
);

Given("the player {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).players.push({
    id: name,
    withdrawn: false,
    matchesWon: 0,
    matchesLost: 0,
    netGames: 0,
    netHoops: 0,
  });
});

Given(
  "{string} has won {int} match(es)",
  function (this: SpecWorld, name: string, matches: number) {
    changed(this, name, { matchesWon: matches });
  },
);

Given(
  "{string} has lost {int} match(es)",
  function (this: SpecWorld, name: string, matches: number) {
    changed(this, name, { matchesLost: matches });
  },
);

Given(
  "{string} has net games of {int}",
  function (this: SpecWorld, name: string, games: number) {
    changed(this, name, { netGames: games });
  },
);

Given(
  "{string} has net hoops of {int}",
  function (this: SpecWorld, name: string, hoops: number) {
    changed(this, name, { netHoops: hoops });
  },
);

Given("{string} has withdrawn", function (this: SpecWorld, name: string) {
  changed(this, name, { withdrawn: true });
});

Given(
  "{string} has beaten {string} in a match",
  function (this: SpecWorld, winner: string, loser: string) {
    scenarioOf(this).matches.push({ winner, loser });
  },
);

When("the players are placed", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  assert.ok(this.tieBreak !== undefined, "The scenario named no tie break.");
  scenario.placed = placePlayers(
    scenario.players,
    scenario.matches,
    this.tieBreak ?? TieBreak.unlessTold,
    scenario.bestOf,
  );
});

Then(
  "the {word} player placed is {string}",
  function (this: SpecWorld, ordinal: string, name: string) {
    assert.equal(placedOf(this).ranked[ORDINALS.indexOf(ordinal)], name);
  },
);

Then(
  "the place of {string} is {int}",
  function (this: SpecWorld, name: string, place: number) {
    assert.equal(placedOf(this).placings.get(name)?.place, place);
  },
);

Then(
  "the place of {string} is shared",
  function (this: SpecWorld, name: string) {
    assert.equal(placedOf(this).placings.get(name)?.shared, true);
  },
);

Then(
  "the place of {string} is not shared",
  function (this: SpecWorld, name: string) {
    assert.equal(placedOf(this).placings.get(name)?.shared, false);
  },
);

Then("{string} has no place", function (this: SpecWorld, name: string) {
  assert.equal(placedOf(this).placings.get(name), undefined);
});

Then("some players are level on matches won", function (this: SpecWorld) {
  assert.equal(placedOf(this).levelOnMatchesWon, true);
});

Then("no players are level on matches won", function (this: SpecWorld) {
  assert.equal(placedOf(this).levelOnMatchesWon, false);
});
