// Keeping the world ranking players in Postgres
// (PostgresWorldRankingPlayers.feature). Each keeping is made as a request
// would make it, in a transaction of its own on the scenario's unit of work;
// what was kept is read from a connection of its own
// (specs/infrastructure/support/worldRankings.ts).
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type AssociationCroquetPlayer,
  ListRefused,
  NameTakenRefused,
} from "../../../../src/application/services/WorldRankingLists.js";
import { PostgresWorldRankingPlayers } from "../../../../src/infrastructure/database/PostgresWorldRankingPlayers.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  fromOutside,
  meetingOfTwo,
  unitOfWorkOf,
} from "../../support/transactions.js";
import { namesKept } from "../../support/worldRankings.js";

interface Keeping {
  readonly store: PostgresWorldRankingPlayers;
  // What came of the replacings made at once.
  refusals?: unknown[];
  // What was read on another connection.
  readElsewhere?: string[];
  // The players a scenario has said are to be given, all at once.
  toBeGiven: AssociationCroquetPlayer[];
  // What giving players was refused with, where it was.
  refused?: unknown;
  // The identifier each association croquet player had when last asked,
  // by their world ranking number.
  identifiers: Map<number, string>;
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
    identifiers: new Map(),
    toBeGiven: [],
  });
});

// Golf croquet's players ------------------------------------------------------

const replaced = async (
  world: SpecWorld,
  names: readonly string[],
): Promise<void> => {
  const { store } = keepingOf(world);
  await unitOfWorkOf(world).inTransaction(() =>
    store.replaceGolfCroquet(names),
  );
};

Given(
  /^the golf croquet players have been replaced with "([^"]*)"$/,
  async function (this: SpecWorld, name: string) {
    await replaced(this, [name]);
  },
);

When(
  /^the golf croquet players are replaced with "([^"]*)"$/,
  async function (this: SpecWorld, name: string) {
    await replaced(this, [name]);
  },
);

When(
  /^the golf croquet players are replaced with "([^"]*)" twice$/,
  async function (this: SpecWorld, name: string) {
    await replaced(this, [name, name]);
  },
);

// Each in a transaction of its own, both underway before either replaces
// anything, so that they are at once rather than one after the other.
When(
  /^the golf croquet players are replaced with "([^"]*)" and with "([^"]*)" at once$/,
  async function (this: SpecWorld, one: string, other: string) {
    const keeping = keepingOf(this);
    const unitOfWork = unitOfWorkOf(this);
    const meet = meetingOfTwo();
    const settled = await Promise.allSettled(
      [one, other].map((name) =>
        unitOfWork.inTransaction(async () => {
          await meet();
          await keeping.store.replaceGolfCroquet([name]);
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
  /^the golf croquet players are being replaced with "([^"]*)"$/,
  async function (this: SpecWorld, name: string) {
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
      await store.replaceGolfCroquet([name]);
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
  /^the golf croquet players are read on another connection$/,
  async function (this: SpecWorld) {
    keepingOf(this).readElsewhere = await namesKept(this, "gc");
  },
);

Then(
  /^"([^"]*)" is among the golf croquet players read$/,
  function (this: SpecWorld, name: string) {
    const read = keepingOf(this).readElsewhere;
    assert.ok(read?.includes(name), `Read ${inspect(read)}.`);
  },
);

// Association croquet's players -----------------------------------------------

const given = async (
  world: SpecWorld,
  players: readonly AssociationCroquetPlayer[],
): Promise<void> => {
  const { store } = keepingOf(world);
  const at = ReadOnlyDate.from(world.moment ?? new Date());
  await unitOfWorkOf(world).inTransaction(() =>
    store.keepAssociationCroquet(players, at),
  );
};

// What is kept of one player, read from a connection of its own.
const keptOf = (
  world: SpecWorld,
  worldRankingId: number,
): Promise<{
  identifier: string;
  changedAt: Date;
  archivedAt: Date | null;
}> =>
  fromOutside(world, async (outside) => {
    const { rows } = await outside.query<{
      identifier: string;
      changedAt: Date;
      archivedAt: Date | null;
    }>(
      `select ac_world_ranking_id as identifier,
              changed_at as "changedAt", archived_at as "archivedAt"
         from ac_world_ranking_players where world_ranking_id = $1`,
      [worldRankingId],
    );
    const [row] = rows;
    assert.ok(row !== undefined, `Nobody is kept as ${worldRankingId}.`);
    return row;
  });

const player = (
  worldRankingId: string,
  name: string,
): AssociationCroquetPlayer => ({
  worldRankingId: Number(worldRankingId),
  name,
});

// Remembered as the player is first given, for the scenario that asks
// whether they kept it.
Given(
  /^the association croquet player (\d+) called "([^"]*)" has been given$/,
  async function (this: SpecWorld, number: string, name: string) {
    await given(this, [player(number, name)]);
    keepingOf(this).identifiers.set(
      Number(number),
      (await keptOf(this, Number(number))).identifier,
    );
  },
);

Given(
  /^the association croquet players (\d+) and (\d+) have been given$/,
  async function (this: SpecWorld, one: string, other: string) {
    await given(this, [
      player(one, `Player ${one}`),
      player(other, `Player ${other}`),
    ]);
  },
);

// Where a scenario is about what happens when a list is refused, giving it
// is attempted and what it was refused with is kept, rather than thrown.
const attempted = async (
  world: SpecWorld,
  players: readonly AssociationCroquetPlayer[],
): Promise<void> => {
  try {
    await given(world, players);
  } catch (refused) {
    keepingOf(world).refused = refused;
  }
};

When(
  /^the association croquet player (\d+) called "([^"]*)" is given$/,
  async function (this: SpecWorld, number: string, name: string) {
    await attempted(this, [player(number, name)]);
  },
);

Given(
  /^the association croquet player (\d+) called "([^"]*)" is to be given$/,
  function (this: SpecWorld, number: string, name: string) {
    keepingOf(this).toBeGiven.push(player(number, name));
  },
);

When("those to be given are given", async function (this: SpecWorld) {
  await attempted(this, keepingOf(this).toBeGiven);
});

When(
  "no association croquet players are given",
  async function (this: SpecWorld) {
    await attempted(this, []);
  },
);

Then(
  "the refusal names the name taken {string}",
  function (this: SpecWorld, name: string) {
    const refused = keepingOf(this).refused;
    assert.ok(
      refused instanceof NameTakenRefused,
      `Expected a name taken, and got ${inspect(refused)}.`,
    );
    assert.ok(refused.names.includes(name), `Named ${inspect(refused.names)}.`);
  },
);

Then(
  "giving them is refused with {string}",
  function (this: SpecWorld, code: string) {
    const refused = keepingOf(this).refused;
    assert.ok(
      refused instanceof ListRefused,
      `Expected a refusal, and got ${inspect(refused)}.`,
    );
    assert.equal(refused.code, code);
  },
);

When(
  /^the association croquet players (\d+) and (\d+) called "([^"]*)" are given$/,
  async function (this: SpecWorld, one: string, other: string, name: string) {
    await given(this, [player(one, name), player(other, name)]);
  },
);

// Two players already kept are given again by their numbers alone, under the
// names they have, so that all the scenario varies is who is listed.
When(
  /^the association croquet players (\d+) and (\d+) are given$/,
  async function (this: SpecWorld, one: string, other: string) {
    const kept = await fromOutside(this, async (outside) => {
      const { rows } = await outside.query<{ id: number; name: string }>(
        `select world_ranking_id as id, name
           from ac_world_ranking_players where world_ranking_id = any($1)`,
        [[Number(one), Number(other)]],
      );
      return rows;
    });
    await given(
      this,
      kept.map((each) => ({ worldRankingId: each.id, name: each.name })),
    );
  },
);

Then(
  /^the association croquet player (\d+) has an identifier that begins "([^"]*)"$/,
  async function (this: SpecWorld, number: string, beginning: string) {
    const { identifier } = await keptOf(this, Number(number));
    assert.ok(identifier.startsWith(beginning), `Kept as ${identifier}.`);
  },
);

Then(
  /^the association croquet player (\d+) has the identifier they had$/,
  async function (this: SpecWorld, number: string) {
    const had = keepingOf(this).identifiers.get(Number(number));
    assert.equal((await keptOf(this, Number(number))).identifier, had);
  },
);

Then(
  /^the association croquet player (\d+) changed at "([^"]*)"$/,
  async function (this: SpecWorld, number: string, moment: string) {
    const { changedAt } = await keptOf(this, Number(number));
    assert.equal(changedAt.toISOString(), new Date(moment).toISOString());
  },
);

Then(
  /^the association croquet player (\d+) archived at "([^"]*)"$/,
  async function (this: SpecWorld, number: string, moment: string) {
    const { archivedAt } = await keptOf(this, Number(number));
    assert.equal(archivedAt?.toISOString(), new Date(moment).toISOString());
  },
);

Then(
  /^the association croquet player (\d+) is not archived$/,
  async function (this: SpecWorld, number: string) {
    assert.equal((await keptOf(this, Number(number))).archivedAt, null);
  },
);
