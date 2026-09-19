// A thing that exists only to exercise what every thing that lasts shares, and
// what every repository of them does. It can be opened with a name and
// renamed, and that is all.
//
// Here rather than beside the aggregate root's feature because the repository's
// feature loads and saves the same thing, and a second copy of it would be a
// second set of events the store has never heard of.
//
// Loaded by every spec in the repository, so it names nothing from
// infrastructure or the web.
import type { AccountId } from "../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { AggregateRoot } from "../../src/domain/common/AggregateRoot.js";
import { DomainEvent } from "../../src/domain/common/DomainEvent.js";
import { EventRegistry } from "../../src/domain/common/EventRegistry.js";
import { Id } from "../../src/domain/common/Id.js";
import type { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "./world.js";

const kind = "thing";

export class ExampleThingId extends Id {
  static create(): ExampleThingId {
    return new ExampleThingId(Id.mint(kind));
  }

  static from(written: string): ExampleThingId {
    return new ExampleThingId(Id.read(kind, written));
  }
}

export class Opened extends DomainEvent {
  constructor(
    readonly name: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}

export class Renamed extends DomainEvent {
  constructor(
    readonly name: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}

export class ExampleThing extends AggregateRoot {
  name = "";

  static open(
    id: ExampleThingId,
    name: string,
    by: AccountId,
    at: ReadOnlyDate,
  ): ExampleThing {
    const thing = new ExampleThing(id);
    thing.record(new Opened(name, by, at));
    return thing;
  }

  static rebuiltFrom(
    id: ExampleThingId,
    events: readonly DomainEvent[],
  ): ExampleThing {
    const thing = new ExampleThing(id);
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

const nameIn = (said: Readonly<Record<string, unknown>>): string => {
  if (typeof said.name !== "string") {
    throw new TypeError("An example thing's event was kept without a name.");
  }
  return said.name;
};

/** A registry that knows the example thing's two kinds of event. */
export const exampleThingRegistry = (): EventRegistry =>
  new EventRegistry()
    .name(
      Opened,
      "thing-opened",
      (said, { createdBy, occurredAt }) =>
        new Opened(nameIn(said), createdBy, occurredAt),
    )
    .name(
      Renamed,
      "thing-renamed",
      (said, { createdBy, occurredAt }) =>
        new Renamed(nameIn(said), createdBy, occurredAt),
    );

// What a scenario has: the stream a thing is rebuilt from, the thing it is
// looking at now, and the copies of it it loaded. Kept here rather than on the
// world, which has no business knowing that an example thing exists; shared,
// because the aggregate root's steps and the repository's both look at "it".
export interface ThingScenario {
  stream: DomainEvent[];
  thing?: ExampleThing | undefined;
  // The id of the thing the scenario is about, once it has one.
  id?: ExampleThingId;
  copies: Map<string, ExampleThing>;
  // Whether a load has been asked for, so that "nothing is found" can tell a
  // thing that was looked for and not found from one nobody looked for.
  looked?: boolean;
}

const scenarios = new WeakMap<SpecWorld, ThingScenario>();

export const thingScenarioOf = (world: SpecWorld): ThingScenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = { stream: [], copies: new Map() };
    scenarios.set(world, scenario);
  }
  return scenario;
};
