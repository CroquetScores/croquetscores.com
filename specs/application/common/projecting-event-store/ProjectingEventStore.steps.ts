import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import type { Id } from "../../../../src/domain/common/Id.js";
import { ExampleEvent } from "../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../support/world.js";

// What stands behind "an event store with projections" is decided by the steps
// of whatever keeps the events (specs/infrastructure/support/), since this
// feature is written for any store and these steps may name none.

/** Everything one example projection was given, one entry to each append. */
interface Delivery {
  readonly stream: Id;
  readonly firstEvent: number;
  readonly events: readonly DomainEvent[];
}

// The example projections a scenario has, by what the scenario calls them.
const projections = new WeakMap<SpecWorld, Map<string, Delivery[]>>();

const exampleProjection = (world: SpecWorld, called: string): void => {
  const all = projections.get(world) ?? new Map<string, Delivery[]>();
  projections.set(world, all);
  const given: Delivery[] = [];
  all.set(called, given);
  world.projections.push({
    project: (stream, firstEvent, events) => {
      given.push({ stream, firstEvent, events });
      return Promise.resolve();
    },
  });
};

const givenTo = (world: SpecWorld, called: string): Delivery[] => {
  const given = projections.get(world)?.get(called);
  assert.ok(given !== undefined, `There is no ${called}.`);
  return given;
};

// Every event given to it, across every append, in the order it was given.
const eventsGivenTo = (world: SpecWorld, called: string): string[] =>
  givenTo(world, called)
    .flatMap(({ events }) => events)
    .map((event) => {
      assert.ok(
        event instanceof ExampleEvent,
        `It was given ${inspect(event)}.`,
      );
      return event.called;
    });

// The projections ----------------------------------------------------------

Given("an example projection", function (this: SpecWorld) {
  exampleProjection(this, "projection");
});

Given("another example projection", function (this: SpecWorld) {
  exampleProjection(this, "other projection");
});

Given("a projection that fails", function (this: SpecWorld) {
  this.projections.push({
    project: () => {
      this.plantedFailure = new Error("The projection failed.");
      return Promise.reject(this.plantedFailure);
    },
  });
});

// What they were given -----------------------------------------------------

// How many of the events given to each projection the scenario has named, so
// that "no other event" knows how many there should be.
const named = new WeakMap<SpecWorld, Map<string, number>>();

Then(
  /^the (first|second) event the (projection|other projection) was given is "([^"]*)"$/,
  function (this: SpecWorld, which: string, called: string, event: string) {
    const position = which === "first" ? 0 : 1;
    assert.equal(eventsGivenTo(this, called)[position], event);
    const sofar = named.get(this) ?? new Map<string, number>();
    named.set(this, sofar);
    sofar.set(called, Math.max(sofar.get(called) ?? 0, position + 1));
  },
);

Then("the projection was given no other event", function (this: SpecWorld) {
  const given = eventsGivenTo(this, "projection");
  assert.equal(
    given.length,
    named.get(this)?.get("projection") ?? 0,
    `It was given ${inspect(given)}.`,
  );
});

Then("the projection was given nothing", function (this: SpecWorld) {
  assert.deepEqual(givenTo(this, "projection"), []);
});

const lastGivenTo = (world: SpecWorld): Delivery => {
  const given = givenTo(world, "projection").at(-1);
  assert.ok(given !== undefined, "The projection was given nothing.");
  return given;
};

Then("the projection was told the stream", function (this: SpecWorld) {
  const stream = this.streams[0];
  assert.ok(stream !== undefined, "No stream was named.");
  assert.ok(lastGivenTo(this).stream.equals(stream));
});

Then(
  "the projection was told they begin at event {int} of the stream",
  function (this: SpecWorld, first: number) {
    assert.equal(lastGivenTo(this).firstEvent, first);
  },
);

// What was kept, and what failed -------------------------------------------

Then("the stream holds no events", async function (this: SpecWorld) {
  const store = this.eventStore;
  const stream = this.streams[0];
  assert.ok(store !== undefined && stream !== undefined);
  const events = await this.asARequest(() => store.getEvents(stream));
  assert.deepEqual(events, [], `The stream holds ${inspect(events)}.`);
});

Then(
  "appending fails with the projection's own failure",
  function (this: SpecWorld) {
    assert.ok(this.plantedFailure !== undefined, "No projection failed.");
    assert.equal(this.failure, this.plantedFailure);
  },
);
