import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import type { SpecWorld } from "../../support/world.js";
import {
  aSiteKey,
  keepAccounts,
} from "../../infrastructure/support/accounts.js";
import { importDatabaseOf } from "../importing.js";

// Read from where the migration runner reads them, so that a migration added
// is one this expects without being told.
const migrations = join(
  import.meta.dirname,
  "../../../src/infrastructure/database/migrations",
);

interface Kept {
  // The account each user was kept as, by the website and the document.
  readonly accounts: Map<string, string>;
  lookedFor?: string | undefined;
}

const kept = new WeakMap<SpecWorld, Kept>();

const keptOf = (world: SpecWorld): Kept => {
  const found = kept.get(world) ?? { accounts: new Map() };
  kept.set(world, found);
  return found;
};

const keyOf = (website: string, documentId: string): string =>
  `${website}/${documentId}`;

// "left_over" in the schema the database starts in, "elsewhere.left_over" in
// the schema before the dot.
const tableNamed = (
  named: string,
): { schema: string | undefined; table: string } => {
  const dot = named.indexOf(".");
  return dot === -1
    ? { schema: undefined, table: named }
    : { schema: named.slice(0, dot), table: named.slice(dot + 1) };
};

Given("an import's database", function (this: SpecWorld) {
  keepAccounts(this, aSiteKey());
  importDatabaseOf(this);
});

When("the import's database is emptied", async function (this: SpecWorld) {
  await importDatabaseOf(this).reset();
});

Given(
  "an error is kept for {string} saying {string}",
  async function (this: SpecWorld, documentId: string, message: string) {
    await importDatabaseOf(this).recordError(documentId, message);
  },
);

Given(
  "{string} on {string} is kept as an account at {string}",
  async function (
    this: SpecWorld,
    documentId: string,
    website: string,
    address: string,
  ) {
    const account = randomUUID();
    await importDatabaseOf(this).recordImportedUser(
      website,
      documentId,
      account,
      address,
    );
    keptOf(this).accounts.set(keyOf(website, documentId), account);
  },
);

Given("a schema {string}", async function (this: SpecWorld, schema: string) {
  await this.database.query(`create schema "${schema}"`);
});

Given(
  "a table {string} nobody migrated",
  async function (this: SpecWorld, named: string) {
    const { schema, table } = tableNamed(named);
    await this.database.query(
      `create table ${schema === undefined ? "" : `"${schema}".`}"${table}" (id int)`,
    );
  },
);

Then(
  "there is no table {string}",
  async function (this: SpecWorld, named: string) {
    const { schema, table } = tableNamed(named);
    const { rows } = await this.database.query(
      `select 1 from pg_tables
       where schemaname = coalesce($1, current_schema()) and tablename = $2`,
      [schema ?? null, table],
    );
    assert.equal(rows.length, 0, `The table ${named} is there.`);
  },
);

Then("every migration has been applied", async function (this: SpecWorld) {
  const expected = (await readdir(migrations))
    .filter((name) => name.endsWith(".sql"))
    .sort();
  const { rows } = await this.database.query<{ name: string }>(
    "select name from schema_migrations order by name",
  );
  assert.deepEqual(
    rows.map((row) => row.name),
    expected,
  );
});

When(
  "the account imported for {string} is looked for",
  async function (this: SpecWorld, address: string) {
    keptOf(this).lookedFor =
      await importDatabaseOf(this).findImportedAccount(address);
  },
);

Then(
  "the account kept for {string} on {string} is found",
  function (this: SpecWorld, documentId: string, website: string) {
    const state = keptOf(this);
    const expected = state.accounts.get(keyOf(website, documentId));
    assert.ok(expected !== undefined, `${documentId} was not kept.`);
    assert.equal(state.lookedFor, expected);
  },
);

Then("no account imported is found", function (this: SpecWorld) {
  assert.equal(keptOf(this).lookedFor, undefined);
});
