// An event store that keeps every read model in step with the events as they
// are appended, rather than leaving a separate process to catch up with them.
//
// Every event appended is given to every projection as part of the append, in
// the same transaction, so a command either records what happened and brings
// every read model up to date with it, or does neither. A read model is never
// behind, and there is no half-done middle, no worker to supervise and no
// checkpoint to drift. What that costs is that every append waits for every
// projection.
//
// It stands in front of whichever store keeps the events, so that anything
// appending is projected without having to ask, and nothing can append around
// the projections by forgetting to.
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { EventStore } from "../services/EventStore.js";
import type { Projection } from "./Projection.js";

export class ProjectingEventStore implements EventStore {
  constructor(
    private readonly store: EventStore,
    private readonly projections: readonly Projection[],
  ) {}

  /**
   * Appends, and then gives what was appended to every projection in turn. An
   * append the store refuses throws before any projection is given anything,
   * since nothing happened; a projection that throws fails the append, and
   * the transaction around it takes the events back as well.
   */
  async appendEvents(
    streamId: Id,
    expectedVersion: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    await this.store.appendEvents(streamId, expectedVersion, events);
    for (const projection of this.projections) {
      await projection.project(streamId, expectedVersion + 1, events);
    }
  }

  getEvents(streamId: Id): Promise<readonly DomainEvent[]> {
    return this.store.getEvents(streamId);
  }
}
