import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  CompetitionPlayer,
  type CompetitionPlayerDetails,
} from "../../../../../../src/domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import { CompetitionPlayerId } from "../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { CarryForward } from "../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  COUNT,
  NUMBER,
  countCalled,
  pendingCounts,
} from "../value-objects/carry-forward/aCarryForward.js";

// What a scenario leaves unsaid. A scenario about one part of a player gives
// every other part as one that is well made, so that what is refused is only
// ever what the scenario named.
const A_FIRST_ORDER = 10000;

const make = (
  details: Partial<CompetitionPlayerDetails> = {},
  id: CompetitionPlayerId = CompetitionPlayerId.create(),
): CompetitionPlayer =>
  CompetitionPlayer.from(id, {
    tournamentPlayerId: TournamentPlayerId.create(),
    order: A_FIRST_ORDER,
    ...details,
  });

// Making or changing a player may be refused, and the scenario says which it
// expects.
const tryTo = (world: SpecWorld, act: () => CompetitionPlayer): void => {
  try {
    world.competitionPlayer = act();
  } catch (failure) {
    world.failure = failure;
  }
};

const playerOfWorld = (world: SpecWorld): CompetitionPlayer => {
  assert.ok(
    world.competitionPlayer !== undefined,
    `No player in a competition has been made: ${inspect(world.failure)}`,
  );
  return world.competitionPlayer;
};

const otherPlayerOfWorld = (world: SpecWorld): CompetitionPlayer => {
  assert.ok(
    world.otherCompetitionPlayer !== undefined,
    "No other player in the competition has been made.",
  );
  return world.otherCompetitionPlayer;
};

// A player is changed only through what can be done to them, so a scenario's
// withdrawn player got that way as any other would.
const withdrawn = (player: CompetitionPlayer): CompetitionPlayer =>
  player.withdraw();

// The player before they were given a carry forward, so that the one given it
// can be compared with who they were.
const before = new WeakMap<SpecWorld, CompetitionPlayer>();

Given(
  "the tournament player {string}",
  function (this: SpecWorld, written: string) {
    this.tournamentPlayerId = TournamentPlayerId.from(written);
  },
);

Given("a player in a competition", function (this: SpecWorld) {
  this.competitionPlayer = make();
});

Given(
  "a player in a competition who has withdrawn",
  function (this: SpecWorld) {
    this.competitionPlayer = withdrawn(make());
  },
);

Given(
  new RegExp(
    `^a player in a competition who carries forward ${COUNT} of ${NUMBER}$`,
  ),
  function (this: SpecWorld, count: string, value: string) {
    this.competitionPlayer = make().withCarryForward(
      CarryForward.from({ [countCalled(count)]: Number(value) }),
    );
  },
);

Given("a player in a competition who has games", function (this: SpecWorld) {
  this.competitionPlayer = make();
  this.competitionPlayerHasGames = true;
});

Given("a player in a competition who has no games", function (this: SpecWorld) {
  this.competitionPlayer = make();
  this.competitionPlayerHasGames = false;
});

Given("the player has no games", function (this: SpecWorld) {
  this.competitionPlayerHasGames = false;
});

Given(
  "a player in a competition with the order {int}",
  function (this: SpecWorld, order: number) {
    this.competitionPlayer = make({ order });
  },
);

Given(
  "another player in the competition with the same id and the order {int}",
  function (this: SpecWorld, order: number) {
    this.otherCompetitionPlayer = make({ order }, playerOfWorld(this).id);
  },
);

Given(
  "a player in a competition for the tournament player {string}",
  function (this: SpecWorld, written: string) {
    this.competitionPlayer = make({
      tournamentPlayerId: TournamentPlayerId.from(written),
    });
  },
);

Given(
  "another player in the competition for the tournament player {string}",
  function (this: SpecWorld, written: string) {
    this.otherCompetitionPlayer = make({
      tournamentPlayerId: TournamentPlayerId.from(written),
    });
  },
);

// "a competition with no players" is the competition's own step
// (Competition.steps.ts), which begins these players empty as well.

Given(
  "a competition with a player in the order {int}",
  function (this: SpecWorld, order: number) {
    this.competitionPlayers = [make({ order })];
  },
);

Given("a player in the order {int}", function (this: SpecWorld, order: number) {
  this.competitionPlayers.push(make({ order }));
});

Given(
  "a player in the order {int} who has withdrawn",
  function (this: SpecWorld, order: number) {
    this.competitionPlayers.push(withdrawn(make({ order })));
  },
);

When("a player in a competition is made", function (this: SpecWorld) {
  tryTo(this, () => make());
});

When("a player in a competition is made for them", function (this: SpecWorld) {
  const tournamentPlayerId = this.tournamentPlayerId;
  assert.ok(tournamentPlayerId !== undefined, "No tournament player is named.");
  tryTo(this, () => make({ tournamentPlayerId }));
});

When(
  "a player in a competition with the order {float} is made",
  function (this: SpecWorld, order: number) {
    tryTo(this, () => make({ order }));
  },
);

When("the order after every player is found", function (this: SpecWorld) {
  this.orderFound = CompetitionPlayer.orderAfter(this.competitionPlayers);
});

When("the player withdraws", function (this: SpecWorld) {
  const player = playerOfWorld(this);
  tryTo(this, () => player.withdraw());
});

When("the player is given the carry forward", function (this: SpecWorld) {
  const player = playerOfWorld(this);
  before.set(this, player);
  tryTo(this, () =>
    player.withCarryForward(CarryForward.from(pendingCounts(this))),
  );
});

When("the player's withdrawal is reversed", function (this: SpecWorld) {
  const player = playerOfWorld(this);
  tryTo(this, () => player.reverseWithdrawal());
});

// Asking changes nothing, so the player asked about is the one kept.
When(
  "the competition asks whether the player can be removed",
  function (this: SpecWorld) {
    const player = playerOfWorld(this);
    const hasGames = this.competitionPlayerHasGames;
    tryTo(this, () => {
      player.ensureRemovable({ hasGames });
      return player;
    });
  },
);

When(
  "the competition asks whether the player can be removed as archived",
  function (this: SpecWorld) {
    const player = playerOfWorld(this);
    const hasGames = this.competitionPlayerHasGames;
    tryTo(this, () => {
      player.ensureRemovableAsArchived({ hasGames });
      return player;
    });
  },
);

When("the players in the competition are compared", function (this: SpecWorld) {
  this.sameCompetitionPlayer = playerOfWorld(this).equals(
    otherPlayerOfWorld(this),
  );
});

Then(
  "the player in the competition is the tournament player {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(String(playerOfWorld(this).tournamentPlayerId), written);
  },
);

Then(
  "the player's order in the competition is {int}",
  function (this: SpecWorld, order: number) {
    assert.equal(playerOfWorld(this).order, order);
  },
);

Then("the order found is {int}", function (this: SpecWorld, order: number) {
  assert.equal(this.orderFound, order);
});

Then("the player has withdrawn", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).withdrawn, true);
});

Then("the player has not withdrawn", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).withdrawn, false);
});

Then("the player carries nothing forward", function (this: SpecWorld) {
  assert.equal(playerOfWorld(this).carryForward.carriesAnything, false);
});

Then(
  new RegExp(`^the player carries forward ${COUNT} of ${NUMBER}$`),
  function (this: SpecWorld, count: string, value: string) {
    assert.equal(
      playerOfWorld(this).carryForward.of(countCalled(count)),
      Number(value),
    );
  },
);

Then(
  new RegExp(`^the player carries forward nothing in ${COUNT}$`),
  function (this: SpecWorld, count: string) {
    assert.equal(
      playerOfWorld(this).carryForward.of(countCalled(count)),
      undefined,
    );
  },
);

Then(
  "the player is the same player in the competition they were",
  function (this: SpecWorld) {
    const was = before.get(this);
    assert.ok(was !== undefined, "The player was given no carry forward.");
    assert.equal(playerOfWorld(this).equals(was), true);
  },
);

Then("they are the same player in the competition", function (this: SpecWorld) {
  assert.equal(this.sameCompetitionPlayer, true);
});

Then(
  "they are different players in the competition",
  function (this: SpecWorld) {
    assert.equal(this.sameCompetitionPlayer, false);
  },
);
