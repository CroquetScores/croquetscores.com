// Events kept in Postgres, in the table the first migration made.
//
// The store has no connection of its own. It asks the unit of work for the one
// the request it is serving is running on, so what it appends is committed or
// rolled back with everything else the command did — and appending or reading
// where no request is being served is refused by the unit of work, as it is for
// anything else that asks.
import {
  AppendRefused,
  type EventStore,
  ReadRefused,
} from "../../application/services/EventStore.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import {
  type EventRegistry,
  EventRegistryRefused,
  type KeptEvent,
} from "../../domain/common/EventRegistry.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";

/**
 * What is done to an event between being written down and being kept, and
 * between being read and being read back: encrypting what is personal in it,
 * say. Given the stream it belongs to, since that decides whose it is.
 */
export interface KeptEventSealing {
  seal(stream: string, kept: KeptEvent): Promise<KeptEvent>;
  open(stream: string, kept: KeptEvent): Promise<KeptEvent>;
}

/** An event read back, with the stream it is in and where in it. */
export interface StoredEvent {
  readonly stream: string;
  readonly version: number;
  readonly event: DomainEvent;
}

// Kept as it was written down, for anything that seals nothing.
const asItIs: KeptEventSealing = {
  seal: (_stream, kept) => Promise.resolve(kept),
  open: (_stream, kept) => Promise.resolve(kept),
};

export class PostgresEventStore implements EventStore {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly registry: EventRegistry,
    private readonly sealing: KeptEventSealing = asItIs,
  ) {}

  async appendEvents(
    streamId: Id,
    expectedVersion: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    if (!Number.isInteger(expectedVersion) || expectedVersion < 0) {
      throw new AppendRefused(
        "EventStore.VersionNotACount",
        `${String(expectedVersion)} is not a version a stream could be at.`,
      );
    }
    if (events.length === 0) {
      throw new AppendRefused(
        "EventStore.NothingToAppend",
        `Nothing was given to append to ${streamId.value}.`,
      );
    }

    // Every event is written down before anything is written, so that one the
    // store could never read back refuses the whole append rather than leaving
    // the others kept around a gap.
    const written = events.map((event) => this.writeDown(event));

    const connection = this.unitOfWork.connection();
    const { rows } = await connection.query<{ version: number }>(
      `select coalesce(max(version), 0)::int as version
         from events
        where stream_id = $1`,
      [streamId.value],
    );
    const version = rows[0]?.version ?? 0;
    if (version !== expectedVersion) {
      throw concurrency(streamId, version, expectedVersion);
    }

    // Sealed only once the append is certain. Sealing may leave something of
    // its own behind — an account's key is made as its registering is sealed,
    // and deleted as its forgetting is — and an append refused for the version
    // it expected is to leave nothing at all.
    const kept: KeptEvent[] = [];
    for (const each of written) {
      kept.push(await this.sealing.seal(streamId.value, each));
    }

    try {
      for (const [index, { name, data }] of kept.entries()) {
        await connection.query(
          `insert into events (stream_id, version, name, data)
           values ($1, $2, $3, $4)`,
          [streamId.value, expectedVersion + index + 1, name, data],
        );
      }
    } catch (failure) {
      // Another command found the stream at the same version and got its
      // append in first. The check above could not see it, because it had not
      // committed; the key could, and made this one wait until it had. It is
      // the same refusal as any other append expecting a version the stream is
      // not at, because a caller retries on that and would not know to retry on
      // a database error.
      if (isTheVersionTaken(failure)) {
        throw concurrency(streamId, expectedVersion + 1, expectedVersion);
      }
      throw failure;
    }
  }

  async getEvents(streamId: Id): Promise<readonly DomainEvent[]> {
    const { rows } = await this.unitOfWork.connection().query<KeptEvent>(
      `select name, data
           from events
          where stream_id = $1
          order by version`,
      [streamId.value],
    );
    const events: DomainEvent[] = [];
    for (const row of rows) {
      events.push(this.readBack(await this.sealing.open(streamId.value, row)));
    }
    return events;
  }

  /**
   * Every stream there is, by its name, in the order of the names, which says
   * nothing of when it was begun (a stream's name is a random uuid). What
   * rebuilding a read model counts its work in.
   */
  async streamIds(): Promise<readonly string[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ stream_id: string }>(
        `select distinct stream_id from events order by stream_id`,
      );
    return rows.map((row) => row.stream_id);
  }

  /** The events of one stream, in the order they were kept. */
  async readStream(streamId: string): Promise<readonly StoredEvent[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<KeptEvent & { version: number }>(
        `select version, name, data
           from events
          where stream_id = $1
          order by version`,
        [streamId],
      );
    const stored: StoredEvent[] = [];
    for (const row of rows) {
      const kept = await this.sealing.open(streamId, row);
      stored.push({
        stream: streamId,
        version: row.version,
        event: this.readBack(kept),
      });
    }
    return stored;
  }

  /**
   * Every event kept, stream by stream and each stream in order, as rebuilding
   * a read model from the beginning reads them.
   *
   * Which stream comes first says nothing: the table records no order across
   * streams, and a stream's name is a random uuid. A read model rebuilt from
   * these has to work whichever stream it is handed first.
   */
  async readAll(): Promise<readonly StoredEvent[]> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<KeptEvent & { stream_id: string; version: number }>(
        `select stream_id, version, name, data
           from events
          order by stream_id, version`,
      );
    const stored: StoredEvent[] = [];
    for (const row of rows) {
      const kept = await this.sealing.open(row.stream_id, row);
      stored.push({
        stream: row.stream_id,
        version: row.version,
        event: this.readBack(kept),
      });
    }
    return stored;
  }

  private writeDown(event: DomainEvent): KeptEvent {
    try {
      return this.registry.writeDown(event);
    } catch (failure) {
      if (isRefused(failure, "EventRegistry.UnknownKind")) {
        throw new AppendRefused(
          "EventStore.UnknownEvent",
          `${event.constructor.name} could be kept but never read back, so it is not kept.`,
        );
      }
      throw failure;
    }
  }

  private readBack(kept: KeptEvent): DomainEvent {
    try {
      return this.registry.readBack(kept);
    } catch (failure) {
      if (isRefused(failure, "EventRegistry.UnknownName")) {
        throw new ReadRefused(
          "EventStore.UnknownEvent",
          `The stream holds an event kept as "${kept.name}", which is not a kind this store knows.`,
          failure,
        );
      }
      throw failure;
    }
  }
}

const concurrency = (
  streamId: Id,
  version: number,
  expected: number,
): AppendRefused =>
  new AppendRefused(
    "EventStore.Concurrency",
    `${streamId.value} is at version ${version}, and the append expected ${expected}.`,
  );

const isRefused = (failure: unknown, code: string): boolean =>
  failure instanceof EventRegistryRefused && failure.code === code;

// 23505 is unique_violation, and this is the only key an append can break.
// What is thrown is whatever the driver threw, which may be anything at all,
// so it is asked whether it is something with fields before its fields are
// read: a rejection with nothing in it is not this, and must not become a
// TypeError that hides what really failed.
const isTheVersionTaken = (failure: unknown): boolean =>
  typeof failure === "object" &&
  failure !== null &&
  (failure as { code?: unknown }).code === "23505" &&
  (failure as { constraint?: unknown }).constraint === "one_event_per_version";
