// Taking the scenario's database away from the application and giving it
// back, the way a database is lost: it stops accepting connections, and the
// ones it has are ended.
//
// Done to the real database rather than to a stand-in for it, so that the
// site is held to what Postgres actually says when it is down — "not
// currently accepting connections", "terminating connection due to
// administrator command" — and not to what a stand-in was made to say. Each
// scenario has a database of its own (specs/infrastructure/support/database.ts),
// so taking it away is nobody else's loss.
import pg from "pg";

import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import type { SpecWorld } from "../../support/world.js";
import { builtFor } from "./application.js";

// Asked of the server rather than of the scenario's database, which is the
// one being taken away: a database that has stopped accepting connections
// would not take the connection to say so.
const throughTheServer = async (
  work: (client: pg.Client) => Promise<void>,
): Promise<void> => {
  loadEnvFile();
  const client = new pg.Client({ connectionString: loadConfig().databaseUrl });
  await client.connect();
  try {
    await work(client);
  } finally {
    await client.end();
  }
};

const databaseOf = (world: SpecWorld): string => {
  const name = world.databaseName;
  if (name === undefined) throw new Error("This scenario has no database.");
  return name;
};

// The connections the application's pool held are ended from the other side,
// and the pool learns of it a moment later. Waiting until it has means the
// next request meets a pool with nothing in it, which is what it meets after
// a real outage has gone on for a while; one that did not wait would
// sometimes be handed a connection already dead, and say so differently.
const untilTheApplicationNoticed = async (world: SpecWorld): Promise<void> => {
  const { pool } = builtFor(world).application;
  const until = Date.now() + 2_000;
  while (pool.totalCount > 0 && Date.now() < until) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
};

/** Has the database refuse connections, and ends the ones it has. */
export const takeTheDatabaseAway = async (world: SpecWorld): Promise<void> => {
  const name = databaseOf(world);
  await throughTheServer(async (client) => {
    await client.query(`alter database "${name}" with allow_connections false`);
    await client.query(
      `select pg_terminate_backend(pid) from pg_stat_activity
        where datname = $1 and pid <> pg_backend_pid()`,
      [name],
    );
  });
  await untilTheApplicationNoticed(world);
};

/** Has the database take connections again. */
export const giveTheDatabaseBack = async (world: SpecWorld): Promise<void> => {
  const name = databaseOf(world);
  await throughTheServer(async (client) => {
    await client.query(`alter database "${name}" with allow_connections true`);
  });
};
