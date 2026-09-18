import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  EventRegistry,
  type KeptEvent,
} from "../../../../src/domain/common/EventRegistry.js";
import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import {
  causedBy,
  ExampleEvent,
  happenedAt,
  OtherEvent,
  readExampleEvent,
  readOtherEvent,
} from "../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../support/world.js";

const registryOf = (world: SpecWorld): EventRegistry => {
  assert.ok(world.registry !== undefined, "No registry has been put together.");
  return world.registry;
};

const keptOf = (world: SpecWorld): KeptEvent => {
  assert.ok(
    world.kept !== undefined,
    `Nothing was kept${world.failure === undefined ? "" : `: ${inspect(world.failure)}`}.`,
  );
  return world.kept;
};

const readBackOf = (world: SpecWorld): DomainEvent => {
  assert.ok(
    world.readBackEvent !== undefined,
    `Nothing was read back${world.failure === undefined ? "" : `: ${inspect(world.failure)}`}.`,
  );
  return world.readBackEvent;
};

const trying = (world: SpecWorld, act: () => void): void => {
  try {
    act();
  } catch (failure) {
    world.failure = failure;
  }
};

// What would be kept of an example event, as the registry writes one down. A
// scenario takes it and spoils one part, to be read back as something a table
// might have held.
const keptAs = (
  name: string,
  data: Record<string, unknown> = {},
): KeptEvent => ({
  name,
  data: {
    called: "kept",
    createdBy: causedBy.value,
    occurredAt: happenedAt.toISOString(),
    ...data,
  },
});

// A refusal is known by its code. Which part refused is for the log.
const refusedWith = (world: SpecWorld, code: string): void => {
  const failure = world.failure as { code?: unknown } | undefined;
  assert.ok(failure !== undefined, "Nothing was refused.");
  assert.equal(failure.code, code, `It was refused with ${inspect(failure)}.`);
};

// Putting the registry together -----------------------------------------

Given(
  "a registry that knows the example kind as {string}",
  function (this: SpecWorld, name: string) {
    this.registry = new EventRegistry().name(
      ExampleEvent,
      name,
      readExampleEvent,
    );
  },
);

Given(
  "the registry knows the other kind as {string}",
  function (this: SpecWorld, name: string) {
    registryOf(this).name(OtherEvent, name, readOtherEvent);
  },
);

When(
  "the other kind is named {string}",
  function (this: SpecWorld, name: string) {
    trying(this, () => registryOf(this).name(OtherEvent, name, readOtherEvent));
  },
);

When(
  "the example kind is named {string}",
  function (this: SpecWorld, name: string) {
    trying(this, () =>
      registryOf(this).name(ExampleEvent, name, readExampleEvent),
    );
  },
);

// What was kept ----------------------------------------------------------

Given(
  "something kept under the name {string}",
  function (this: SpecWorld, name: string) {
    this.kept = keptAs(name);
  },
);

Given(
  "something kept under the name {string} whose moment cannot be read",
  function (this: SpecWorld, name: string) {
    this.kept = keptAs(name, { occurredAt: "not a moment" });
  },
);

// An id, and a well-made one, but of a tournament rather than an account.
Given(
  "something kept under the name {string} whose cause is not an account",
  function (this: SpecWorld, name: string) {
    this.kept = keptAs(name, {
      createdBy: "tournament/123e4567-e89b-42d3-a456-426614174000",
    });
  },
);

// Kept as the registry would have kept it before the kind could say where:
// with no mention of where at all.
Given(
  "an event of the example kind kept before the kind could say where it happened",
  function (this: SpecWorld) {
    this.kept = keptAs("example");
  },
);

// Writing down and reading back -----------------------------------------

When(
  "the event is written down through the registry",
  function (this: SpecWorld) {
    const event = this.pendingEvents.at(-1);
    assert.ok(event !== undefined, "No event has been named.");
    trying(this, () => {
      this.kept = registryOf(this).writeDown(event);
    });
  },
);

When(
  "what was kept is read back through the registry",
  function (this: SpecWorld) {
    const kept = keptOf(this);
    trying(this, () => {
      this.readBackEvent = registryOf(this).readBack(kept);
    });
  },
);

// What came of it --------------------------------------------------------

Then(
  "it was written down under the name {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(keptOf(this).name, name);
  },
);

Then("what was read back is of the example kind", function (this: SpecWorld) {
  assert.ok(
    readBackOf(this) instanceof ExampleEvent,
    `It was read back as ${inspect(this.readBackEvent)}.`,
  );
});

Then("what was read back is of the other kind", function (this: SpecWorld) {
  assert.ok(
    readBackOf(this) instanceof OtherEvent,
    `It was read back as ${inspect(this.readBackEvent)}.`,
  );
});

Then(
  "what was read back is called {string}",
  function (this: SpecWorld, called: string) {
    const event = readBackOf(this);
    assert.ok(
      event instanceof ExampleEvent || event instanceof OtherEvent,
      `It was read back as ${inspect(event)}.`,
    );
    assert.equal(event.called, called);
  },
);

Then(
  "what was read back was caused by the account the event was created with",
  function (this: SpecWorld) {
    assert.ok(readBackOf(this).createdBy.equals(causedBy));
  },
);

Then(
  "what was read back happened at the moment the event was created with",
  function (this: SpecWorld) {
    assert.ok(readBackOf(this).occurredAt.equals(happenedAt));
  },
);

Then(
  "what was read back does not say where it happened",
  function (this: SpecWorld) {
    const event = readBackOf(this);
    assert.ok(event instanceof ExampleEvent);
    assert.equal(event.where, undefined);
  },
);

Then(
  "naming it is refused with {string}",
  function (this: SpecWorld, code: string) {
    refusedWith(this, code);
  },
);

Then(
  "writing it down is refused with {string}",
  function (this: SpecWorld, code: string) {
    refusedWith(this, code);
  },
);

Then(
  "reading it back is refused with {string}",
  function (this: SpecWorld, code: string) {
    refusedWith(this, code);
  },
);
