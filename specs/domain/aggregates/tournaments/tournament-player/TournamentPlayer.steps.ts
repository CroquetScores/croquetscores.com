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
const AN_ORDER = 10_000;

// Making a player may be refused, and the scenario says which it expects.
const tryToMake = (
  world: SpecWorld,
  details: Partial<TournamentPlayerDetails>,
  order = AN_ORDER,
): void => {
  try {
    world.tournamentPlayer = TournamentPlayer.from(
      TournamentPlayerId.create(),
      {
        name: A_NAME,
        ...details,
      },
      order,
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
  this.tournamentPlayer = TournamentPlayer.from(
    TournamentPlayerId.create(),
    { name },
    AN_ORDER,
  );
});

Given(
  "a player named {string} in the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    this.tournamentPlayer = TournamentPlayer.from(
      TournamentPlayerId.create(),
      { name },
      order,
    );
  },
);

Given(
  "a player named {string} representing {string}",
  function (this: SpecWorld, name: string, representing: string) {
    this.tournamentPlayer = TournamentPlayer.from(
      TournamentPlayerId.create(),
      { name, representing },
      AN_ORDER,
    );
  },
);

Given(
  "a player named {string} who is archived",
  function (this: SpecWorld, name: string) {
    this.tournamentPlayer = TournamentPlayer.from(
      TournamentPlayerId.create(),
      { name },
      AN_ORDER,
    ).archive({ hasGames: false });
  },
);

Given("the tournament says the player has games", function (this: SpecWorld) {
  this.tournamentPlayerHasGames = true;
});

Given(
  "the tournament says the player has no games",
  function (this: SpecWorld) {
    this.tournamentPlayerHasGames = false;
  },
);

Given(
  "another player with the same id named {string}",
  function (this: SpecWorld, name: string) {
    this.otherTournamentPlayer = TournamentPlayer.from(
      playerOfWorld(this).id,
      { name },
      AN_ORDER,
    );
  },
);

Given(
  "another player named {string}",
  function (this: SpecWorld, name: string) {
    this.otherTournamentPlayer = TournamentPlayer.from(
      TournamentPlayerId.create(),
      { name },
      AN_ORDER,
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
  function (this: SpecWorld, representing: string) {
    tryToMake(this, { representing });
  },
);

When("a player representing nothing is made", function (this: SpecWorld) {
  tryToMake(this, { representing: undefined });
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

When(
  "a player in the order {float} is made",
  function (this: SpecWorld, order: number) {
    tryToMake(this, {}, order);
  },
);

// Changing a player may be refused, and the scenario says which it expects.
// The player as they were is kept, so that what they are afterwards can be
// compared with it.
const tryToChange = (
  world: SpecWorld,
  changing: (player: TournamentPlayer) => TournamentPlayer,
): void => {
  const player = playerOfWorld(world);
  world.tournamentPlayerBefore = player;
  try {
    world.tournamentPlayer = changing(player);
  } catch (failure) {
    world.failure = failure;
  }
};

// An update says everything about the player again, so what the scenario does
// not change is said as the player already has it.
const updatedWith = (
  world: SpecWorld,
  changed: Partial<TournamentPlayerDetails>,
): void => {
  tryToChange(world, (player) =>
    player.update({
      name: player.name.toString(),
      representing: player.representing,
      flag: player.flag === undefined ? undefined : String(player.flag),
      ...changed,
    }),
  );
};

When(
  "the player is updated to be called {string}",
  function (this: SpecWorld, name: string) {
    updatedWith(this, { name });
  },
);

When(
  "the player is updated to represent {string}",
  function (this: SpecWorld, representing: string) {
    updatedWith(this, { representing });
  },
);

When(
  "the player is updated to fly the flag {string}",
  function (this: SpecWorld, flag: string) {
    updatedWith(this, { flag });
  },
);

When("the tournament archives the player", function (this: SpecWorld) {
  const hasGames = this.tournamentPlayerHasGames;
  tryToChange(this, (player) => player.archive({ hasGames }));
});

When("the tournament restores the player", function (this: SpecWorld) {
  tryToChange(this, (player) => player.restore());
});

When(
  "the player is given the order {int}",
  function (this: SpecWorld, order: number) {
    tryToChange(this, (player) => player.withOrder(order));
  },
);

When(
  "the tournament asks whether the player can be moved",
  function (this: SpecWorld) {
    try {
      playerOfWorld(this).ensureMovable();
    } catch (failure) {
      this.failure = failure;
    }
  },
);

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
  function (this: SpecWorld, representing: string) {
    assert.equal(playerOfWorld(this).representing, representing);
  },
);

Then("the player represents nothing", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).representing, undefined);
});

Then(
  "the player flies the flag {string}",
  function (this: SpecWorld, flag: string) {
    assert.equal(String(playerOfWorld(this).flag), flag);
  },
);

Then("the player's order is {int}", function (this: SpecWorld, order: number) {
  assert.equal(playerOfWorld(this).order, order);
});

Then("the player flies no flag", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).flag, undefined);
});

Then("they are the same player", function (this: SpecWorld) {
  assert.equal(this.sameTournamentPlayer, true);
});

Then("they are different players", function (this: SpecWorld) {
  assert.equal(this.sameTournamentPlayer, false);
});

Then("the player is the same player they were", function (this: SpecWorld) {
  const before = this.tournamentPlayerBefore;
  assert.ok(before !== undefined, "The player was not changed.");
  assert.ok(playerOfWorld(this).equals(before));
});

Then("the tournament player is archived", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).archived, true);
});

Then("the tournament player is not archived", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).archived, false);
});
