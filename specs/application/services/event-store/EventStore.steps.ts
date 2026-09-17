import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  AppendRefused,
  type EventStore,
} from "../../../../src/application/services/EventStore.js";
import { AccountId } from "../../../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import type { Id } from "../../../../src/domain/common/Id.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";

// An event that exists only to exercise the store. It is called something so
// that a scenario can tell which came back where.
class ExampleEvent extends DomainEvent {
  constructor(
    readonly called: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}

// Every example event is caused by one account at one moment. Nothing here
// reads a clock, any more than the application does.
const causedBy = AccountId.from("account/123e4567-e89b-42d3-a456-426614174000");
const happenedAt = ReadOnlyDate.from(new Date("2026-09-17T09:00:00Z"));

const exampleEvent = (called: string): ExampleEvent =>
  new ExampleEvent(called, causedBy, happenedAt);

// A store that keeps its streams in memory. It is what stands behind these
// scenarios until there is a store that keeps them somewhere, and it is here
// rather than under src because nothing but these scenarios uses it.
class InMemoryEventStore implements EventStore {
  readonly #streams = new Map<string, DomainEvent[]>();

  appendEvents(
    streamId: Id,
    expectedVersion: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
      return Promise.reject(
        new AppendRefused(
          "EventStore.VersionNotACount",
          `${String(expectedVersion)} is not a version a stream could be at.`,
        ),
      );
    }

    if (events.length === 0) {
      return Promise.reject(
        new AppendRefused(
          "EventStore.NothingToAppend",
          `Nothing was given to append to ${streamId.value}.`,
        ),
      );
    }

    const stream = this.#streams.get(streamId.value) ?? [];
    if (stream.length !== expectedVersion) {
      return Promise.reject(
        new AppendRefused(
          "EventStore.Concurrency",
          `${streamId.value} is at version ${stream.length}, and the append expected ${expectedVersion}.`,
        ),
      );
    }

    this.#streams.set(streamId.value, [...stream, ...events]);
    return Promise.resolve();
  }

  getEvents(streamId: Id): Promise<readonly DomainEvent[]> {
    return Promise.resolve([...(this.#streams.get(streamId.value) ?? [])]);
  }
}

const storeOf = (world: SpecWorld): EventStore => {
  assert.ok(world.eventStore !== undefined, "No event store has been given.");
  return world.eventStore;
};

const streamOf = (world: SpecWorld, which: number): Id => {
  const stream = world.streams[which];
  assert.ok(stream !== undefined, `No stream number ${which + 1} was named.`);
  return stream;
};

const readBackOf = (world: SpecWorld): readonly DomainEvent[] => {
  assert.ok(world.readBack !== undefined, "No stream has been read back.");
  return world.readBack;
};

// The event the scenario named last, as what it is.
const namedEventOf = (world: SpecWorld): ExampleEvent => {
  const event = readBackOf(world)[world.readBackChecked - 1];
  assert.ok(event instanceof ExampleEvent, "No event has been named yet.");
  return event;
};

const append = async (
  world: SpecWorld,
  stream: Id,
  expectedVersion: number,
): Promise<void> => {
  const events = world.pendingEvents;
  // Appended or refused, these are no longer waiting: a scenario that appends
  // again names what it appends again.
  world.pendingEvents = [];
  try {
    await storeOf(world).appendEvents(stream, expectedVersion, events);
  } catch (failure) {
    world.failure = failure;
  }
};

// The event the scenario names by position, and the count of those named so
// far, so that "there are no more events" knows where it is.
const eventAt = (world: SpecWorld, position: number, called: string): void => {
  const event = readBackOf(world)[position];
  assert.ok(
    event instanceof ExampleEvent,
    `There is no event ${position + 1}.`,
  );
  assert.equal(event.called, called);
  world.readBackChecked = position + 1;
};

// The store and its streams --------------------------------------------

// The store behind these scenarios is whatever a hook has put in the world,
// and this one when nothing has. That is what lets a store that keeps events
// somewhere be held to the same scenarios, by a hook and a tag, without a
// copy of them.
Given("an event store", function (this: SpecWorld) {
  this.eventStore ??= new InMemoryEventStore();
});

Given("a stream nobody has written to", function (this: SpecWorld) {
  this.streams.push(AccountId.create());
});

Given("another stream nobody has written to", function (this: SpecWorld) {
  this.streams.push(AccountId.create());
});

Given(
  "a stream holding {int} events",
  async function (this: SpecWorld, count: number) {
    const stream = AccountId.create();
    this.streams.push(stream);
    if (count === 0) return;
    const already = Array.from({ length: count }, (_, index) =>
      exampleEvent(`already there ${index + 1}`),
    );
    await storeOf(this).appendEvents(stream, 0, already);
  },
);

Given("an event called {string}", function (this: SpecWorld, called: string) {
  this.pendingEvents.push(exampleEvent(called));
});

// Appending and reading back ---------------------------------------------

When(
  "the events are appended expecting version {int}",
  async function (this: SpecWorld, expectedVersion: number) {
    await append(this, streamOf(this, 0), expectedVersion);
  },
);

When(
  "the events are appended expecting a version of {float}",
  async function (this: SpecWorld, expectedVersion: number) {
    await append(this, streamOf(this, 0), expectedVersion);
  },
);

When(
  "the events are appended expecting a version that is not a number",
  async function (this: SpecWorld) {
    await append(this, streamOf(this, 0), Number.NaN);
  },
);

When(
  "the events are appended to the other stream expecting version {int}",
  async function (this: SpecWorld, expectedVersion: number) {
    await append(this, streamOf(this, 1), expectedVersion);
  },
);

When(
  "no events are appended expecting version {int}",
  async function (this: SpecWorld, expectedVersion: number) {
    this.pendingEvents = [];
    await append(this, streamOf(this, 0), expectedVersion);
  },
);

When("the stream is read back", async function (this: SpecWorld) {
  this.readBack = await storeOf(this).getEvents(streamOf(this, 0));
});

// A caller doing as it likes with what it was given. A store that handed back
// the stream itself would be added to by this.
When("what was read back is added to", function (this: SpecWorld) {
  (readBackOf(this) as DomainEvent[]).push(exampleEvent("never appended"));
});

When("the other stream is read back", async function (this: SpecWorld) {
  this.readBack = await storeOf(this).getEvents(streamOf(this, 1));
});

// What came of it --------------------------------------------------------

Then("it holds no events", function (this: SpecWorld) {
  assert.deepEqual(readBackOf(this), []);
});

Then("it holds {int} events", function (this: SpecWorld, count: number) {
  assert.equal(readBackOf(this).length, count);
});

Then("the first event is {string}", function (this: SpecWorld, called: string) {
  eventAt(this, 0, called);
});

Then(
  "the second event is {string}",
  function (this: SpecWorld, called: string) {
    eventAt(this, 1, called);
  },
);

Then("the third event is {string}", function (this: SpecWorld, called: string) {
  eventAt(this, 2, called);
});

Then("there are no more events", function (this: SpecWorld) {
  assert.deepEqual(readBackOf(this).slice(this.readBackChecked), []);
});

Then(
  "it was caused by the account the event was created with",
  function (this: SpecWorld) {
    assert.ok(namedEventOf(this).createdBy.equals(causedBy));
  },
);

Then(
  "it happened at the moment the event was created with",
  function (this: SpecWorld) {
    assert.ok(namedEventOf(this).occurredAt.equals(happenedAt));
  },
);

Then("appending is accepted", function (this: SpecWorld) {
  assert.equal(
    this.failure,
    undefined,
    `Expected the append to be accepted, and it was refused: ${inspect(this.failure)}`,
  );
});

Then(
  "appending is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.ok(
      this.failure instanceof AppendRefused,
      `Expected a refusal, and got ${this.failure === undefined ? "an accepted append" : inspect(this.failure)}.`,
    );
    assert.equal(this.failure.code, code);
  },
);
