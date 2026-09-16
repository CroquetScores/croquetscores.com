// A database of its own for every @postgres scenario. Two scenarios sharing one
// set of tables would pass or fail by the order they ran in.
import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
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

const nameFor = (databaseName: string): string => {
  const url = new URL(serverUrl!);
  url.pathname = `/${databaseName}`;
  return url.toString();
};

BeforeAll(async () => {
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
});

AfterAll(async () => {
  await maintenance?.end();
});

Before({ tags: "@postgres" }, async function (this: SpecWorld) {
  this.databaseName = prefix + randomBytes(16).toString("hex");
  await maintenance!.query(`create database "${this.databaseName}"`);

  this.pool = createPool(nameFor(this.databaseName));
  await migrate(this.pool);
});

After({ tags: "@postgres" }, async function (this: SpecWorld) {
  await this.pool?.end();
  this.pool = undefined;

  if (this.databaseName !== undefined) {
    await maintenance!.query(
      `drop database if exists "${this.databaseName}" with (force)`,
    );
    this.databaseName = undefined;
  }
});
