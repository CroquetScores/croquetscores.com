import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";

/** Every reason an append can be refused. */
export type EventStoreErrorCode =
  | "EventStore.Concurrency"
  | "EventStore.NothingToAppend"
  | "EventStore.VersionNotACount";

/**
 * An append the store will not make. Named by a code, because the code is the
 * contract: a caller retries on a concurrency refusal and fixes its code on
 * the other kind, and it tells them apart by this rather than by the words.
 */
export class AppendRefused extends Error {
  readonly code: EventStoreErrorCode;

  constructor(code: EventStoreErrorCode, message: string) {
    super(message);
    this.name = "AppendRefused";
    this.code = code;
  }
}

/**
 * Where events are kept: a stream for each thing that lasts, named by its id,
 * holding every event that ever happened to it in the order it happened.
 *
 * This is what the application wants of a store, and every implementation is
 * held to the scenarios in specs/application/services/event-store/. It cannot
 * read across streams, because no command or query has any business doing so.
 */
export interface EventStore {
  /**
   * Appends `events` to the stream, which must be at `expectedVersion` — the
   * number of events it holds, 0 for one nobody has written to. Refused with
   * `EventStore.Concurrency` when it is not, with `EventStore.NothingToAppend`
   * when there is nothing to append, and with `EventStore.VersionNotACount`
   * when the version is not a whole number of zero or more — a mistake in the
   * caller, not a sign that somebody else got there first. Nothing is appended
   * when an append is refused.
   */
  appendEvents(
    streamId: Id,
    expectedVersion: number,
    events: readonly DomainEvent[],
  ): Promise<void>;

  /** Every event in the stream, in the order it was appended. */
  getEvents(streamId: Id): Promise<readonly DomainEvent[]>;
}
