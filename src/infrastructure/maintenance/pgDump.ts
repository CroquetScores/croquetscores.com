// Asking pg_dump, the program Postgres comes with, for a copy of some tables
// of a database (pgDump.feature).
import { spawn } from "node:child_process";

export type PgDumpRefusal =
  "PgDump.AddressNotUnderstood" | "PgDump.NotRun" | "PgDump.Failed";

export class PgDumpRefused extends Error {
  constructor(
    readonly code: PgDumpRefusal,
    message: string,
  ) {
    super(message);
    this.name = "PgDumpRefused";
  }
}

/** A program to run, with what it is given. */
export interface Program {
  readonly command: string;
  readonly args: readonly string[];
  /** Added to the environment the program is run in. */
  readonly env: Readonly<Record<string, string>>;
}

/** How a program ended, and what it said as it did. */
export interface Ended {
  /** Its exit code, or nothing where it was ended by a signal. */
  readonly code: number | null;
  readonly said: string;
}

/**
 * Runs `program`. Throws where it could not be run at all, as where there is
 * none by that name; a program that ran and failed is an {@link Ended}.
 */
export type RunProgram = (program: Program) => Promise<Ended>;

/** What is asked of pg_dump. */
export interface PgDumpRequest {
  /** The address of the database. */
  readonly address: string;
  /** The file it writes. */
  readonly file: string;
  /** The tables it dumps, and no other. */
  readonly tables: readonly string[];
  /** The program to run, as the computer finds it; pg_dump where absent. */
  readonly program?: string | undefined;
}

const NOT_AN_ADDRESS =
  "The website's database is not named by an address Postgres reads.";

/** A database address, as the parts a Postgres program is given it as. */
export interface Connection {
  readonly host: string;
  readonly port: string;
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly sslMode: string | undefined;
}

/**
 * The parts of `address`, or nothing where it is not a Postgres address.
 * Percent-escapes are undone, so that a name or a password is as it was
 * written.
 */
export const connectionOf = (address: string): Connection | undefined => {
  let url: URL;
  try {
    url = new URL(address);
  } catch {
    return undefined;
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    return undefined;
  }
  const sslMode = url.searchParams.get("sslmode");
  return {
    // The brackets an address puts round an IPv6 host are its own, and not
    // part of the host.
    host: decodeURIComponent(url.hostname).replace(/^\[|\]$/g, ""),
    port: url.port === "" ? "5432" : url.port,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    sslMode: sslMode === null || sslMode === "" ? undefined : sslMode,
  };
};

/** What a Postgres program is given of `connection` in its environment. */
export const environmentOf = (
  connection: Connection,
): Readonly<Record<string, string>> => ({
  ...(connection.password === "" ? {} : { PGPASSWORD: connection.password }),
  ...(connection.sslMode === undefined
    ? {}
    : { PGSSLMODE: connection.sslMode }),
});

/**
 * What `request` is asked of pg_dump as: the address as its parts, and the
 * password in the environment and not among the arguments, where anybody who
 * can list a computer's programs can read it.
 */
export const pgDumpProgram = (request: PgDumpRequest): Program => {
  const connection = connectionOf(request.address);
  if (connection === undefined) {
    throw new PgDumpRefused("PgDump.AddressNotUnderstood", NOT_AN_ADDRESS);
  }
  return {
    command: request.program ?? "pg_dump",
    args: [
      "--format=custom",
      // Never wait to be asked for a password at a screen nobody is at, as
      // a scheduled task has none.
      "--no-password",
      "--file",
      request.file,
      ...request.tables.map((table) => `--table=${table}`),
      "--host",
      connection.host,
      "--port",
      connection.port,
      ...(connection.user === "" ? [] : ["--username", connection.user]),
      "--dbname",
      connection.database,
    ],
    env: environmentOf(connection),
  };
};

// The last of what a program said, which is where it says why.
export const lastLinesOf = (said: string): string =>
  said
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .slice(-3)
    .join(" ");

/** Runs a program of the computer, as it is found there. */
export const runProgramOfTheComputer: RunProgram = (program) =>
  new Promise((resolve, reject) => {
    const child = spawn(program.command, [...program.args], {
      env: { ...process.env, ...program.env },
      stdio: ["ignore", "ignore", "pipe"],
      windowsHide: true,
    });
    let said = "";
    child.stderr.on("data", (chunk: Buffer) => {
      said += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code, said });
    });
  });

/**
 * Has pg_dump write the tables `request` names of the database it gives the
 * address of to its file. Refused, by a code, where the address is not one,
 * where there is no pg_dump to run, or where pg_dump ended in failure, with
 * what it said.
 */
export const runPgDump = async (
  request: PgDumpRequest,
  run: RunProgram = runProgramOfTheComputer,
): Promise<void> => {
  const program = pgDumpProgram(request);
  let ended: Ended;
  try {
    ended = await run(program);
  } catch (failure) {
    const why = failure instanceof Error ? failure.message : String(failure);
    // A path that has no program at it is most often the folder the program
    // is in, which a computer says no more of than that there is none there.
    const hint =
      request.program === undefined
        ? ""
        : " PG_DUMP_PATH has to name the file, as C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe, and not the folder it is in.";
    throw new PgDumpRefused(
      "PgDump.NotRun",
      `pg_dump could not be run: ${why}${hint}`,
    );
  }
  if (ended.code !== 0) {
    const said = lastLinesOf(ended.said);
    throw new PgDumpRefused(
      "PgDump.Failed",
      said === ""
        ? `pg_dump ended with ${String(ended.code)}.`
        : `pg_dump ended with ${String(ended.code)}: ${said}`,
    );
  }
};
