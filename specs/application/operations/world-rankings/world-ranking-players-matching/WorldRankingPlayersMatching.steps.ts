// Finding the world ranking players a name typed may be
// (WorldRankingPlayersMatching.feature), through the mediator "the
// application's finding of world ranking players" stands up. What was found,
// or what finding it was refused with, is kept as everything the mediator
// answers is.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type PlayersMatching,
  WorldRankingPlayersMatching,
} from "../../../../../src/application/operations/world-rankings/WorldRankingPlayersMatching.js";
import { Refused } from "../../../../../src/domain/common/Refused.js";
import type { SpecWorld } from "../../../../support/world.js";
import { keepingWhatCameOf } from "../../accounts/roleRequests.js";

const finding = async (
  world: SpecWorld,
  sport: string,
  typed: string,
): Promise<void> => {
  const { mediator } = world;
  assert.ok(
    mediator !== undefined,
    "Finding world ranking players is not stood up.",
  );
  await keepingWhatCameOf(world, () =>
    mediator.query(new WorldRankingPlayersMatching(sport, typed)),
  );
};

const found = (world: SpecWorld): PlayersMatching => {
  assert.equal(world.failure, undefined, "Finding them was refused.");
  return world.answer as PlayersMatching;
};

When(
  /^the (association croquet|golf croquet) players matching "([^"]*)" are found$/,
  async function (this: SpecWorld, sport: string, typed: string) {
    await finding(this, sport === "association croquet" ? "ac" : "gc", typed);
  },
);

When(
  "the players matching {string} are found for the sport {string}",
  async function (this: SpecWorld, typed: string, sport: string) {
    await finding(this, sport, typed);
  },
);

Then(
  "{string} is among the players found",
  function (this: SpecWorld, name: string) {
    const { players } = found(this);
    assert.ok(players.includes(name), `Found ${inspect(players)}.`);
  },
);

Then(
  "{string} is not among the players found",
  function (this: SpecWorld, name: string) {
    const { players } = found(this);
    assert.ok(!players.includes(name), `Found ${inspect(players)}.`);
  },
);

Then("nobody is found", function (this: SpecWorld) {
  assert.deepEqual(found(this).players, []);
});

// The names found, whichever was asked: the world ranking players a name may
// be or what players represent (RepresentingMatching.feature), whose scenarios
// say "the first found" and "are found" in the same words.
const namesFound = (world: SpecWorld): readonly string[] => {
  assert.equal(world.failure, undefined, "Finding them was refused.");
  const answer = world.answer as
    PlayersMatching | { readonly representing: readonly string[] };
  return "players" in answer ? answer.players : answer.representing;
};

Then("the first found is {string}", function (this: SpecWorld, name: string) {
  assert.equal(namesFound(this)[0], name);
});

Then("{int} are found", function (this: SpecWorld, count: number) {
  assert.equal(namesFound(this).length, count);
});

Then("the name is known", function (this: SpecWorld) {
  assert.equal(found(this).known, true);
});

Then("the name is not known", function (this: SpecWorld) {
  assert.equal(found(this).known, false);
});

Then(
  "finding them is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.ok(
      this.failure instanceof Refused,
      `Expected a refusal, and got ${inspect(this.failure ?? this.answer)}.`,
    );
    assert.equal(this.failure.code, code);
  },
);
