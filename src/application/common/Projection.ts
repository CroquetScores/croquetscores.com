import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";

/**
 * What keeps one read model: given events as they are appended, it writes what
 * they mean for its table.
 *
 * It is told the stream, and the number of the first event within it —
 * counting from 1 — as well as the events, so that it can tell a stream it has
 * seen from one it has not, and so that projecting the same events a second
 * time, as rebuilding a read model from the beginning does, changes nothing.
 * Every projection is required to be safe to run twice.
 *
 * It runs inside the append, in the same transaction, and whatever it writes
 * it writes on the connection of the request being served. A projection that
 * throws fails the append, and everything is taken back with it.
 */
export interface Projection {
  project(
    stream: Id,
    firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void>;
}
