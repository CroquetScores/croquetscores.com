// A database of its own for every @postgres scenario. Two scenarios sharing one
// set of tables would pass or fail by the order they ran in.
import { After, AfterAll, Before } from "@cucumber/cucumber";
import { randomBytes } from "node:crypto";
import pg from "pg";

import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import { migrate } from "../../../src/infrastructure/database/migrate.js";
import { createPool } from "../../../src/infrastructure/database/pool.js";
import type { SpecWorld } from "../../support/world.js";

// Every database this harness makes is named for the prefix, so a run that was
// interrupted can be cleaned up by the next one.
const prefix = "spec_";

let maintenance: pg.Pool | undefined;
let serverUrl: string | undefined;

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
    const { rows } = await pool.query<{ datname: string }>(
      `select datname from pg_database where datname like $1`,
      [`${prefix}%`],
    );
    for (const { datname } of rows) {
      await pool.query(`drop database if exists "${datname}" with (force)`);
    }
  } catch (cause) {
    // Not kept, so that nothing later mistakes a pool that never worked for one
    // that did.
    await pool.end().catch(() => undefined);
    throw explain(serverUrl, cause);
  }

  maintenance = pool;
  return maintenance;
};

const nameFor = (databaseName: string): string => {
  const url = new URL(serverUrl!);
  url.pathname = `/${databaseName}`;
  return url.toString();
};

AfterAll(async () => {
  await maintenance?.end();
  maintenance = undefined;
});

Before({ tags: "@postgres" }, async function (this: SpecWorld) {
  const server = await connect();

  this.databaseName = prefix + randomBytes(16).toString("hex");
  await server.query(`create database "${this.databaseName}"`);

  this.pool = createPool(nameFor(this.databaseName));
  await migrate(this.pool);
});

After({ tags: "@postgres" }, async function (this: SpecWorld) {
  await this.pool?.end();
  this.pool = undefined;

  if (this.databaseName !== undefined && maintenance !== undefined) {
    await maintenance.query(
      `drop database if exists "${this.databaseName}" with (force)`,
    );
    this.databaseName = undefined;
  }
});
