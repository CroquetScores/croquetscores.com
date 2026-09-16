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
const connect = async (): Promise<pg.Pool> => {
  if (maintenance !== undefined) return maintenance;

  loadEnvFile();
  serverUrl = loadConfig().databaseUrl;
  maintenance = createPool(serverUrl);

  const { rows } = await maintenance.query<{ datname: string }>(
    `select datname from pg_database where datname like $1`,
    [`${prefix}%`],
  );
  for (const { datname } of rows) {
    await maintenance.query(
      `drop database if exists "${datname}" with (force)`,
    );
  }

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
