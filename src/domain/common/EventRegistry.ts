import { AccountId } from "../aggregates/accounts/AccountId.js";
import type { DomainEvent } from "./DomainEvent.js";
import { ReadOnlyDate } from "./ReadOnlyDate.js";
import { Refused } from "./Refused.js";

/** Every reason the registry can refuse. */
export type EventRegistryErrorCode =
  | "EventRegistry.NameTaken"
  | "EventRegistry.AlreadyNamed"
  | "EventRegistry.UnknownKind"
  | "EventRegistry.UnknownName"
  | "EventRegistry.Unreadable";

/**
 * Something the registry will not do. Named by a code, because the code is the
 * contract: the first two are mistakes in how the application was put
 * together, and the rest are an event that cannot be kept or read back.
 */
export class EventRegistryRefused extends Refused<EventRegistryErrorCode> {}

/** An event as it is kept: the name its kind goes by, and what it said. */
export interface KeptEvent {
  readonly name: string;
  readonly data: Readonly<Record<string, unknown>>;
}

/** Who caused an event and when, already read back, as every kind has them. */
export interface Stamp {
  readonly createdBy: AccountId;
  readonly occurredAt: ReadOnlyDate;
}

/**
 * How one kind of event is made again from what was kept of it. `said` is
 * everything the event wrote down besides who caused it and when, which the
 * registry reads for every kind alike and hands over already read.
 *
 * A kind only ever gains fields, and only ones it can do without, so a reader
 * has to cope with any field added since the kind began being absent: an event
 * kept before it existed does not have it.
 *
 * A field it cannot do without that is missing, or is not what it should be,
 * is thrown, saying which field. The registry names the event it was.
 */
export type ReadBack<TEvent extends DomainEvent> = (
  said: Readonly<Record<string, unknown>>,
  stamp: Stamp,
) => TEvent;

type Kind = abstract new (...parameters: never[]) => DomainEvent;

/**
 * Which name each kind of event is kept under, and which kind a kept name is
 * read back as.
 *
 * A name is given to one kind and a kind has one name, and both are refused
 * when the registry is put together — which is when the application starts —
 * rather than found when the first event is read back as something it was not.
 * A registry knows only the kinds there are today, so it cannot see that a name
 * was once given to something else. Never reusing one across the years is the
 * business of whoever writes a kind.
 */
export class EventRegistry {
  // Kinds are found by the class an event is an instance of, and names by the
  // text that was kept. A reader is stored under its name rather than its kind,
  // because reading back starts from a name and has no kind to look up by.
  readonly #namesByKind = new Map<Kind, string>();
  readonly #readersByName = new Map<string, ReadBack<DomainEvent>>();

  /**
   * Keeps events of `kind` under `name`, and reads them back with `readBack`.
   * Refused with `EventRegistry.AlreadyNamed` when the kind has a name, and
   * with `EventRegistry.NameTaken` when the name belongs to another kind.
   */
  name<TEvent extends DomainEvent>(
    kind: abstract new (...parameters: never[]) => TEvent,
    name: string,
    readBack: ReadBack<TEvent>,
  ): this {
    const already = this.#namesByKind.get(kind);
    if (already !== undefined) {
      throw new EventRegistryRefused(
        "EventRegistry.AlreadyNamed",
        `${kind.name} is already kept as "${already}", and a kind has one name.`,
      );
    }
    if (this.#readersByName.has(name)) {
      throw new EventRegistryRefused(
        "EventRegistry.NameTaken",
        `"${name}" already belongs to another kind of event, and a name has one kind.`,
      );
    }
    this.#namesByKind.set(kind, name);
    this.#readersByName.set(name, readBack);
    return this;
  }

  /**
   * `event` as it is kept. Refused with `EventRegistry.UnknownKind` when its
   * kind has no name, because it could be written down and never read back.
   */
  writeDown(event: DomainEvent): KeptEvent {
    const name = this.#namesByKind.get(event.constructor as Kind);
    if (name === undefined) {
      throw new EventRegistryRefused(
        "EventRegistry.UnknownKind",
        `${event.constructor.name} has not been given a name to be kept under.`,
      );
    }

    // Through JSON and back, so that what is handed on to be kept is only what
    // JSON can carry. Whatever would not survive that would not survive being
    // kept either, and this is the place to find it rather than a table.
    const data = JSON.parse(JSON.stringify(event)) as Record<string, unknown>;
    return { name, data };
  }

  /**
   * The event `kept` was made from. Refused with `EventRegistry.UnknownName`
   * when nothing was given its name, and with `EventRegistry.Unreadable` when
   * what was kept cannot say who caused it or when, or its kind cannot read
   * what it says.
   */
  readBack(kept: KeptEvent): DomainEvent {
    const read = this.#readersByName.get(kept.name);
    if (read === undefined) {
      throw new EventRegistryRefused(
        "EventRegistry.UnknownName",
        `Nothing is kept under "${kept.name}", so there is nothing to read it back as.`,
      );
    }

    const { createdBy, occurredAt, ...said } = kept.data;
    const stamp = {
      createdBy: causeOf(kept.name, createdBy),
      occurredAt: momentOf(kept.name, occurredAt),
    };
    try {
      return read(said, stamp);
    } catch (cause) {
      throw new EventRegistryRefused(
        "EventRegistry.Unreadable",
        `What was kept as "${kept.name}" cannot be read: ${cause instanceof Error ? cause.message : String(cause)}.`,
        cause,
      );
    }
  }
}

// What was kept comes back from a table that something other than the registry
// could have written to. An event that says something untrue about who did
// what and when is worse than none, so a cause or a moment that cannot be read
// is refused here rather than made into one.

const causeOf = (name: string, written: unknown): AccountId => {
  try {
    if (typeof written !== "string") throw new TypeError("not text");
    return AccountId.from(written);
  } catch (cause) {
    throw new EventRegistryRefused(
      "EventRegistry.Unreadable",
      `What was kept as "${name}" does not say which account caused it.`,
      cause,
    );
  }
};

const momentOf = (name: string, written: unknown): ReadOnlyDate => {
  try {
    if (typeof written !== "string") throw new TypeError("not text");
    return ReadOnlyDate.from(new Date(written));
  } catch (cause) {
    throw new EventRegistryRefused(
      "EventRegistry.Unreadable",
      `What was kept as "${name}" does not say when it happened.`,
      cause,
    );
  }
};
