import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TeamPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { TeamPlayer } from "../../../../../src/domain/aggregates/tournaments/TeamPlayer.js";
import { Slug } from "../../../../../src/domain/common/Slug.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a scenario leaves unsaid of a player in a team: a name that is well
// made, and an order, so that what is refused is only ever what the scenario
// named.
const A_NAME = "Sam Someone";
const AN_ORDER = 10_000;
// Where a player is found is the tournament's to say, and nothing here asks.
const A_SLUG = Slug.from("a-player");

interface Scenario {
  player: TeamPlayer | undefined;
  before: TeamPlayer | undefined;
  other: TeamPlayer | undefined;
  // Whether the tournament says the player has games.
  hasGames: boolean;
}

// Kept here rather than on the world, which has no business knowing what a
// player in a team is.
const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      player: undefined,
      before: undefined,
      other: undefined,
      hasGames: false,
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// Making a player may be refused, and the scenario says which it expects.
const tryToMake = (world: SpecWorld, name: string, order = AN_ORDER): void => {
  try {
    scenarioOf(world).player = TeamPlayer.from(
      TeamPlayerId.create(),
      { name },
      { slug: A_SLUG, order },
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const playerOfWorld = (world: SpecWorld): TeamPlayer => {
  const { player } = scenarioOf(world);
  assert.ok(
    player !== undefined,
    `No player has been made: ${inspect(world.failure)}`,
  );
  return player;
};

// Changing a player may be refused too. The player as they were is kept, so
// that what they became can be compared with them.
const tryToChange = (
  world: SpecWorld,
  changing: (player: TeamPlayer) => TeamPlayer,
): void => {
  const scenario = scenarioOf(world);
  const player = playerOfWorld(world);
  scenario.before = player;
  try {
    scenario.player = changing(player);
  } catch (failure) {
    world.failure = failure;
  }
};

Given("a team player named {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).player = TeamPlayer.from(
    TeamPlayerId.create(),
    { name },
    { slug: A_SLUG, order: AN_ORDER },
  );
});

Given(
  "a team player named {string} in the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    scenarioOf(this).player = TeamPlayer.from(
      TeamPlayerId.create(),
      { name },
      { slug: A_SLUG, order },
    );
  },
);

Given(
  "a team player named {string} who is archived",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).player = TeamPlayer.from(
      TeamPlayerId.create(),
      { name },
      { slug: A_SLUG, order: AN_ORDER },
    ).archive({ hasGames: false });
  },
);

Given(
  "another team player with the same id named {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).other = TeamPlayer.from(
      playerOfWorld(this).id,
      { name },
      { slug: A_SLUG, order: AN_ORDER },
    );
  },
);

Given(
  "another team player named {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).other = TeamPlayer.from(
      TeamPlayerId.create(),
      { name },
      { slug: A_SLUG, order: AN_ORDER },
    );
  },
);

Given(
  "the tournament says the team player has games",
  function (this: SpecWorld) {
    scenarioOf(this).hasGames = true;
  },
);

Given(
  "the tournament says the team player has no games",
  function (this: SpecWorld) {
    scenarioOf(this).hasGames = false;
  },
);

When(
  "a team player named {string} is made",
  function (this: SpecWorld, name: string) {
    tryToMake(this, name);
  },
);

When(
  "a team player in the order {float} is made",
  function (this: SpecWorld, order: number) {
    tryToMake(this, A_NAME, order);
  },
);

When(
  "the team player is given the order {int}",
  function (this: SpecWorld, order: number) {
    tryToChange(this, (player) => player.withOrder(order));
  },
);

When(
  "the team player is updated to be called {string}",
  function (this: SpecWorld, name: string) {
    tryToChange(this, (player) => player.update({ name }));
  },
);

When("the tournament archives the team player", function (this: SpecWorld) {
  const { hasGames } = scenarioOf(this);
  tryToChange(this, (player) => player.archive({ hasGames }));
});

When("the tournament restores the team player", function (this: SpecWorld) {
  tryToChange(this, (player) => player.restore());
});

When(
  "the tournament asks whether the team player can be moved",
  function (this: SpecWorld) {
    tryToChange(this, (player) => {
      player.ensureInUse();
      return player;
    });
  },
);

// The same steps a tournament's players are compared with
// (`TournamentPlayer.steps.ts`) say what the comparison came to.
When("the team players are compared", function (this: SpecWorld) {
  const { other } = scenarioOf(this);
  assert.ok(other !== undefined, "No other player has been made.");
  this.sameTournamentPlayer = playerOfWorld(this).equals(other);
});

Then(
  "the team player's name is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(String(playerOfWorld(this).name), name);
  },
);

Then(
  "the team player's order is {int}",
  function (this: SpecWorld, order: number) {
    assert.equal(playerOfWorld(this).order, order);
  },
);

// A player in a team has no flag and represents nothing of their own, so
// there is nothing to ask either of.
Then("the team player flies no flag", function (this: SpecWorld) {
  assert.equal("flag" in playerOfWorld(this), false);
});

Then(
  "the team player represents nothing of their own",
  function (this: SpecWorld) {
    assert.equal("representing" in playerOfWorld(this), false);
  },
);

Then("the team player is archived", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).archived, true);
});

Then("the team player is not archived", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).archived, false);
});

Then(
  "the team player is the same player they were",
  function (this: SpecWorld) {
    const { before } = scenarioOf(this);
    assert.ok(before !== undefined, "The player was not changed.");
    assert.ok(playerOfWorld(this).equals(before));
  },
);
