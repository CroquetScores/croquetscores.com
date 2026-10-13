// The example kinds of event, and a registry that knows them. They mean
// nothing, which is the point: they exist to exercise what keeps events — the
// event store, each implementation of it, and the registry — and the features
// for all three are written in the same words about the same two kinds.
//
// Here rather than beside any one of those features, for the reason
// examples.ts gives: an event of a kind registered against a second copy of
// its class is an event the registry has never heard of.
//
// Loaded by every spec in the repository, so it names nothing from
// infrastructure or the web.
import { AccountId } from "../../src/domain/aggregates/accounts/AccountId.js";
import { DomainEvent } from "../../src/domain/common/DomainEvent.js";
import {
  EventRegistry,
  type ReadBack,
} from "../../src/domain/common/EventRegistry.js";
import { ReadOnlyDate } from "../../src/domain/common/ReadOnlyDate.js";

/**
 * The example kind. It is called something so that a scenario can tell which
 * came back where, and it can say where it happened — which it could not
 * always do, so that an event kept before it could is there to be read back.
 */
export class ExampleEvent extends DomainEvent {
  constructor(
    readonly called: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
    readonly where: string | undefined = undefined,
  ) {
    super(createdBy, occurredAt);
  }
}

/** The other kind, so that a scenario can tell two kinds apart. */
export class OtherEvent extends DomainEvent {
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
export const causedBy = AccountId.from(
  "account/123e4567-e89b-42d3-a456-426614174000",
);
export const happenedAt = ReadOnlyDate.from(new Date("2026-09-17T09:00:00Z"));

export const exampleEvent = (called: string): ExampleEvent =>
  new ExampleEvent(called, causedBy, happenedAt);

export const otherEvent = (called: string): OtherEvent =>
  new OtherEvent(called, causedBy, happenedAt);

const calledIn = (said: Readonly<Record<string, unknown>>): string => {
  const called = said.called;
  if (typeof called !== "string") {
    throw new TypeError("An example event was kept without being called.");
  }
  return called;
};

// Where is read only if it is there. An event kept before the kind could say
// where it happened has nothing there, and is read back as saying nothing
// about where — which is what a kind that has gained a field has to do.
export const readExampleEvent: ReadBack<ExampleEvent> = (
  said,
  { createdBy, occurredAt },
) =>
  new ExampleEvent(
    calledIn(said),
    createdBy,
    occurredAt,
    typeof said.where === "string" ? said.where : undefined,
  );

export const readOtherEvent: ReadBack<OtherEvent> = (
  said,
  { createdBy, occurredAt },
) => new OtherEvent(calledIn(said), createdBy, occurredAt);

/**
 * A registry that knows the example kind as "example" and, unless told
 * otherwise, the other kind as "other".
 */
export const exampleRegistry = ({
  knowsTheOtherKind = true,
  on = new EventRegistry(),
}: {
  knowsTheOtherKind?: boolean;
  /** A registry to add the examples to, for a scenario that needs the kinds of a real one beside them. */
  on?: EventRegistry;
} = {}): EventRegistry => {
  const registry = on.name(ExampleEvent, "example", readExampleEvent);
  return knowsTheOtherKind
    ? registry.name(OtherEvent, "other", readOtherEvent)
    : registry;
};
