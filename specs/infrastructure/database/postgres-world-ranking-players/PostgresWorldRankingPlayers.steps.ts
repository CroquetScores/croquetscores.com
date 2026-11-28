// Keeping the world ranking players in Postgres
// (PostgresWorldRankingPlayers.feature). Each keeping is made as a request
// would make it, in a transaction of its own on the scenario's unit of work;
// what was kept is read from a connection of its own
// (specs/infrastructure/support/worldRankings.ts). Both sports' players are
// kept by the number the rankings give them, so the steps are the same for
// either and say which sport they are about.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type ListedPlayer,
  ListRefused,
  NameTakenRefused,
  type WorldRankingSport,
} from "../../../../src/application/services/WorldRankingLists.js";
import { PostgresWorldRankingPlayers } from "../../../../src/infrastructure/database/PostgresWorldRankingPlayers.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  fromOutside,
  meetingOfTwo,
  unitOfWorkOf,
} from "../../support/transactions.js";
import { namesKept, SPORT, sportCalled } from "../../support/worldRankings.js";

interface Keeping {
  readonly store: PostgresWorldRankingPlayers;
  // What came of the keepings made at once.
  refusals?: unknown[];
  // What was read on another connection, and of which sport's players.
  readElsewhere?: string[];
  readElsewhereOf?: WorldRankingSport;
  // The players a scenario has said are to be given, all at once, and whose
  // sport's list they are.
  toBeGiven: ListedPlayer[];
  toBeGivenFor?: WorldRankingSport;
  // What giving players was refused with, where it was.
  refused?: unknown;
  // The identifier each player had when last asked, by their sport and their
  // world ranking number.
  identifiers: Map<string, string>;
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

// Written out rather than made from the sport, as the store writes them.
const COLUMNS: Readonly<
  Record<WorldRankingSport, { table: string; identifier: string }>
> = {
  ac: { table: "ac_world_ranking_players", identifier: "ac_world_ranking_id" },
  gc: { table: "gc_world_ranking_players", identifier: "gc_world_ranking_id" },
};

const keyOf = (sport: WorldRankingSport, number: number): string =>
  `${sport}/${String(number)}`;

// Kept in the transaction underway, which the caller has begun.
const keepWithin = (
  world: SpecWorld,
  sport: WorldRankingSport,
  players: readonly ListedPlayer[],
): Promise<void> => {
  const { store } = keepingOf(world);
  const at = ReadOnlyDate.from(world.moment ?? new Date());
  return sport === "ac"
    ? store.keepAssociationCroquet(players, at)
    : store.keepGolfCroquet(withACountry(sport, players), at);
};

const given = async (
  world: SpecWorld,
  sport: WorldRankingSport,
  players: readonly ListedPlayer[],
): Promise<void> => {
  await unitOfWorkOf(world).inTransaction(() =>
    keepWithin(world, sport, players),
  );
};

// What is kept of one player, read from a connection of its own.
const keptOf = (
  world: SpecWorld,
  sport: WorldRankingSport,
  worldRankingId: number,
): Promise<{
  identifier: string;
  changedAt: Date;
  archivedAt: Date | null;
}> =>
  fromOutside(world, async (outside) => {
    const { table, identifier } = COLUMNS[sport];
    const { rows } = await outside.query<{
      identifier: string;
      changedAt: Date;
      archivedAt: Date | null;
    }>(
      `select ${identifier} as identifier,
              changed_at as "changedAt", archived_at as "archivedAt"
         from ${table} where world_ranking_id = $1`,
      [worldRankingId],
    );
    const [row] = rows;
    assert.ok(row !== undefined, `Nobody is kept as ${worldRankingId}.`);
    return row;
  });

const player = (
  worldRankingId: string,
  name: string,
  country?: string,
): ListedPlayer => ({
  worldRankingId: Number(worldRankingId),
  name,
  ...(country ? { country } : {}),
});

// A golf croquet player given no country by the scenario is from England,
// which a scenario that does not mind says nothing of. Association croquet's
// players have none.
const withACountry = (
  sport: WorldRankingSport,
  players: readonly ListedPlayer[],
): readonly ListedPlayer[] =>
  sport === "gc"
    ? players.map((each) => ({ country: "england", ...each }))
    : players;

// Remembered as the player is first given, for the scenario that asks
// whether they kept it.
Given(
  new RegExp(
    `^the ${SPORT} player (\\d+) called "([^"]*)"(?: from "([^"]*)")? has been given$`,
  ),
  async function (
    this: SpecWorld,
    sport: string,
    number: string,
    name: string,
    country: string | undefined,
  ) {
    await given(this, sportCalled(sport), [player(number, name, country)]);
    keepingOf(this).identifiers.set(
      keyOf(sportCalled(sport), Number(number)),
      (await keptOf(this, sportCalled(sport), Number(number))).identifier,
    );
  },
);

Given(
  new RegExp(`^the ${SPORT} players (\\d+) and (\\d+) have been given$`),
  async function (this: SpecWorld, sport: string, one: string, other: string) {
    await given(this, sportCalled(sport), [
      player(one, `Player ${one}`),
      player(other, `Player ${other}`),
    ]);
  },
);

// Where a scenario is about what happens when a list is refused, giving it
// is attempted and what it was refused with is kept, rather than thrown.
const attempted = async (
  world: SpecWorld,
  sport: WorldRankingSport,
  players: readonly ListedPlayer[],
): Promise<void> => {
  try {
    await given(world, sport, players);
  } catch (refused) {
    keepingOf(world).refused = refused;
  }
};

When(
  new RegExp(
    `^the ${SPORT} player (\\d+) called "([^"]*)"(?: from "([^"]*)")? is given$`,
  ),
  async function (
    this: SpecWorld,
    sport: string,
    number: string,
    name: string,
    country: string | undefined,
  ) {
    await attempted(this, sportCalled(sport), [player(number, name, country)]);
  },
);

Given(
  new RegExp(
    `^the ${SPORT} player (\\d+) called "([^"]*)"(?: from "([^"]*)")? is to be given$`,
  ),
  function (
    this: SpecWorld,
    sport: string,
    number: string,
    name: string,
    country: string | undefined,
  ) {
    const keeping = keepingOf(this);
    keeping.toBeGiven.push(player(number, name, country));
    keeping.toBeGivenFor = sportCalled(sport);
  },
);

When("those to be given are given", async function (this: SpecWorld) {
  const { toBeGiven, toBeGivenFor } = keepingOf(this);
  assert.ok(toBeGivenFor !== undefined, "Nobody is to be given.");
  await attempted(this, toBeGivenFor, toBeGiven);
});

When(
  new RegExp(`^no ${SPORT} players are given$`),
  async function (this: SpecWorld, sport: string) {
    await attempted(this, sportCalled(sport), []);
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
  new RegExp(
    `^the ${SPORT} players (\\d+) and (\\d+) called "([^"]*)" are given$`,
  ),
  async function (
    this: SpecWorld,
    sport: string,
    one: string,
    other: string,
    name: string,
  ) {
    await given(this, sportCalled(sport), [
      player(one, name),
      player(other, name),
    ]);
  },
);

// Two players already kept are given again by their numbers alone, under the
// names they have, so that all the scenario varies is who is listed.
When(
  new RegExp(`^the ${SPORT} players (\\d+) and (\\d+) are given$`),
  async function (this: SpecWorld, sport: string, one: string, other: string) {
    const { table } = COLUMNS[sportCalled(sport)];
    const kept = await fromOutside(this, async (outside) => {
      const { rows } = await outside.query<{ id: number; name: string }>(
        `select world_ranking_id as id, name
           from ${table} where world_ranking_id = any($1)`,
        [[Number(one), Number(other)]],
      );
      return rows;
    });
    await given(
      this,
      sportCalled(sport),
      kept.map((each) => ({ worldRankingId: each.id, name: each.name })),
    );
  },
);

Then(
  new RegExp(
    `^the ${SPORT} player (\\d+) has an identifier that begins "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    sport: string,
    number: string,
    beginning: string,
  ) {
    const { identifier } = await keptOf(
      this,
      sportCalled(sport),
      Number(number),
    );
    assert.ok(identifier.startsWith(beginning), `Kept as ${identifier}.`);
  },
);

Then(
  new RegExp(`^the ${SPORT} player (\\d+) has the identifier they had$`),
  async function (this: SpecWorld, sport: string, number: string) {
    const had = keepingOf(this).identifiers.get(
      keyOf(sportCalled(sport), Number(number)),
    );
    assert.equal(
      (await keptOf(this, sportCalled(sport), Number(number))).identifier,
      had,
    );
  },
);

Then(
  new RegExp(`^the ${SPORT} player (\\d+) is from "([^"]*)"$`),
  async function (
    this: SpecWorld,
    sport: string,
    number: string,
    country: string,
  ) {
    const { table } = COLUMNS[sportCalled(sport)];
    const kept = await fromOutside(this, async (outside) => {
      const { rows } = await outside.query<{ country: string }>(
        `select country from ${table}
          where world_ranking_id = $1`,
        [Number(number)],
      );
      return rows[0]?.country;
    });
    assert.equal(kept, country);
  },
);

Then(
  new RegExp(`^the ${SPORT} player (\\d+) changed at "([^"]*)"$`),
  async function (
    this: SpecWorld,
    sport: string,
    number: string,
    moment: string,
  ) {
    const { changedAt } = await keptOf(
      this,
      sportCalled(sport),
      Number(number),
    );
    assert.equal(changedAt.toISOString(), new Date(moment).toISOString());
  },
);

Then(
  new RegExp(`^the ${SPORT} player (\\d+) archived at "([^"]*)"$`),
  async function (
    this: SpecWorld,
    sport: string,
    number: string,
    moment: string,
  ) {
    const { archivedAt } = await keptOf(
      this,
      sportCalled(sport),
      Number(number),
    );
    assert.equal(archivedAt?.toISOString(), new Date(moment).toISOString());
  },
);

Then(
  new RegExp(`^the ${SPORT} player (\\d+) is not archived$`),
  async function (this: SpecWorld, sport: string, number: string) {
    assert.equal(
      (await keptOf(this, sportCalled(sport), Number(number))).archivedAt,
      null,
    );
  },
);

// Two keepings at once ----------------------------------------------------------

// Each in a transaction of its own, both underway before either keeps
// anything, so that they are at once rather than one after the other.
When(
  new RegExp(
    `^the ${SPORT} players (\\d+) called "([^"]*)" and (\\d+) called "([^"]*)" are given at once$`,
  ),
  async function (
    this: SpecWorld,
    sport: string,
    oneNumber: string,
    oneName: string,
    otherNumber: string,
    otherName: string,
  ) {
    const keeping = keepingOf(this);
    const unitOfWork = unitOfWorkOf(this);
    const meet = meetingOfTwo();
    const settled = await Promise.allSettled(
      [player(oneNumber, oneName), player(otherNumber, otherName)].map((each) =>
        unitOfWork.inTransaction(async () => {
          await meet();
          await keepWithin(this, sportCalled(sport), [each]);
        }),
      ),
    );
    keeping.refusals = settled
      .filter((each) => each.status === "rejected")
      .map((each) => each.reason as unknown);
  },
);

Then("neither keeping was refused", function (this: SpecWorld) {
  assert.deepEqual(keepingOf(this).refusals, []);
});

Then(
  new RegExp(`^(\\d+) ${SPORT} players? (?:is|are) not archived$`),
  async function (this: SpecWorld, count: string, sport: string) {
    const { table } = COLUMNS[sportCalled(sport)];
    const rows = await fromOutside(this, async (outside) => {
      const { rows: kept } = await outside.query<{ name: string }>(
        `select name from ${table} where archived_at is null`,
      );
      return kept;
    });
    assert.equal(
      rows.length,
      Number(count),
      `Not archived: ${inspect(rows.map((row) => row.name))}.`,
    );
  },
);

// Kept in a transaction left open until the scenario is over, so that what is
// read meanwhile is read while it is under way. Let go of before the database
// is dropped, since the transaction holds a connection of its pool.
Given(
  new RegExp(`^the ${SPORT} player (\\d+) called "([^"]*)" is being given$`),
  async function (
    this: SpecWorld,
    sport: string,
    number: string,
    name: string,
  ) {
    let letGo = (): void => {};
    const over = new Promise<void>((resolve) => {
      letGo = resolve;
    });
    let underway = (): void => {};
    const keeping = new Promise<void>((resolve) => {
      underway = resolve;
    });
    const transaction = unitOfWorkOf(this).inTransaction(async () => {
      await keepWithin(this, sportCalled(sport), [player(number, name)]);
      underway();
      await over;
    });
    this.closeBeforeDropping.unshift(async () => {
      letGo();
      await transaction;
    });
    await Promise.race([keeping, transaction]);
  },
);

When(
  new RegExp(`^the ${SPORT} players are read on another connection$`),
  async function (this: SpecWorld, sport: string) {
    const keeping = keepingOf(this);
    keeping.readElsewhereOf = sportCalled(sport);
    keeping.readElsewhere = await namesKept(this, sportCalled(sport));
  },
);

Then(
  new RegExp(`^"([^"]*)" is among the ${SPORT} players read$`),
  function (this: SpecWorld, name: string, sport: string) {
    const keeping = keepingOf(this);
    assert.equal(keeping.readElsewhereOf, sportCalled(sport));
    const read = keeping.readElsewhere;
    assert.ok(read?.includes(name), `Read ${inspect(read)}.`);
  },
);
