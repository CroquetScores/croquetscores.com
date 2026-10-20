/**
 * The severities the log writes in, from the least severe to the most
 * (PostgresServerLog.feature).
 */
export const severities = [
  "Trace",
  "Debug",
  "Info",
  "Warn",
  "Error",
  "Fatal",
] as const;

export type Severity = (typeof severities)[number];

export const isSeverity = (written: string): written is Severity =>
  (severities as readonly string[]).includes(written);

/** One line of the server's log, as it was kept. */
export interface LogEntry {
  /** Which entry it is, in the order they were kept. */
  readonly id: string;
  /** When the line was written, as an ISO 8601 moment. */
  readonly writtenAt: string;
  readonly severity: Severity;
  readonly message: string;
  /** The whole line, as an object, whatever it carried. */
  readonly details: unknown;
}

/** What to narrow the entries read to. Nothing is left out for being absent. */
export interface LogFilter {
  /** This severity and every more severe one. */
  readonly severity?: Severity | undefined;
  /**
   * Text to find in what an entry says or anything else it carried, in any
   * case. Not a pattern: a percent sign is a percent sign.
   */
  readonly mentioning?: string | undefined;
  /** No more than this many entries, the newest. */
  readonly limit: number;
}

/**
 * Where the server's log is kept for an administrator to read
 * (PostgresServerLog.feature). What writes it is not the application's: the
 * server's logger does, outside any request.
 */
export interface ServerLog {
  /** The entries that match, the newest first. */
  read(filter: LogFilter): Promise<readonly LogEntry[]>;

  /**
   * Removes every entry written before `moment`, and answers how many that
   * was. An entry written at exactly `moment` is kept.
   */
  removeBefore(moment: Date): Promise<number>;
}
