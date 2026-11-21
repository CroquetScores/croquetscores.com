// A connection that keeps back the writes made through it and sends them
// together (BatchingConnection.feature).
//
// Making the read models again is millions of writes, and what each costs is
// not the writing but the asking: a round trip for every statement, when the
// database has nothing to wait for. A write that has nothing to say in answer
// is kept back here and sent with the ones after it as one message, and the
// work that made it goes on as though it had been sent.
//
// Nothing is reordered. A statement that reads, or that answers with rows,
// sends what was kept back first, so it finds what was written before it as it
// would have if each write had been sent when it was made. Anything else it is
// handed it sends as it is handed it.
//
// The message is one string, which carries no values beside it, so each write
// is sent with its values written into it. That is done here and nowhere else,
// from what Postgres itself reads as a value: a quotation mark, a backslash and
// a dollar sign in a name are a name.
import type { PoolClient } from "pg";

/** Kept back at most this many writes, or this many characters, before sending. */
const MOST_WRITES = 1000;
const MOST_CHARACTERS = 4 * 1024 * 1024;

// A statement that changes something and answers with nothing the caller reads.
const isAWrite = /^\s*(insert|update|delete)\b/i;
const answersWithRows = /\breturning\b/i;

/** What a value is, written into a statement as Postgres reads it. */
const literalOf = (connection: PoolClient, value: unknown): string => {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number" || typeof value === "bigint") {
    // Text, which Postgres reads as the number the column or cast says, so that
    // a value that is no number (NaN) is said so and not made into something.
    return Number.isFinite(Number(value))
      ? String(value)
      : connection.escapeLiteral(String(value));
  }
  if (typeof value === "string") return connection.escapeLiteral(value);
  if (value instanceof Date)
    return connection.escapeLiteral(value.toISOString());
  if (Buffer.isBuffer(value))
    return `decode('${value.toString("hex")}', 'hex')`;
  if (Array.isArray(value)) {
    return connection.escapeLiteral(arrayOf(value));
  }
  return connection.escapeLiteral(JSON.stringify(value));
};

// A list as Postgres writes one: each part in double quotes, with a quotation
// mark or a backslash in it made plain by a backslash before it, and a list in
// a list in braces of its own.
const arrayOf = (list: readonly unknown[]): string =>
  `{${list
    .map((part): string => {
      if (part === null || part === undefined) return "NULL";
      if (Array.isArray(part)) return arrayOf(part);
      const text =
        part instanceof Date
          ? part.toISOString()
          : typeof part === "string"
            ? part
            : typeof part === "number" ||
                typeof part === "boolean" ||
                typeof part === "bigint"
              ? String(part)
              : JSON.stringify(part);
      return `"${text.replace(/["\\]/g, "\\$&")}"`;
    })
    .join(",")}}`;

/** A statement with each place for a value written as the value. */
export const withValuesWritten = (
  connection: PoolClient,
  text: string,
  values: readonly unknown[],
): string =>
  // Once, over the statement as it was given, so that a value that looks like a
  // place for one is not read as it.
  text.replace(/\$(\d+)/g, (_place, index: string) =>
    literalOf(connection, values[Number(index) - 1]),
  );

interface Expectation {
  /** Which of the statements sent, from the first, is meant to change one row. */
  readonly statement: number;
  readonly failure: () => Error;
}

export class BatchingConnection {
  readonly #connection: PoolClient;
  #kept: string[] = [];
  #characters = 0;
  #expecting: Expectation[] = [];
  /** What work is given in place of the connection it is running on. */
  readonly connection: PoolClient;

  constructor(connection: PoolClient) {
    this.#connection = connection;
    const query = (first: unknown, values?: unknown): Promise<unknown> =>
      this.#query(first, values);
    this.connection = new Proxy(connection, {
      get: (target, property) => {
        if (property === "query") return query;
        const value: unknown = Reflect.get(target, property, target);
        return typeof value === "function"
          ? (value as (...parameters: unknown[]) => unknown).bind(target)
          : value;
      },
    });
  }

  async #query(first: unknown, values: unknown): Promise<unknown> {
    const given = values === undefined ? [] : values;
    if (
      typeof first === "string" &&
      Array.isArray(given) &&
      isAWrite.test(first) &&
      !answersWithRows.test(first)
    ) {
      await this.#keep(withValuesWritten(this.#connection, first, given));
      // What a write answers, when nobody asked for its rows: how many it
      // changed is the one thing a caller reads, and one that must change
      // exactly one says so (`expectingOneRow`).
      return { command: "", rowCount: null, oid: 0, rows: [], fields: [] };
    }
    await this.flush();
    return (
      this.#connection.query as (...parameters: unknown[]) => Promise<unknown>
    ).call(
      this.#connection,
      ...(values === undefined ? [first] : [first, values]),
    );
  }

  async #keep(statement: string): Promise<void> {
    this.#kept.push(statement);
    this.#characters += statement.length;
    if (
      this.#kept.length >= MOST_WRITES ||
      this.#characters >= MOST_CHARACTERS
    ) {
      await this.flush();
    }
  }

  /**
   * Keeps back a write that is to change exactly one row, and fails the work
   * with `failure` when it does not, at the latest when what is kept back is
   * sent.
   */
  async expectingOneRow(
    text: string,
    values: readonly unknown[],
    failure: () => Error,
  ): Promise<void> {
    this.#expecting.push({ statement: this.#kept.length, failure });
    await this.#keep(withValuesWritten(this.#connection, text, values));
  }

  /** Sends what was kept back, as one message. */
  async flush(): Promise<void> {
    if (this.#kept.length === 0) return;
    const statements = this.#kept;
    const expecting = this.#expecting;
    this.#kept = [];
    this.#expecting = [];
    this.#characters = 0;
    // More than one statement to a message is answered with one answer for each.
    // The break before each semicolon is so that a statement that ends in a
    // comment does not take it into the comment.
    const answered: unknown = await this.#connection.query(
      statements.join("\n;\n"),
    );
    const answers = (Array.isArray(answered) ? answered : [answered]) as {
      rowCount: number | null;
    }[];
    for (const each of expecting) {
      if (answers[each.statement]?.rowCount !== 1) throw each.failure();
    }
  }
}
