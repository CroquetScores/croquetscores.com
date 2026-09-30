// A database of its own for every @postgres scenario. Two scenarios sharing one
// set of tables would pass or fail by the order they ran in, and two runs
// sharing one — a second terminal, or the editor running a scenario while the
// suite runs — would do the same.
import { After, AfterAll, Before } from "@cucumber/cucumber";
import { randomBytes, randomInt } from "node:crypto";
import pg from "pg";

import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import { migrate } from "../../../src/infrastructure/database/migrate.js";
import { createPool } from "../../../src/infrastructure/database/pool.js";
import type { SpecWorld } from "../../support/world.js";

// Every database this harness makes is named for the prefix and for the run
// that made it, so that a run that was interrupted can be cleaned up by the
// next one without the next one also dropping the databases of a run that is
// still going. The prefix sorts them after every real database in a list of
// them, and says to whoever finds one there what it is for. The run's template
// is named the same way, so that one left behind is cleaned up with the rest.
const prefix = "zzz_delete_me_spec_";
const named = new RegExp(`^${prefix}(\\d+)_(?:[0-9a-f]+|template)$`);

// A run says it is still going by holding an advisory lock on its number for
// as long as it lasts, on a connection kept open for nothing else. Postgres lets
// go of the lock when that connection goes, however the run ended, so a lock
// that can be taken belongs to a run that is over. Asking the operating system
// whether a process is alive would do the same only where the run and whoever
// asks share a machine. The two-number form of the lock is used so that it
// cannot meet the one-number locks the migration runner takes.
const runs = 0x73706563; // "spec"

let maintenance: pg.Pool | undefined;
let held: pg.PoolClient | undefined;
let run: number | undefined;
let serverUrl: string | undefined;
let template: string | undefined;

// Opened by the first @postgres scenario and not before. Cucumber runs
// BeforeAll ahead of any tag filtering, so connecting there would mean every
// run needed a database — including "npm run test:nodb", whose whole point is
// that it does not.
// Postgres not running is the ordinary way for this to fail, and it is not a
// fault in anything here. Said plainly, with the command that fixes it, because
// the alternative is a stack trace through pg-pool that reads like a bug in the
// harness and does not mention that a container is involved at all.
const unreachable = new Set([
  "ECONNREFUSED",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "EAI_AGAIN",
]);

const explain = (url: string, cause: unknown): Error => {
  const code = (cause as { code?: unknown }).code;
  if (typeof code !== "string" || !unreachable.has(code)) {
    return new Error(`The database at ${where(url)} could not be prepared.`, {
      cause,
    });
  }

  return new Error(
    [
      `No database is listening at ${where(url)}.`,
      "",
      "These scenarios are tagged @postgres and run against the container in",
      "compose.yaml, which is started by:",
      "",
      "  npm run db:up",
      "",
      "Everything that needs no database runs without it:",
      "",
      "  npm run test:nodb",
    ].join("\n"),
    { cause },
  );
};

// Where to look, without the credentials that got us there.
const where = (url: string): string => {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}:${parsed.port === "" ? "5432" : parsed.port}`;
  } catch {
    return "the configured database";
  }
};

const connect = async (): Promise<pg.Pool> => {
  if (maintenance !== undefined) return maintenance;

  loadEnvFile();
  serverUrl = loadConfig().databaseUrl;
  const pool = createPool(serverUrl);

  try {
    const client = await pool.connect();
    held = client;
    run = await claimARun(client);

    const { rows } = await pool.query<{ datname: string }>(
      `select datname from pg_database where starts_with(datname, $1)`,
      [prefix],
    );
    for (const { datname } of rows) {
      if (await isLeftBehind(client, datname)) {
        await pool.query(`drop database if exists "${datname}" with (force)`);
      }
    }

    template = await migrateATemplate(pool, run);
  } catch (cause) {
    // Not kept, so that nothing later mistakes a pool that never worked for one
    // that did.
    held?.release();
    held = undefined;
    run = undefined;
    template = undefined;
    await pool.end().catch(() => undefined);
    throw explain(serverUrl, cause);
  }

  maintenance = pool;
  return maintenance;
};

// A number no run still going has, held until this one ends. Chosen at random
// rather than counted, because runs do not know about each other; and taken with
// a lock that is tried rather than waited for, so that two runs happening on the
// same number is a second draw rather than one run waiting for the other.
const claimARun = async (client: pg.PoolClient): Promise<number> => {
  for (;;) {
    const candidate = randomInt(1, 2 ** 31);
    const {
      rows: [claimed],
    } = await client.query<{ taken: boolean }>(
      "select pg_try_advisory_lock($1, $2) as taken",
      [runs, candidate],
    );
    if (claimed?.taken === true) return candidate;
  }
};

// Migrated once for the run, and copied for each scenario. Copying a database
// is a fraction of the cost of running every migration into an empty one, and
// the migrations were run once for every @postgres scenario: with six scenarios
// at a time, making and migrating each database took 407 milliseconds on
// average, and a fifth of all the time the suite spent in its steps. The copy
// is exact, so a scenario starts on the same tables either way. Made at the
// start of every run rather than kept between them, so that it is never behind
// the migrations it was made from.
const migrateATemplate = async (
  server: pg.Pool,
  number: number,
): Promise<string> => {
  const databaseName = `${prefix}${number}_template`;
  await server.query(`create database "${databaseName}"`);
  const pool = createPool(nameFor(databaseName));
  try {
    await migrate(pool);
  } finally {
    // Postgres copies a database only while nobody is connected to it.
    await pool.end();
  }
  return databaseName;
};

// Left behind by a run that is over: one whose lock can be taken, or one named
// before databases carried the run that made them.
const isLeftBehind = async (
  client: pg.PoolClient,
  databaseName: string,
): Promise<boolean> => {
  const owner = named.exec(databaseName)?.[1];
  if (owner === undefined) return true;

  const number = Number(owner);
  if (number === run) return false;

  const {
    rows: [claimed],
  } = await client.query<{ taken: boolean }>(
    "select pg_try_advisory_lock($1, $2) as taken",
    [runs, number],
  );
  if (claimed?.taken !== true) return false;

  await client.query("select pg_advisory_unlock($1, $2)", [runs, number]);
  return true;
};

const nameFor = (databaseName: string): string => {
  const url = new URL(serverUrl!);
  url.pathname = `/${databaseName}`;
  return url.toString();
};

AfterAll(async () => {
  if (template !== undefined) {
    await maintenance?.query(
      `drop database if exists "${template}" with (force)`,
    );
    template = undefined;
  }
  // Released rather than unlocked first: ending the pool closes the connection,
  // and the lock goes with it.
  held?.release();
  held = undefined;
  run = undefined;
  await maintenance?.end();
  maintenance = undefined;
});

Before({ tags: "@postgres" }, async function (this: SpecWorld) {
  const server = await connect();

  this.databaseName = `${prefix}${run!}_${randomBytes(8).toString("hex")}`;
  await server.query(
    `create database "${this.databaseName}" template "${template!}"`,
  );

  this.pool = createPool(nameFor(this.databaseName));
});

After({ tags: "@postgres" }, async function (this: SpecWorld) {
  // The database is about to be dropped, so a connection that failed on its way
  // out has nothing left to tell anyone, and the scenario's own verdict is not
  // the teardown's to overturn. The pool's error listener covers an idle client
  // failing; this covers end() itself refusing, which is a different thing.
  for (const close of [...this.closeBeforeDropping, () => this.pool?.end()]) {
    try {
      await close();
    } catch {
      // Nothing to say, and nothing that saying it would improve.
    }
  }
  this.closeBeforeDropping = [];
  this.pool = undefined;

  if (this.databaseName !== undefined && maintenance !== undefined) {
    await maintenance.query(
      `drop database if exists "${this.databaseName}" with (force)`,
    );
    this.databaseName = undefined;
  }
});
