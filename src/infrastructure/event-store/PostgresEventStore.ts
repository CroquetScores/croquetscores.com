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

export class PostgresEventStore implements EventStore {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly registry: EventRegistry,
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
    const kept = events.map((event) => this.writeDown(event));

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
    return rows.map((row) => this.readBack(row));
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
const isTheVersionTaken = (failure: unknown): boolean => {
  const { code, constraint } = failure as {
    code?: unknown;
    constraint?: unknown;
  };
  return code === "23505" && constraint === "one_event_per_version";
};
