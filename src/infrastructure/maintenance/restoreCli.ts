import { stat } from "node:fs/promises";
import type { Pool } from "pg";

import { migrate } from "../database/migrate.js";
import { createPool } from "../database/pool.js";
import { pgRestoreProgramFor } from "./pgRestore.js";
import { withoutAddress } from "./withoutAddress.js";

export interface RestoreOutcome {
  readonly exitCode: 0 | 1;
}

/** What the script is told, as its settings give it (Config.ts). */
export interface RestoreSettings {
  /**
   * `DATABASE_URL`: where the Postgres is, and who it is asked as. Its own
   * database is not the one made, and is not touched.
   */
  readonly databaseUrl: string | undefined;
  /**
   * `PG_DUMP_PATH`, which names where pg_restore is as well: it is beside
   * pg_dump (pgRestore.feature).
   */
  readonly pgDumpPath: string | undefined;
}

/** What the script is given of the world it runs in. */
export interface RestoreWorld {
  readonly settings: RestoreSettings;
  /**
   * Puts the data of `file` into the database at `address`, which has the
   * website's tables. Throws, with what went wrong as its message, where it
   * could not (pgRestore.feature).
   */
  readonly restore: (request: {
    readonly address: string;
    readonly file: string;
    readonly program: string | undefined;
  }) => Promise<void>;
  readonly say: (line: string) => void;
}

// What a database made here may be called. It is put in a statement as an
// identifier, quoted, so what is allowed is what needs no more than that; and
// a name with a hyphen, as the development database has, is one.
const A_NAME = /^[A-Za-z0-9_-]{1,63}$/;

const isAFile = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

// The last of a path, as either kind of computer writes one.
const nameOfFile = (path: string): string => path.split(/[\\/]/).pop() ?? path;

/** `address` with another database for its own. */
const withDatabase = (address: string, database: string): string => {
  const url = new URL(address);
  url.pathname = `/${encodeURIComponent(database)}`;
  return url.toString();
};

/**
 * The script's work, with the arguments as the command line gives them
 * (restoreCli.feature): makes a database of the name, gives it the website's
 * tables, and puts the file's data into them. Never into a database that was
 * there, and where it fails the one it made is dropped.
 */
export const runRestore = async (
  args: readonly string[],
  world: RestoreWorld,
): Promise<RestoreOutcome> => {
  const { say } = world;
  const [name, file] = args;

  if (args.length !== 2 || name === undefined || file === undefined) {
    say("Usage: db:restore -- <database name> <dump file>");
    return { exitCode: 1 };
  }
  if (!A_NAME.test(name)) {
    say(
      "The name is not one it will make: letters, digits, hyphens and underscores, and no more than 63 of them.",
    );
    return { exitCode: 1 };
  }
  if (!(await isAFile(file))) {
    say(`The file is not there: ${file}`);
    return { exitCode: 1 };
  }
  const { databaseUrl } = world.settings;
  if (databaseUrl === undefined || databaseUrl === "") {
    say("The database server is not named: DATABASE_URL.");
    return { exitCode: 1 };
  }

  let server: Pool | undefined;
  let made: Pool | undefined;
  let created = false;
  try {
    // The server's own database, which is there whatever else is, since the
    // one being made cannot be asked of from itself.
    server = createPool(withDatabase(databaseUrl, "postgres"));
    const there = await server.query(
      "select 1 from pg_database where datname = $1",
      [name],
    );
    if (there.rowCount !== 0) {
      say(
        `A database called ${name} is already there. It is not restored into: a restore only makes a database.`,
      );
      return { exitCode: 1 };
    }

    await server.query(`create database "${name}"`);
    created = true;
    say(`Database '${name}' was created`);
    const address = withDatabase(databaseUrl, name);

    made = createPool(address);
    const applied = await migrate(made);
    say(`The tables were made: ${String(applied.length)} migrations.`);
    // Let go of it before pg_restore connects, and so that it can be dropped.
    await made.end();
    made = undefined;

    // Said before it begins, since the import is the part that takes a while,
    // and a script that is silent that long cannot be told from one that has
    // stopped. By the file's own name, and not the whole of where it is.
    say(`Importing '${nameOfFile(file)}'...`);
    await world.restore({
      address,
      file,
      program: pgRestoreProgramFor(world.settings.pgDumpPath),
    });
    say(`The database ${name} was made, and the file was restored into it.`);
    say(
      `The read models are still to be made: with DATABASE_URL naming ${name}, run npm run db:rebuild-read-models.`,
    );
    return { exitCode: 0 };
  } catch (failure) {
    say("The restore failed.");
    say(
      `Why: ${withoutAddress(failure instanceof Error ? failure.message : String(failure), databaseUrl)}`,
    );
    if (created && server !== undefined) {
      try {
        if (made !== undefined) {
          await made.end();
          made = undefined;
        }
        // Only the one it made, which it knows it did since it found none of
        // the name before it began.
        await server.query(`drop database if exists "${name}" with (force)`);
        say(`The database ${name} it made was dropped.`);
      } catch (dropping) {
        say(
          `The database ${name} it made could not be dropped: ${withoutAddress(dropping instanceof Error ? dropping.message : String(dropping), databaseUrl)}`,
        );
      }
    }
    return { exitCode: 1 };
  } finally {
    await made?.end().catch(() => undefined);
    await server?.end().catch(() => undefined);
  }
};
