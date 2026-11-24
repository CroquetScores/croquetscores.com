// An event store that can be told to refuse reads for the work that has been
// marked, and no other work. It is what lets a scenario hold the public API to
// the read models (specs/web/api/v1/read-models-only/): the API's requests are
// marked as they arrive, and a read of the events inside one fails that request
// instead of quietly working.
//
// Per piece of work and not for the store as a whole, because a read of the
// events is wrong for a request to the API and perfectly right for a command:
// the same store serves both, and the only thing that tells them apart is whose
// work it is. Only reads are refused, so what is marked goes on appending.
//
// Only a site with the test control is given one (src/web/server.ts), and a
// site in production is handed the store itself.
import { AsyncLocalStorage } from "node:async_hooks";

import type { EventStore } from "../../application/services/EventStore.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";

/** Thrown when marked work reads the events while it is told not to. */
export class EventsReadByMarkedWork extends Error {
  constructor(stream: string) {
    super(
      `The events of ${stream} were read by work that is to read the read models only.`,
    );
    this.name = "EventsReadByMarkedWork";
  }
}

export class EventStoreWithRefusableReads implements EventStore {
  #refused = false;
  // Carried down the calls the work makes, so that no call has to be handed it.
  readonly #marked = new AsyncLocalStorage<true>();

  constructor(private readonly store: EventStore) {}

  /** Whether a read by marked work is refused from now on. */
  refuse(refused: boolean): void {
    this.#refused = refused;
  }

  /** Reads are allowed again, as a site that was never told is. */
  reset(): void {
    this.#refused = false;
  }

  /** Runs `work` marked, together with everything it goes on to do. */
  marked(work: () => void): void {
    this.#marked.run(true, work);
  }

  appendEvents(
    streamId: Id,
    expectedVersion: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    return this.store.appendEvents(streamId, expectedVersion, events);
  }

  getEvents(streamId: Id): Promise<readonly DomainEvent[]> {
    if (this.#refused && this.#marked.getStore() === true) {
      return Promise.reject(new EventsReadByMarkedWork(streamId.value));
    }
    return this.store.getEvents(streamId);
  }
}
