// The server's log, read from the table ServerLogStream writes it to
// (PostgresServerLog.feature).
import {
  severities,
  type LogEntry,
  type LogFilter,
  type ServerLog,
  type Severity,
} from "../../application/services/ServerLog.js";
import type { UnitOfWork } from "./UnitOfWork.js";

/**
 * The numbers the log writes its levels in, which is what `severity` holds so
 * that "this and more severe" is a comparison.
 */
export const levelOf: Readonly<Record<Severity, number>> = {
  Trace: 10,
  Debug: 20,
  Info: 30,
  Warn: 40,
  Error: 50,
  Fatal: 60,
};

export const severityOf = (level: number): Severity =>
  // A level the log does not write in is read as the nearest below it, so
  // that a line from a newer logger is still shown rather than lost.
  [...severities].reverse().find((name) => levelOf[name] <= level) ?? "Trace";

export class PostgresServerLog implements ServerLog {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async read(filter: LogFilter): Promise<readonly LogEntry[]> {
    const { rows } = await this.unitOfWork.connection().query<{
      kept: string;
      written_at: Date;
      severity: number;
      message: string;
      details: unknown;
    }>(
      // The text is looked for in the message and in the whole line, since
      // the message is also in the line but only as JSON writes it, with its
      // quotes escaped. A backslash, percent sign and underscore in what was
      // typed are escaped so that `like` looks for them and not for a
      // pattern.
      `select kept, written_at, severity, message, details
         from server_log
        where severity >= $1
          and ($2::text is null
               or message ilike '%' || $2 || '%' escape '\\'
               or details::text ilike '%' || $2 || '%' escape '\\')
        order by written_at desc, kept desc
        limit $3`,
      [
        filter.severity === undefined ? 0 : levelOf[filter.severity],
        filter.mentioning === undefined
          ? null
          : filter.mentioning.replace(/[\\%_]/g, "\\$&"),
        filter.limit,
      ],
    );
    return rows.map((row) => ({
      id: row.kept,
      writtenAt: row.written_at.toISOString(),
      severity: severityOf(row.severity),
      message: row.message,
      details: row.details,
    }));
  }

  async removeBefore(moment: Date): Promise<number> {
    const removed = await this.unitOfWork
      .connection()
      .query("delete from server_log where written_at < $1", [moment]);
    return removed.rowCount ?? 0;
  }
}
