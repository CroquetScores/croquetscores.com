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

/**
 * What a value is, written into a statement as Postgres reads it.
 *
 * A number and a boolean are written as text in quotation marks, as a bound
 * parameter is sent: a value Postgres has not been told the type of takes the
 * one the place it is in asks for, so that it is read as a number beside a
 * number and as text beside text, and nothing is read differently for being
 * written in. It also puts no minus sign against whatever is before it.
 */
const literalOf = (connection: PoolClient, value: unknown): string => {
  if (value === null || value === undefined) return "null";
  if (
    typeof value === "boolean" ||
    typeof value === "number" ||
    typeof value === "bigint"
  ) {
    return connection.escapeLiteral(String(value));
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

const aPlace = /\$(\d+)/y;
const aDollarQuote = /\$[A-Za-z_]*\$/y;

/**
 * A statement with each place for a value written as the value. A `$1` inside a
 * quotation, a quoted name, a comment or a dollar quote is the words it is, and
 * is left as it is; a place for a value that was not given is refused here,
 * where Postgres would have refused it, and not sent as nothing.
 */
export const withValuesWritten = (
  connection: PoolClient,
  text: string,
  values: readonly unknown[],
): string => {
  let written = "";
  let at = 0;
  const copyTo = (end: number): void => {
    written += text.slice(at, end);
    at = end;
  };
  while (at < text.length) {
    const here = text[at];
    const next = text[at + 1];
    if (here === "-" && next === "-") {
      const end = text.indexOf("\n", at);
      copyTo(end < 0 ? text.length : end);
    } else if (here === "/" && next === "*") {
      let depth = 1;
      let end = at + 2;
      while (end < text.length && depth > 0) {
        if (text[end] === "/" && text[end + 1] === "*") {
          depth += 1;
          end += 2;
        } else if (text[end] === "*" && text[end + 1] === "/") {
          depth -= 1;
          end += 2;
        } else {
          end += 1;
        }
      }
      copyTo(end);
    } else if (here === "'" || here === '"') {
      // A quotation ends at the next mark that is not doubled, and in one
      // written with an E before it, at the next that has no backslash before it.
      const escaping = here === "'" && /[eE]/.test(text[at - 1] ?? "");
      let end = at + 1;
      while (end < text.length) {
        if (escaping && text[end] === "\\") end += 2;
        else if (text[end] === here && text[end + 1] === here) end += 2;
        else if (text[end] === here) break;
        else end += 1;
      }
      copyTo(end + 1);
    } else if (here === "$") {
      aPlace.lastIndex = at;
      const place = aPlace.exec(text);
      if (place !== null) {
        const index = Number(place[1]);
        if (index < 1 || index > values.length) {
          throw new Error(
            `A statement names a place for value ${String(index)} and was given ${String(values.length)}: ${text.slice(0, 200)}`,
          );
        }
        written += literalOf(connection, values[index - 1]);
        at += place[0].length;
      } else {
        aDollarQuote.lastIndex = at;
        const tag = aDollarQuote.exec(text);
        if (tag === null) {
          copyTo(at + 1);
        } else {
          const close = text.indexOf(tag[0], at + tag[0].length);
          copyTo(close < 0 ? text.length : close + tag[0].length);
        }
      }
    } else {
      copyTo(at + 1);
    }
  }
  return written;
};

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
    // Without a semicolon at the end, which the joining supplies, so that each
    // statement is one and the answers come back in the order they were kept.
    this.#kept.push(statement.replace(/[\s;]+$/, ""));
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
    const joined = statements.join("\n;\n");
    let answered: unknown;
    try {
      answered = await this.#connection.query(joined);
    } catch (failure) {
      throw namedAfter(failure, statements);
    }
    const answers = (Array.isArray(answered) ? answered : [answered]) as {
      rowCount: number | null;
    }[];
    for (const each of expecting) {
      if (answers[each.statement]?.rowCount !== 1) throw each.failure();
    }
  }
}

// A failure of the message as a whole says where in it, and so which of the
// statements it was, which is what the one who made the write has to be told.
const namedAfter = (
  failure: unknown,
  statements: readonly string[],
): unknown => {
  const position = Number((failure as { position?: unknown } | null)?.position);
  if (!(failure instanceof Error) || !Number.isInteger(position))
    return failure;
  let from = 0;
  for (const statement of statements) {
    const to = from + statement.length + "\n;\n".length;
    if (position - 1 < to) {
      failure.message += ` In the statement: ${statement.slice(0, 300)}`;
      return failure;
    }
    from = to;
  }
  return failure;
};
