// Copies the server's log into the database as it is written, for an
// administrator to read (PostgresServerLog.feature).
//
// It is the stream the logger writes to. A line goes to the file first, as it
// always did and before anything else is done with it, so what the file holds
// is the logger's output exactly, whether or not the database is there.
// Keeping a copy is then a convenience that may fail without anything else
// noticing.
import type { Pool } from "pg";

import { levelOf } from "../database/PostgresServerLog.js";

/** Where the log goes first, which is where it has always gone. */
export interface LogFile {
  write(line: string): unknown;
}

export interface ServerLogStreamOptions {
  /** The file, or whatever the logger wrote to before this. */
  readonly file: LogFile;
  /**
   * The database. Not the unit of work: a line is written outside any
   * request, and one connection serves the whole batch.
   */
  readonly database: Pick<Pool, "query">;
  /** Where the time comes from, which decides when old entries are removed. */
  readonly now: () => Date;
  /** Where a failure to keep the log is said. Standard error, left out. */
  readonly complain?: (text: string) => void;
}

const aSecond = 1000;
const anHour = 60 * 60 * 1000;
const sevenDays = 7 * 24 * anHour;
// What may wait to be kept. Past this a line is let go, still in the file,
// rather than growing memory against a burst or a database that is slow.
const mostWaiting = 10_000;

// A link a reader was sent carries a signature that lets whoever holds it act
// as the reader, so it is not kept where an administrator reads it.
const link = /([?&]link=)[^&\s"]*/g;
const withoutSecrets = (text: string): string =>
  // Postgres will not keep a null character in text, escaped or not.
  text.replaceAll("\u0000", "").replace(link, "$1[removed]");

interface Row {
  readonly writtenAt: Date;
  readonly level: number;
  readonly message: string;
  readonly details: string;
}

export class ServerLogStream {
  private waiting: Row[] = [];
  private flushing: Promise<void> = Promise.resolve();
  private lastPruned: number | undefined;
  private timer: NodeJS.Timeout | undefined;
  private saidLettingGo = false;

  constructor(private readonly options: ServerLogStreamOptions) {}

  /** Called by the logger with each line it writes, whole, line ending too. */
  write(line: string): void {
    this.options.file.write(line);
    if (this.waiting.length >= mostWaiting) {
      // Said once for the lines let go, not for each, which would be a flood
      // on top of the one that caused it.
      if (!this.saidLettingGo) {
        this.saidLettingGo = true;
        this.complain(new Error("too many lines were waiting"));
      }
      return;
    }
    try {
      this.waiting.push(this.rowOf(line));
    } catch (failure) {
      // Never let keeping a copy stop the logger.
      this.complain(failure);
      return;
    }
    // Kept in batches, a second after the first line waiting, so that a
    // request that writes five lines makes one trip to the database. The
    // timer does not hold the process open: a line that has not been kept by
    // the time the server stops is for `flush` to keep.
    this.timer ??= setTimeout(() => {
      void this.flush();
    }, aSecond).unref();
  }

  /**
   * Keeps every line waiting, and removes the entries that are old if it is
   * time to. Never rejects: a failure is said on standard error and the lines
   * are let go, rather than kept in memory against a database that may stay
   * away.
   */
  flush(): Promise<void> {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.flushing = this.flushing.then(() => this.keepWhatIsWaiting());
    return this.flushing;
  }

  private async keepWhatIsWaiting(): Promise<void> {
    const rows = this.waiting;
    this.waiting = [];
    this.saidLettingGo = false;
    if (rows.length === 0) return;
    try {
      await this.options.database.query(
        `insert into server_log (written_at, severity, message, details)
         select * from unnest($1::timestamptz[], $2::smallint[], $3::text[],
                              $4::jsonb[])`,
        [
          rows.map((row) => row.writtenAt),
          rows.map((row) => row.level),
          rows.map((row) => row.message),
          rows.map((row) => row.details),
        ],
      );
    } catch (failure) {
      this.complain(failure);
      return;
    }
    // On its own, so that lines that were kept are not said to have failed,
    // and so that removing is tried again at the next flush.
    try {
      await this.removeWhatIsOld();
    } catch (failure) {
      this.complain(failure);
    }
  }

  // Done as lines are kept, at most once an hour, so that nothing has to run
  // only to do it, and a server that writes nothing has nothing to remove.
  private async removeWhatIsOld(): Promise<void> {
    const now = this.options.now().getTime();
    if (this.lastPruned !== undefined && now - this.lastPruned < anHour) return;
    await this.options.database.query(
      "delete from server_log where written_at < $1",
      [new Date(now - sevenDays)],
    );
    // Only once it worked, so that a removal that failed is not put off for an
    // hour while the table grows.
    this.lastPruned = now;
  }

  private rowOf(line: string): Row {
    const text = line.replace(/\r?\n$/, "");
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = undefined;
    }
    const isLine =
      typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
    const fields = isLine
      ? (parsed as Record<string, unknown>)
      : { line: text };
    const level =
      typeof fields["level"] === "number" ? fields["level"] : levelOf.Info;
    const time = fields["time"];
    const written = typeof time === "number" ? new Date(time) : undefined;
    const message = isLine
      ? typeof fields["msg"] === "string"
        ? fields["msg"]
        : ""
      : text;
    return {
      writtenAt:
        written !== undefined && !Number.isNaN(written.getTime())
          ? written
          : this.options.now(),
      level,
      message: withoutSecrets(message),
      // Cleaned value by value, as they are written, and not as the finished
      // text: a backslash before the characters u0000 is a backslash and
      // those characters, and cutting them out of the text would leave the
      // backslash escaping the quote after it.
      details: JSON.stringify(fields, (_key, value: unknown) =>
        typeof value === "string" ? withoutSecrets(value) : value,
      ),
    };
  }

  private complain(failure: unknown): void {
    const said = failure instanceof Error ? failure.message : String(failure);
    (this.options.complain ?? ((text) => process.stderr.write(text)))(
      `The server's log could not be kept in the database: ${said}\n`,
    );
  }
}
