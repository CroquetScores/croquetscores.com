import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { SpecWorld } from "../../support/world.js";
import {
  aSiteKey,
  keepAccounts,
} from "../../infrastructure/support/accounts.js";
import type { KeptError } from "../../../src/import-ravendb/ImportDatabase.js";
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
  "an error is kept for {string} saying {string} of the competition {string} of the tournament at {string} called {string}",
  async function (
    this: SpecWorld,
    documentId: string,
    message: string,
    competitionName: string,
    tournamentAddress: string,
    tournamentName: string,
  ) {
    await importDatabaseOf(this).recordError(documentId, message, {
      tournamentAddress,
      tournamentName,
      competitionName,
      newSitePath: tournamentAddress,
      oldSitePath: tournamentAddress,
    });
  },
);

Given(
  "an error is kept for {string} saying {string}, said for a person as {string}",
  async function (
    this: SpecWorld,
    documentId: string,
    message: string,
    summary: string,
  ) {
    await importDatabaseOf(this).recordError(
      documentId,
      message,
      undefined,
      summary,
    );
  },
);

Given(
  "an error is kept for {string} saying {string} at {string} on the new site and {string} on the old site",
  async function (
    this: SpecWorld,
    documentId: string,
    message: string,
    newSitePath: string,
    oldSitePath: string,
  ) {
    await importDatabaseOf(this).recordError(documentId, message, {
      tournamentAddress: "2014/ac/spring-open",
      tournamentName: "Spring Open",
      newSitePath,
      oldSitePath,
    });
  },
);

const counted = new WeakMap<SpecWorld, number>();

When("the errors kept are counted", async function (this: SpecWorld) {
  counted.set(this, await importDatabaseOf(this).errorCount());
});

Then(
  /^(\d+) errors? (?:is|are) counted$/,
  function (this: SpecWorld, count: string) {
    assert.equal(counted.get(this), Number(count));
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
      EmailAddress.from(address),
    );
    keptOf(this).accounts.set(keyOf(website, documentId), account);
  },
);

// What the import keeps of what each document became, each with an id nothing
// else has, since only whether it is kept is asked.

Given(
  "{string} on {string} was kept as a tournament",
  async function (this: SpecWorld, documentId: string, website: string) {
    await importDatabaseOf(this).recordImportedTournament(
      website,
      documentId,
      `tournament/${randomUUID()}`,
    );
  },
);

Given(
  "{string} on {string} was kept as read",
  async function (this: SpecWorld, documentId: string, website: string) {
    await importDatabaseOf(this).recordTournamentRead(website, documentId);
  },
);

Given(
  "{string} on {string} was kept as a forgotten account",
  async function (this: SpecWorld, documentId: string, website: string) {
    await importDatabaseOf(this).recordForgottenUser(
      website,
      documentId,
      `account/${randomUUID()}`,
    );
  },
);

Given(
  "player {int} of {string} on {string} was kept as a tournament player",
  async function (
    this: SpecWorld,
    number: number,
    tournament: string,
    website: string,
  ) {
    await importDatabaseOf(this).recordImportedPlayer(
      website,
      tournament,
      number,
      `tournament-player/${randomUUID()}`,
    );
  },
);

Given(
  "{string} on {string} was kept as a competition",
  async function (this: SpecWorld, documentId: string, website: string) {
    await importDatabaseOf(this).recordImportedCompetition(
      website,
      documentId,
      `tournament/${randomUUID()}`,
      `competition/${randomUUID()}`,
    );
  },
);

Then(
  "{string} on {string} is not kept as read",
  async function (this: SpecWorld, documentId: string, website: string) {
    assert.equal(
      await importDatabaseOf(this).wasTournamentRead(website, documentId),
      false,
    );
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
    keptOf(this).lookedFor = await importDatabaseOf(this).findImportedAccount(
      EmailAddress.from(address),
    );
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

// Whoever asked to be told of each error kept, and what they were told.
const told = new WeakMap<SpecWorld, KeptError[]>();

const toldOf = (world: SpecWorld): KeptError[] => {
  const found = told.get(world);
  assert.ok(found !== undefined, "Nobody asked to be told.");
  return found;
};

Given("someone asks to be told of each error kept", function (this: SpecWorld) {
  const heard: KeptError[] = [];
  told.set(this, heard);
  importDatabaseOf(this).afterErrorKept((error) => {
    heard.push(error);
    return Promise.resolve();
  });
});

Then(
  /^they were told of (\d+) errors?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(toldOf(this).length, Number(count));
  },
);

Then(
  "they were told of an error for {string}",
  function (this: SpecWorld, documentId: string) {
    assert.equal(toldOf(this)[0]?.documentId, documentId);
  },
);

Then(
  "they were told of an error saying {string}",
  function (this: SpecWorld, message: string) {
    assert.equal(toldOf(this)[0]?.message, message);
  },
);

Then(
  "they were told of an error said for a person as {string}",
  function (this: SpecWorld, summary: string) {
    assert.equal(toldOf(this)[0]?.summary, summary);
  },
);

Then(
  "they were told of an error at {string} on the new site and {string} on the old site",
  function (this: SpecWorld, newSite: string, oldSite: string) {
    const of = toldOf(this)[0]?.of;
    assert.equal(of?.newSitePath, newSite);
    assert.equal(of?.oldSitePath, oldSite);
  },
);

Then(
  "they were told of {string} and then of {string}",
  function (this: SpecWorld, first: string, second: string) {
    assert.deepEqual(
      toldOf(this).map(({ documentId }) => documentId),
      [first, second],
    );
  },
);
