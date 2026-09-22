import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  TournamentPlayer,
  type TournamentPlayerDetails,
} from "../../../../../src/domain/aggregates/tournaments/TournamentPlayer.js";
import { TournamentPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a scenario leaves unsaid. A scenario about one part of a player gives
// every other part as nothing, or as a name that is well made, so that what is
// refused is only ever what the scenario named.
const A_NAME = "Sam Someone";

// Making a player may be refused, and the scenario says which it expects.
const tryToMake = (
  world: SpecWorld,
  details: Partial<TournamentPlayerDetails>,
): void => {
  try {
    world.tournamentPlayer = TournamentPlayer.from(
      TournamentPlayerId.create(),
      {
        name: A_NAME,
        ...details,
      },
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const playerOfWorld = (world: SpecWorld): TournamentPlayer => {
  assert.ok(
    world.tournamentPlayer !== undefined,
    `No player has been made: ${inspect(world.failure)}`,
  );
  return world.tournamentPlayer;
};

const otherPlayerOfWorld = (world: SpecWorld): TournamentPlayer => {
  assert.ok(
    world.otherTournamentPlayer !== undefined,
    "No other player has been made.",
  );
  return world.otherTournamentPlayer;
};

Given("a player named {string}", function (this: SpecWorld, name: string) {
  this.tournamentPlayer = TournamentPlayer.from(TournamentPlayerId.create(), {
    name,
  });
});

Given(
  "another player with the same id named {string}",
  function (this: SpecWorld, name: string) {
    this.otherTournamentPlayer = TournamentPlayer.from(playerOfWorld(this).id, {
      name,
    });
  },
);

Given(
  "another player named {string}",
  function (this: SpecWorld, name: string) {
    this.otherTournamentPlayer = TournamentPlayer.from(
      TournamentPlayerId.create(),
      { name },
    );
  },
);

When(
  "a player named {string} is made",
  function (this: SpecWorld, name: string) {
    tryToMake(this, { name });
  },
);

When(
  "a player representing {string} is made",
  function (this: SpecWorld, represents: string) {
    tryToMake(this, { represents });
  },
);

When("a player representing nothing is made", function (this: SpecWorld) {
  tryToMake(this, { represents: undefined });
});

When(
  "a player flying the flag {string} is made",
  function (this: SpecWorld, flag: string) {
    tryToMake(this, { flag });
  },
);

When("a player flying no flag is made", function (this: SpecWorld) {
  tryToMake(this, { flag: undefined });
});

When("the players are compared", function (this: SpecWorld) {
  this.sameTournamentPlayer = playerOfWorld(this).equals(
    otherPlayerOfWorld(this),
  );
});

Then("the player's name is {string}", function (this: SpecWorld, name: string) {
  assert.equal(String(playerOfWorld(this).name), name);
});

Then(
  "the player represents {string}",
  function (this: SpecWorld, represents: string) {
    assert.equal(playerOfWorld(this).represents, represents);
  },
);

Then("the player represents nothing", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).represents, undefined);
});

Then(
  "the player flies the flag {string}",
  function (this: SpecWorld, flag: string) {
    assert.equal(String(playerOfWorld(this).flag), flag);
  },
);

Then("the player flies no flag", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).flag, undefined);
});

Then("they are the same player", function (this: SpecWorld) {
  assert.equal(this.sameTournamentPlayer, true);
});

Then("they are different players", function (this: SpecWorld) {
  assert.equal(this.sameTournamentPlayer, false);
});
