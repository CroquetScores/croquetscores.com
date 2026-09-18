import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  AppendRefused,
  type EventStore,
} from "../../../../src/application/services/EventStore.js";
import type { Id } from "../../../../src/domain/common/Id.js";
import { PostgresEventStore } from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import {
  ExampleEvent,
  exampleEvent,
  exampleRegistry,
  OtherEvent,
} from "../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  commandDoes,
  fails,
  meetingOfTwo,
  unitOfWorkOf,
} from "../../support/transactions.js";

// What a scenario has besides what the world holds: a second store, and the
// meeting the command's handler waits at before it appends.
interface Scenario {
  otherStore?: EventStore;
  waitForTheOther?: () => Promise<void>;
  carriesOnWhenRefused?: boolean;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {};
    scenarios.set(world, scenario);
  }
  return scenario;
};

// A store over the scenario's database and its one unit of work, told how to
// read back the example kind and, unless it is to be ignorant of it, the other.
const storeIn = (world: SpecWorld, knowsTheOtherKind = true): EventStore => {
  // Every call the event store's own steps make is made as a request would
  // make it, since this store refuses to do anything where none is being
  // served.
  world.asARequest = (work) => unitOfWorkOf(world).inTransaction(work);
  return new PostgresEventStore(
    unitOfWorkOf(world),
    exampleRegistry({ knowsTheOtherKind }),
  );
};

const storeOf = (world: SpecWorld): EventStore => {
  assert.ok(world.eventStore !== undefined, "No event store has been given.");
  return world.eventStore;
};

const theStream = (world: SpecWorld): Id => {
  const stream = world.streams[0];
  assert.ok(stream !== undefined, "No stream was named.");
  return stream;
};

const eventAt = (world: SpecWorld, position: number) => {
  assert.ok(world.readBack !== undefined, "No stream has been read back.");
  const event = world.readBack[position];
  assert.ok(event !== undefined, `There is no event ${position + 1}.`);
  world.readBackChecked = position + 1;
  return event;
};

// The stores -------------------------------------------------------------

// What stands behind the event store's own feature, which is written for any
// store: this one, because it is the one the application keeps its events in,
// and a store the application does not use would be held to those scenarios
// for nobody's benefit.
Given("an event store", function (this: SpecWorld) {
  this.eventStore ??= storeIn(this);
});

Given("an event store in Postgres", function (this: SpecWorld) {
  this.eventStore = storeIn(this);
});

Given(
  "an event store in Postgres that does not know the other kind",
  function (this: SpecWorld) {
    this.eventStore = storeIn(this, false);
  },
);

Given("another event store in Postgres", function (this: SpecWorld) {
  scenarioOf(this).otherStore = storeIn(this);
});

Given(
  "another event store in Postgres that does not know the other kind",
  function (this: SpecWorld) {
    scenarioOf(this).otherStore = storeIn(this, false);
  },
);

// Settings made for a database are taken by the connections opened after
// them, and the pool already holds some from migrating it. Each of those is
// closed, so that whatever the store is given next is opened afresh; and the
// setting is asked for afterwards, so that a scenario cannot pass by the zone
// never having taken.
Given(
  "the database keeps time in {string}",
  async function (this: SpecWorld, zone: string) {
    const pool = this.database;
    const {
      rows: [quoted],
    } = await pool.query<{ database: string; zone: string }>(
      "select quote_ident($1) as database, quote_literal($2) as zone",
      [this.databaseName, zone],
    );
    assert.ok(quoted !== undefined);
    await pool.query(
      `alter database ${quoted.database} set timezone to ${quoted.zone}`,
    );

    const open = await Promise.all(
      Array.from({ length: pool.idleCount }, () => pool.connect()),
    );
    for (const connection of open) connection.release(true);

    const {
      rows: [setting],
    } = await pool.query<{ zone: string }>(
      "select current_setting('TimeZone') as zone",
    );
    assert.equal(setting?.zone, zone, "The database did not take the zone.");
  },
);

// Rows put in the table directly, in the order the scenario gives, which need
// not be the order of their versions. Written as the store would write them, by
// the same registry, so that the only thing out of the ordinary is the order.
const keptAround = async (
  world: SpecWorld,
  called: string,
  version: number,
): Promise<void> => {
  const { name, data } = exampleRegistry().writeDown(exampleEvent(called));
  await world.database.query(
    "insert into events (stream_id, version, name, data) values ($1, $2, $3, $4)",
    [theStream(world).value, version, name, data],
  );
};

Given(
  "the event {string} is kept as the stream's first, going around the store",
  async function (this: SpecWorld, called: string) {
    await keptAround(this, called, 1);
  },
);

Given(
  "the event {string} is kept as the stream's second, going around the store",
  async function (this: SpecWorld, called: string) {
    await keptAround(this, called, 2);
  },
);

// What the command's handler does ---------------------------------------

Given(
  "a handler registered for the example command that appends the events expecting version {int}",
  function (this: SpecWorld, version: number) {
    const scenario = scenarioOf(this);
    const store = storeOf(this);
    const stream = theStream(this);
    const events = this.pendingEvents;
    this.pendingEvents = [];

    commandDoes(this).push(async () => {
      if (scenario.waitForTheOther !== undefined) {
        await scenario.waitForTheOther();
      }
      try {
        await store.appendEvents(stream, version, events);
      } catch (failure) {
        const carriesOn =
          scenario.carriesOnWhenRefused === true &&
          failure instanceof AppendRefused;
        if (!carriesOn) throw failure;
      }
    });
  },
);

// Both commands have the stream at the same version before either appends,
// which is the whole of the race. Waiting after appending instead would
// deadlock: the second append waits for the first command to finish, and the
// first would be waiting for the second.
Given(
  "the handler waits for the other command before appending",
  function (this: SpecWorld) {
    scenarioOf(this).waitForTheOther = meetingOfTwo();
  },
);

// Told its append was refused, and answering all the same, so that the command
// commits. Whatever the append had got as far as would be committed with it:
// the transaction undoes nothing here, and the store has to have written
// nothing to begin with.
Given(
  "the handler carries on when the append is refused",
  function (this: SpecWorld) {
    scenarioOf(this).carriesOnWhenRefused = true;
  },
);

Given(
  "the handler fails after appending the events",
  function (this: SpecWorld) {
    fails(this);
  },
);

// Appending and reading --------------------------------------------------

When(
  "the events are appended with no command underway",
  async function (this: SpecWorld) {
    const events = this.pendingEvents;
    this.pendingEvents = [];
    try {
      await storeOf(this).appendEvents(theStream(this), 0, events);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

When(
  "the stream is read back through the other store",
  async function (this: SpecWorld) {
    const other = scenarioOf(this).otherStore;
    assert.ok(other !== undefined, "There is no other store.");
    try {
      this.readBack = await this.asARequest(() =>
        other.getEvents(theStream(this)),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

// What came of it --------------------------------------------------------

Then("the first event is of the example kind", function (this: SpecWorld) {
  const event = eventAt(this, 0);
  assert.ok(event instanceof ExampleEvent, `It is ${inspect(event)}.`);
});

Then("the second event is of the other kind", function (this: SpecWorld) {
  const event = eventAt(this, 1);
  assert.ok(event instanceof OtherEvent, `It is ${inspect(event)}.`);
});

Then(
  "sending one of them is refused with {string}",
  function (this: SpecWorld, code: string) {
    const failure = this.failure as { code?: unknown } | undefined;
    assert.ok(failure !== undefined, "Neither of them was refused.");
    assert.equal(
      failure.code,
      code,
      `It was refused with ${inspect(failure)}.`,
    );
  },
);
