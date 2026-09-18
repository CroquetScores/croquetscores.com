import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AccountId } from "../../../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { AggregateRoot } from "../../../../src/domain/common/AggregateRoot.js";
import { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { causedBy, happenedAt } from "../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../support/world.js";

// A thing that exists only to exercise what every thing shares. It can be
// opened with a name and renamed, and that is all.

class Opened extends DomainEvent {
  constructor(
    readonly name: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}

class Renamed extends DomainEvent {
  constructor(
    readonly name: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}

class ExampleThing extends AggregateRoot {
  name = "";

  static open(name: string, by: AccountId, at: ReadOnlyDate): ExampleThing {
    const thing = new ExampleThing();
    thing.record(new Opened(name, by, at));
    return thing;
  }

  static rebuiltFrom(events: readonly DomainEvent[]): ExampleThing {
    const thing = new ExampleThing();
    thing.replay(events);
    return thing;
  }

  rename(name: string, by: AccountId, at: ReadOnlyDate): void {
    this.record(new Renamed(name, by, at));
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof Opened || event instanceof Renamed) {
      this.name = event.name;
    }
  }
}

// What a scenario has: the stream a thing is rebuilt from, and the thing.
// Kept here rather than on the world, which has no business knowing that an
// example thing exists.
interface Scenario {
  stream: DomainEvent[];
  thing?: ExampleThing;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = { stream: [] };
    scenarios.set(world, scenario);
  }
  return scenario;
};

const thingOf = (world: SpecWorld): ExampleThing => {
  const thing = scenarioOf(world).thing;
  assert.ok(thing !== undefined, "There is no example thing.");
  return thing;
};

// Who is doing things to the thing, and when, as the account and moment
// steps set them.
const who = (world: SpecWorld): AccountId => {
  assert.ok(world.account !== undefined, "No account has been named.");
  return world.account;
};

const when = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const recordedAt = (world: SpecWorld, position: number): DomainEvent => {
  const event = thingOf(world).recorded[position];
  assert.ok(event !== undefined, `It recorded nothing at ${position + 1}.`);
  return event;
};

const renamingAt = (world: SpecWorld, position: number, name: string): void => {
  const event = recordedAt(world, position);
  assert.ok(event instanceof Renamed, `It recorded ${inspect(event)}.`);
  assert.equal(event.name, name);
};

// The stream a thing is rebuilt from -------------------------------------

Given(
  "a stream where the example thing was opened as {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).stream.push(new Opened(name, causedBy, happenedAt));
  },
);

Given(
  "the example thing was then renamed {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).stream.push(new Renamed(name, causedBy, happenedAt));
  },
);

// What is done to it ----------------------------------------------------

When(
  "a new example thing is opened as {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).thing = ExampleThing.open(name, who(this), when(this));
  },
);

When(
  "the example thing is rebuilt from the stream",
  function (this: SpecWorld) {
    const scenario = scenarioOf(this);
    scenario.thing = ExampleThing.rebuiltFrom(scenario.stream);
  },
);

When("it is renamed {string}", function (this: SpecWorld, name: string) {
  thingOf(this).rename(name, who(this), when(this));
});

When("what it recorded is handed over", function (this: SpecWorld) {
  thingOf(this).handOver();
});

// What came of it --------------------------------------------------------

Then("it is called {string}", function (this: SpecWorld, name: string) {
  assert.equal(thingOf(this).name, name);
});

Then(
  "it expects its stream to be at version {int}",
  function (this: SpecWorld, version: number) {
    assert.equal(thingOf(this).expectedVersion, version);
  },
);

Then("it has recorded nothing", function (this: SpecWorld) {
  assert.deepEqual(thingOf(this).recorded, []);
});

Then(
  "it has recorded {int} event(s)",
  function (this: SpecWorld, count: number) {
    assert.equal(thingOf(this).recorded.length, count);
  },
);

Then(
  "the first thing it recorded is its opening as {string}",
  function (this: SpecWorld, name: string) {
    const event = recordedAt(this, 0);
    assert.ok(event instanceof Opened, `It recorded ${inspect(event)}.`);
    assert.equal(event.name, name);
  },
);

Then(
  "the first thing it recorded is its renaming to {string}",
  function (this: SpecWorld, name: string) {
    renamingAt(this, 0, name);
  },
);

Then(
  "the second thing it recorded is its renaming to {string}",
  function (this: SpecWorld, name: string) {
    renamingAt(this, 1, name);
  },
);

Then(
  "what it recorded was caused by {string}",
  function (this: SpecWorld, account: string) {
    const recorded = thingOf(this).recorded;
    assert.ok(recorded.length > 0, "It recorded nothing.");
    for (const event of recorded) {
      assert.ok(event.createdBy.equals(AccountId.from(account)));
    }
  },
);

Then(
  "what it recorded happened at {string}",
  function (this: SpecWorld, moment: string) {
    const recorded = thingOf(this).recorded;
    assert.ok(recorded.length > 0, "It recorded nothing.");
    for (const event of recorded) {
      assert.equal(event.occurredAt.toISOString(), moment);
    }
  },
);
