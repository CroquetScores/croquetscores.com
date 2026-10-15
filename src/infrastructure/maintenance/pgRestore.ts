// Asking pg_restore, the program Postgres comes with, to put the data of a
// file pg_dump wrote into a database (pgRestore.feature).
import {
  connectionOf,
  type Ended,
  environmentOf,
  lastLinesOf,
  type Program,
  type RunProgram,
  runProgramOfTheComputer,
} from "./pgDump.js";

export type PgRestoreRefusal =
  "PgRestore.AddressNotUnderstood" | "PgRestore.NotRun" | "PgRestore.Failed";

export class PgRestoreRefused extends Error {
  constructor(
    readonly code: PgRestoreRefusal,
    message: string,
  ) {
    super(message);
    this.name = "PgRestoreRefused";
  }
}

/** What is asked of pg_restore. */
export interface PgRestoreRequest {
  /** The address of the database the data is put into. */
  readonly address: string;
  /** The file pg_dump wrote. */
  readonly file: string;
  /** The program to run, as the computer finds it; pg_restore where absent. */
  readonly program?: string | undefined;
}

/**
 * Where pg_restore is, given where the settings say pg_dump is: the file of
 * the same folder with pg_restore for its name, so that one setting says
 * where both are. Nothing where pg_dump is not named, or the name is of
 * something else, which leaves it to the computer to find pg_restore by that
 * name.
 */
export const pgRestoreProgramFor = (
  pgDump: string | undefined,
): string | undefined => {
  if (pgDump === undefined) return undefined;
  const separator = Math.max(pgDump.lastIndexOf("\\"), pgDump.lastIndexOf("/"));
  const folder = pgDump.slice(0, separator + 1);
  const file = pgDump.slice(separator + 1);
  if (!file.toLowerCase().startsWith("pg_dump")) return undefined;
  // What follows the name is kept, as ".exe" is.
  return `${folder}pg_restore${file.slice("pg_dump".length)}`;
};

/**
 * What `request` is asked of pg_restore as: the data and no more, since the
 * tables are the migrations'; no owners, since the user the file was made by
 * is not this database's; and to stop at the first thing that goes wrong,
 * since a restore that goes on past one has put some of the data in and
 * called it done. The address as its parts, and the password in the
 * environment and not among the arguments.
 */
export const pgRestoreProgram = (request: PgRestoreRequest): Program => {
  const connection = connectionOf(request.address);
  if (connection === undefined) {
    throw new PgRestoreRefused(
      "PgRestore.AddressNotUnderstood",
      "The database is not named by an address Postgres reads.",
    );
  }
  return {
    command: request.program ?? "pg_restore",
    args: [
      "--data-only",
      "--no-owner",
      "--exit-on-error",
      "--no-password",
      "--host",
      connection.host,
      "--port",
      connection.port,
      ...(connection.user === "" ? [] : ["--username", connection.user]),
      "--dbname",
      connection.database,
      // Last, as pg_restore takes the file as what is left over.
      request.file,
    ],
    env: environmentOf(connection),
  };
};

/**
 * Has pg_restore put the data of `request.file` into the database. Refused,
 * by a code, where the address is not one, where there is no pg_restore to
 * run, or where pg_restore ended in failure, with what it said.
 */
export const runPgRestore = async (
  request: PgRestoreRequest,
  run: RunProgram = runProgramOfTheComputer,
): Promise<void> => {
  const program = pgRestoreProgram(request);
  let ended: Ended;
  try {
    ended = await run(program);
  } catch (failure) {
    const why = failure instanceof Error ? failure.message : String(failure);
    throw new PgRestoreRefused(
      "PgRestore.NotRun",
      `pg_restore could not be run: ${why}`,
    );
  }
  if (ended.code !== 0) {
    const said = lastLinesOf(ended.said);
    throw new PgRestoreRefused(
      "PgRestore.Failed",
      said === ""
        ? `pg_restore ended with ${String(ended.code)}.`
        : `pg_restore ended with ${String(ended.code)}: ${said}`,
    );
  }
};
