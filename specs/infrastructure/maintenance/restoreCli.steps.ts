import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomBytes } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import pg from "pg";

import {
  type RestoreOutcome,
  runRestore,
} from "../../../src/infrastructure/maintenance/restoreCli.js";
import type { SpecWorld } from "../../support/world.js";

// The restore script, run as its own function (`restoreCli.feature`) over the
// scenario's own Postgres. The databases it makes are named by the scenario
// and dropped by it. pg_restore is the scenario's, so that what it was asked
// is read, what the database had when it was asked is read, and it can be
// made to fail.

interface Restore {
  /** The name given, or nothing where none was. */
  name: string | undefined;
  /** What the names of databases that are made are called, to drop. */
  readonly made: string[];
  folder: string | undefined;
  file: string | undefined;
  fileIsGiven: boolean;
  pgDump: string | undefined;
  serverIsNamed: boolean;
  restoreFails: boolean;
  failureWords: string;
  extraArgument: boolean;
  calls: { address: string; file: string; program: string | undefined }[];
  tablesWereThere: boolean | undefined;
  /** What had been said when pg_restore was asked to begin. */
  saidWhenRestored: string[] | undefined;
  readonly said: string[];
  exitCode: 0 | 1 | undefined;
}

const restores = new WeakMap<SpecWorld, Restore>();

const restoreOf = (world: SpecWorld): Restore => {
  let found = restores.get(world);
  if (found === undefined) {
    found = {
      name: undefined,
      made: [],
      folder: undefined,
      file: undefined,
      fileIsGiven: true,
      pgDump: undefined,
      serverIsNamed: true,
      restoreFails: false,
      failureWords: "pg_restore ended with 1",
      extraArgument: false,
      calls: [],
      tablesWereThere: undefined,
      saidWhenRestored: undefined,
      said: [],
      exitCode: undefined,
    };
    restores.set(world, found);
  }
  return found;
};

const serverUrlOf = (world: SpecWorld): string => {
  const url = world.database.options.connectionString;
  assert.ok(url !== undefined, "The scenario's database has no URL.");
  return url;
};

const withDatabase = (address: string, database: string): string => {
  const url = new URL(address);
  url.pathname = `/${encodeURIComponent(database)}`;
  return url.toString();
};

// Named as the harness names its own databases, under the run the scenario's
// own database was made by, so that one left behind by a run that was
// stopped is dropped by the next run as the harness's are
// (specs/infrastructure/support/database.ts): its sweeper drops the
// databases of a run that is no longer going, by the shape of the name.
const uniqueName = (world: SpecWorld): string => {
  const own = /^(zzz_delete_me_spec_\d+)_[0-9a-f]+$/.exec(
    world.databaseName ?? "",
  );
  assert.ok(
    own !== null,
    `The scenario's database is not named as the harness names them: ${world.databaseName ?? "(none)"}`,
  );
  return `${own[1] ?? ""}_${randomBytes(8).toString("hex")}`;
};

// What the databases the scenario made and the folder it made are dropped and
// removed with it, whether or not the script dropped the database itself.
After(async function (this: SpecWorld) {
  const restore = restoreOf(this);
  for (const name of restore.made) {
    try {
      await this.database.query(
        `drop database if exists "${name}" with (force)`,
      );
    } catch {
      // Nothing to say, and nothing that saying it would improve.
    }
  }
  if (restore.folder !== undefined) {
    await rm(restore.folder, { recursive: true, force: true });
  }
});

// Whether `name` is a database of the server, asked as the scenario's own.
const isThere = async (world: SpecWorld, name: string): Promise<boolean> => {
  const found = await world.database.query(
    "select 1 from pg_database where datname = $1",
    [name],
  );
  return found.rowCount !== 0;
};

// The tables of `table_names` that `database` has, asked from a connection of
// its own.
const tablesOf = async (
  world: SpecWorld,
  database: string,
  tableNames: readonly string[],
): Promise<string[]> => {
  const client = new pg.Client({
    connectionString: withDatabase(serverUrlOf(world), database),
  });
  await client.connect();
  try {
    const found = await client.query<{ table_name: string }>(
      `select table_name from information_schema.tables
       where table_schema = 'public' and table_name = any($1)`,
      [tableNames],
    );
    return found.rows.map((row) => row.table_name).sort();
  } finally {
    await client.end();
  }
};

const WEBSITES_TABLES = ["account_keys", "events", "schema_migrations"];

// The names and the file ---------------------------------------------------

Given("the name of a database that is not there", function (this: SpecWorld) {
  const restore = restoreOf(this);
  restore.name = uniqueName(this);
  restore.made.push(restore.name);
});

Given(
  "the name of a database that is there",
  { timeout: 30_000 },
  async function (this: SpecWorld) {
    const restore = restoreOf(this);
    const name = restore.name ?? uniqueName(this);
    restore.name = name;
    if (!restore.made.includes(name)) restore.made.push(name);
    await this.database.query(`create database "${name}"`);
  },
);

Given("no database name is given", function (this: SpecWorld) {
  restoreOf(this).name = undefined;
});

Given("the database name {string}", function (this: SpecWorld, name: string) {
  restoreOf(this).name = name;
});

Given("a dump file", async function (this: SpecWorld) {
  const restore = restoreOf(this);
  restore.folder = await mkdtemp(join(tmpdir(), "restore-"));
  restore.file = join(restore.folder, "2026-10-13-10-00-00.dump");
  await writeFile(restore.file, "a dump");
});

Given("no dump file is given", function (this: SpecWorld) {
  restoreOf(this).fileIsGiven = false;
});

Given("the dump file is not there", async function (this: SpecWorld) {
  const { file } = restoreOf(this);
  assert.ok(file !== undefined, "No dump file was made.");
  await rm(file, { force: true });
});

Given(
  "the settings name pg_dump as {string}",
  function (this: SpecWorld, program: string) {
    restoreOf(this).pgDump = program;
  },
);

Given("no server is named", function (this: SpecWorld) {
  restoreOf(this).serverIsNamed = false;
});

// What pg_restore does -----------------------------------------------------

Given("pg_restore fails", function (this: SpecWorld) {
  restoreOf(this).restoreFails = true;
});

Given(
  "pg_restore fails saying {string}",
  function (this: SpecWorld, words: string) {
    const restore = restoreOf(this);
    restore.restoreFails = true;
    restore.failureWords = words;
  },
);

Given("pg_restore works", function (this: SpecWorld) {
  restoreOf(this).restoreFails = false;
});

// Running it ---------------------------------------------------------------

const run = async (world: SpecWorld): Promise<RestoreOutcome> => {
  const restore = restoreOf(world);
  const args: string[] = [];
  if (restore.name !== undefined) args.push(restore.name);
  if (restore.fileIsGiven && restore.file !== undefined) {
    args.push(restore.file);
  }
  if (restore.extraArgument) args.push("a third thing");

  const outcome = await runRestore(args, {
    settings: {
      databaseUrl: restore.serverIsNamed ? serverUrlOf(world) : undefined,
      pgDumpPath: restore.pgDump,
    },
    restore: async (request) => {
      restore.calls.push(request);
      restore.saidWhenRestored = [...restore.said];
      // What the database had when it was asked to be restored into.
      restore.tablesWereThere =
        (await tablesOf(world, restore.name ?? "", ["events", "account_keys"]))
          .length === 2;
      if (restore.restoreFails) throw new Error(restore.failureWords);
    },
    say: (line) => {
      restore.said.push(line);
    },
  });
  restore.exitCode = outcome.exitCode;
  return outcome;
};

// Making a database, migrating it and dropping it is a few seconds of
// Postgres's, and the default five is not enough for it when six scenarios
// are doing the same beside it.
const WHAT_MAKING_A_DATABASE_TAKES = 30_000;

When(
  "the restore is run",
  { timeout: WHAT_MAKING_A_DATABASE_TAKES },
  async function (this: SpecWorld) {
    await run(this);
  },
);

When(
  "the restore is run with a third argument",
  { timeout: WHAT_MAKING_A_DATABASE_TAKES },
  async function (this: SpecWorld) {
    restoreOf(this).extraArgument = true;
    await run(this);
  },
);

// What was made ------------------------------------------------------------

const nameOf = (world: SpecWorld): string => {
  const { name } = restoreOf(world);
  assert.ok(name !== undefined, "No database name was given.");
  return name;
};

Then("the restored database is there", async function (this: SpecWorld) {
  assert.equal(await isThere(this, nameOf(this)), true);
});

Then("the restored database is not there", async function (this: SpecWorld) {
  assert.equal(await isThere(this, nameOf(this)), false);
});

Then(
  "the database has the tables of the website",
  async function (this: SpecWorld) {
    assert.deepEqual(
      await tablesOf(this, nameOf(this), WEBSITES_TABLES),
      WEBSITES_TABLES,
    );
  },
);

Then(
  "the database has none of the website's tables",
  async function (this: SpecWorld) {
    assert.deepEqual(await tablesOf(this, nameOf(this), WEBSITES_TABLES), []);
  },
);

Then(
  "the tables were there when the file was restored",
  function (this: SpecWorld) {
    assert.equal(restoreOf(this).tablesWereThere, true);
  },
);

Then("the file was restored into the database", function (this: SpecWorld) {
  const { calls, file, name } = restoreOf(this);
  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.file, file);
  assert.equal(
    new URL(calls[0]?.address ?? "http://nothing.invalid").pathname,
    `/${name ?? ""}`,
  );
});

Then(
  "the file was restored by {string}",
  function (this: SpecWorld, program: string) {
    const { calls } = restoreOf(this);
    assert.equal(calls.length, 1);
    // The settings name pg_dump, and where pg_restore is follows from that;
    // none named leaves it to the computer to find pg_restore by its name.
    assert.equal(calls[0]?.program ?? "pg_restore", program);
  },
);

Then("pg_restore was not run", function (this: SpecWorld) {
  assert.equal(restoreOf(this).calls.length, 0);
});

// How it went --------------------------------------------------------------

Then("the restore exits with success", function (this: SpecWorld) {
  assert.equal(restoreOf(this).exitCode, 0);
});

Then("the restore exits with failure", function (this: SpecWorld) {
  assert.equal(restoreOf(this).exitCode, 1);
});

const saidOf = (world: SpecWorld): string => restoreOf(world).said.join("\n");

Then("the restore says the database was made", function (this: SpecWorld) {
  assert.match(saidOf(this), /was made, and the file was restored into it/);
});

Then(
  "the restore says the read models are still to be made",
  function (this: SpecWorld) {
    assert.match(saidOf(this), /The read models are still to be made/);
  },
);

Then(
  "the restore says the database is already there",
  function (this: SpecWorld) {
    assert.match(saidOf(this), /is already there/);
  },
);

Then("the restore says {string}", function (this: SpecWorld, words: string) {
  assert.ok(saidOf(this).includes(words), `It said: ${saidOf(this)}`);
});

Then(
  "the restore says the database it made was dropped",
  function (this: SpecWorld) {
    assert.match(saidOf(this), /it made was dropped/);
  },
);

Then("the restore says how it is run", function (this: SpecWorld) {
  assert.match(saidOf(this), /Usage: db:restore/);
});

Then("the restore says the file is not there", function (this: SpecWorld) {
  assert.match(saidOf(this), /The file is not there/);
});

Then(
  "the restore says the name is not one it will make",
  function (this: SpecWorld) {
    assert.match(saidOf(this), /The name is not one it will make/);
  },
);

Then("the restore says the server is not named", function (this: SpecWorld) {
  assert.match(saidOf(this), /The database server is not named/);
});

// What it says as it goes ---------------------------------------------------

Then("the restore says the database was created", function (this: SpecWorld) {
  assert.match(saidOf(this), /Database '.+' was created/);
});

Then(
  "the restore does not say the database was created",
  function (this: SpecWorld) {
    assert.doesNotMatch(saidOf(this), /was created/);
  },
);

Then(
  "the restore says it is importing {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(
      saidOf(this).includes(`Importing '${name}'...`),
      `It said: ${saidOf(this)}`,
    );
  },
);

Then(
  "the restore does not say it is importing a file",
  function (this: SpecWorld) {
    assert.doesNotMatch(saidOf(this), /Importing/);
  },
);

Then(
  "the restore does not say the folder the file is in",
  function (this: SpecWorld) {
    const { folder } = restoreOf(this);
    assert.ok(folder !== undefined, "No folder was made.");
    assert.ok(!saidOf(this).includes(folder), `It said: ${saidOf(this)}`);
  },
);

Then(
  "the database was said to be created before pg_restore was asked",
  function (this: SpecWorld) {
    const said = restoreOf(this).saidWhenRestored;
    assert.ok(said !== undefined, "pg_restore was never asked.");
    assert.ok(said.some((line) => /Database '.+' was created/.test(line)));
  },
);

Then(
  "the file was said to be imported before pg_restore was asked",
  function (this: SpecWorld) {
    const said = restoreOf(this).saidWhenRestored;
    assert.ok(said !== undefined, "pg_restore was never asked.");
    assert.ok(said.some((line) => /^Importing '.+'...$/.test(line)));
  },
);
