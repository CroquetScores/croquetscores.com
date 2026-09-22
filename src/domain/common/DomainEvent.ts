import type { AccountId } from "../aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "./ReadOnlyDate.js";

// How Node asks an object to describe itself. Named by the well-known key
// rather than by importing node:util, so nothing in the domain depends on Node.
const INSPECT: unique symbol = Symbol.for(
  "nodejs.util.inspect.custom",
) as never;

/** What every event shows when it is written out as data. */
interface Written {
  readonly createdBy: string;
  readonly occurredAt: string;
}

/**
 * A record that something happened.
 *
 * Whatever else an event says, it says which account caused it and when it
 * happened, so that anyone reading the record later can tell who did what and
 * when. Both are read through getters over fields nothing outside can reach,
 * so that neither can be changed once the event exists: an event is a record
 * of the past, and a record that could be amended afterwards would be a
 * record of nothing in particular.
 *
 * The moment is not read from a clock. It arrives with the request that
 * caused the event, decided once at the edge, so that everything one request
 * records is stamped with one time.
 *
 * What each kind of event says besides is the subclass's own, and so is
 * keeping it unchangeable: this cannot freeze an object whose subclass has
 * not finished making it. Private fields are invisible to JSON and to
 * console.log, so both are told to show the two alongside whatever the
 * subclass has.
 */
export abstract class DomainEvent {
  readonly #createdBy: AccountId;
  readonly #occurredAt: ReadOnlyDate;

  protected constructor(createdBy: AccountId, occurredAt: ReadOnlyDate) {
    this.#createdBy = createdBy;
    this.#occurredAt = occurredAt;
  }

  /** The account whose request caused this. */
  get createdBy(): AccountId {
    return this.#createdBy;
  }

  /** When it happened. */
  get occurredAt(): ReadOnlyDate {
    return this.#occurredAt;
  }

  toJSON(): Written {
    return {
      ...(this as object),
      createdBy: this.#createdBy.value,
      occurredAt: this.#occurredAt.toISOString(),
    };
  }

  [INSPECT](): string {
    return `${this.constructor.name} ${JSON.stringify(this.toJSON())}`;
  }
}
