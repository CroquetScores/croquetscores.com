import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { EventStore } from "../../../../src/application/services/EventStore.js";
import { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import type { Id } from "../../../../src/domain/common/Id.js";
import {
  causedBy,
  ExampleEvent,
  exampleEvent,
  happenedAt,
  OtherEvent,
  otherEvent,
} from "../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../support/world.js";

// What stands behind "an event store" is decided by the steps of whatever
// implements one, which name it, and this file may not: it describes the
// interface, and is held to the rule of the layer it describes. Those steps
// also say what a request is, and every call made here is made as one.

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
    await world.asARequest(() =>
      storeOf(world).appendEvents(stream, expectedVersion, events),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

// The event the scenario names by position, and the count of those named so
// far, so that "there are no more events" knows where it is.
const eventAt = (world: SpecWorld, position: number, called: string): void => {
  const event = readBackOf(world)[position];
  assert.ok(
    event instanceof ExampleEvent || event instanceof OtherEvent,
    `There is no event ${position + 1}.`,
  );
  assert.equal(event.called, called);
  world.readBackChecked = position + 1;
};

// The store and its streams --------------------------------------------

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
    await this.asARequest(() => storeOf(this).appendEvents(stream, 0, already));
  },
);

Given("an event called {string}", function (this: SpecWorld, called: string) {
  this.pendingEvents.push(exampleEvent(called));
});

Given(
  "an event of the other kind called {string}",
  function (this: SpecWorld, called: string) {
    this.pendingEvents.push(otherEvent(called));
  },
);

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
  this.readBack = await this.asARequest(() =>
    storeOf(this).getEvents(streamOf(this, 0)),
  );
});

// A caller doing as it likes with what it was given. A store that handed back
// the stream itself would be added to by this.
When("what was read back is added to", function (this: SpecWorld) {
  (readBackOf(this) as DomainEvent[]).push(exampleEvent("never appended"));
});

When("the other stream is read back", async function (this: SpecWorld) {
  this.readBack = await this.asARequest(() =>
    storeOf(this).getEvents(streamOf(this, 1)),
  );
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
    const failure = this.failure as { code?: unknown } | undefined;
    assert.ok(
      failure !== undefined,
      "Expected a refusal, and the append was accepted.",
    );
    assert.equal(
      failure.code,
      code,
      `It was refused with ${inspect(failure)}.`,
    );
  },
);
