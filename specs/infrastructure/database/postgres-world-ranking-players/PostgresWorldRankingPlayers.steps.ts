// Keeping the world ranking players in Postgres
// (PostgresWorldRankingPlayers.feature). Each replacing is made as a request
// would make it, in a transaction of its own on the scenario's unit of work;
// what was kept is read from a connection of its own
// (specs/infrastructure/support/worldRankings.ts).
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { PostgresWorldRankingPlayers } from "../../../../src/infrastructure/database/PostgresWorldRankingPlayers.js";
import type { SpecWorld } from "../../../support/world.js";
import { meetingOfTwo, unitOfWorkOf } from "../../support/transactions.js";
import { namesKept, SPORT, sportCalled } from "../../support/worldRankings.js";

interface Keeping {
  readonly store: PostgresWorldRankingPlayers;
  // What came of the replacings made at once.
  refusals?: unknown[];
  // What was read on another connection, and which sport's it was.
  readElsewhere?: { sport: string; names: string[] };
}

const keepings = new WeakMap<SpecWorld, Keeping>();

const keepingOf = (world: SpecWorld): Keeping => {
  const found = keepings.get(world);
  assert.ok(found !== undefined, "The world ranking players are not stood up.");
  return found;
};

Given("the application's world ranking players", function (this: SpecWorld) {
  keepings.set(this, {
    store: new PostgresWorldRankingPlayers(unitOfWorkOf(this)),
  });
});

const replaced = async (
  world: SpecWorld,
  sport: string,
  names: readonly string[],
): Promise<void> => {
  const { store } = keepingOf(world);
  await unitOfWorkOf(world).inTransaction(() =>
    store.replace(sportCalled(sport), names),
  );
};

Given(
  new RegExp(`^the ${SPORT} players have been replaced with "([^"]*)"$`),
  async function (this: SpecWorld, sport: string, name: string) {
    await replaced(this, sport, [name]);
  },
);

When(
  new RegExp(`^the ${SPORT} players are replaced with "([^"]*)"$`),
  async function (this: SpecWorld, sport: string, name: string) {
    await replaced(this, sport, [name]);
  },
);

When(
  new RegExp(`^the ${SPORT} players are replaced with "([^"]*)" twice$`),
  async function (this: SpecWorld, sport: string, name: string) {
    await replaced(this, sport, [name, name]);
  },
);

// Each in a transaction of its own, both underway before either replaces
// anything, so that they are at once rather than one after the other.
When(
  new RegExp(
    `^the ${SPORT} players are replaced with "([^"]*)" and with "([^"]*)" at once$`,
  ),
  async function (this: SpecWorld, sport: string, one: string, other: string) {
    const keeping = keepingOf(this);
    const unitOfWork = unitOfWorkOf(this);
    const meet = meetingOfTwo();
    const settled = await Promise.allSettled(
      [one, other].map((name) =>
        unitOfWork.inTransaction(async () => {
          await meet();
          await keeping.store.replace(sportCalled(sport), [name]);
        }),
      ),
    );
    keeping.refusals = settled
      .filter((each) => each.status === "rejected")
      .map((each) => each.reason as unknown);
  },
);

Then("neither replacing was refused", function (this: SpecWorld) {
  assert.deepEqual(keepingOf(this).refusals, []);
});

// Replaced in a transaction left open until the scenario is over, so that
// what is read meanwhile is read while it is under way. Let go of before the
// database is dropped, since the transaction holds a connection of its pool.
Given(
  new RegExp(`^the ${SPORT} players are being replaced with "([^"]*)"$`),
  async function (this: SpecWorld, sport: string, name: string) {
    const { store } = keepingOf(this);
    let letGo = (): void => {};
    const over = new Promise<void>((resolve) => {
      letGo = resolve;
    });
    let underway = (): void => {};
    const replacing = new Promise<void>((resolve) => {
      underway = resolve;
    });
    const transaction = unitOfWorkOf(this).inTransaction(async () => {
      await store.replace(sportCalled(sport), [name]);
      underway();
      await over;
    });
    this.closeBeforeDropping.unshift(async () => {
      letGo();
      await transaction;
    });
    await Promise.race([replacing, transaction]);
  },
);

When(
  new RegExp(`^the ${SPORT} players are read on another connection$`),
  async function (this: SpecWorld, sport: string) {
    keepingOf(this).readElsewhere = {
      sport,
      names: await namesKept(this, sportCalled(sport)),
    };
  },
);

Then(
  new RegExp(`^"([^"]*)" is among the ${SPORT} players read$`),
  function (this: SpecWorld, name: string, sport: string) {
    const read = keepingOf(this).readElsewhere;
    assert.equal(read?.sport, sport, "Another sport's players were read.");
    assert.ok(read.names.includes(name), `Read ${inspect(read)}.`);
  },
);
