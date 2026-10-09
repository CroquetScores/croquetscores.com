// What the import's features share: where a scenario's errors are kept, the
// import's database over the scenario's own, and the steps more than one of
// them is written in. Imported by their step definitions rather than found by
// Cucumber, so that each step is defined once, whichever feature is run.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { EmailAddress } from "../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ImportDatabase } from "../../src/import-ravendb/ImportDatabase.js";
import type { ImportErrors } from "../../src/import-ravendb/ImportDatabase.js";
import { accountsOf } from "../infrastructure/support/accounts.js";
import { unitOfWorkOf } from "../infrastructure/support/transactions.js";
import type { SpecWorld } from "../support/world.js";

/** Where a scenario's refusals are kept, and read back from. */
export interface ErrorsKept extends ImportErrors {
  errorsFor(documentId: string): Promise<readonly string[]>;
}

const errors = new WeakMap<SpecWorld, ErrorsKept>();

/** Has the scenario's refusals kept in `kept`. */
export const keepErrorsIn = (world: SpecWorld, kept: ErrorsKept): void => {
  errors.set(world, kept);
};

const errorsOf = (world: SpecWorld): ErrorsKept => {
  const found = errors.get(world);
  assert.ok(found !== undefined, "The scenario keeps no errors.");
  return found;
};

const databases = new WeakMap<SpecWorld, ImportDatabase>();

/** The import's database, over the scenario's own, made once a scenario. */
export const importDatabaseOf = (world: SpecWorld): ImportDatabase => {
  const existing = databases.get(world);
  if (existing !== undefined) return existing;
  const database = new ImportDatabase(world.database, unitOfWorkOf(world));
  databases.set(world, database);
  keepErrorsIn(world, database);
  return database;
};

// Refusals ---------------------------------------------------------------------

Then(
  "an error is kept for {string}",
  async function (this: SpecWorld, documentId: string) {
    const kept = await errorsOf(this).errorsFor(documentId);
    assert.ok(kept.length > 0, `No error is kept for ${documentId}.`);
  },
);

Then(
  "no error is kept for {string}",
  async function (this: SpecWorld, documentId: string) {
    const kept = await errorsOf(this).errorsFor(documentId);
    assert.deepEqual(kept, [], `An error is kept for ${documentId}.`);
  },
);

Then(
  "the error kept for {string} says {string}",
  async function (this: SpecWorld, documentId: string, says: string) {
    const kept = await errorsOf(this).errorsFor(documentId);
    assert.ok(
      kept.some((message) => message.includes(says)),
      `No error kept for ${documentId} says ${says}: ${kept.join("; ")}`,
    );
  },
);

// Accounts, and the users they were ------------------------------------------

Then(
  "an account is reached at {string}",
  async function (this: SpecWorld, address: string) {
    const { readModel } = accountsOf(this);
    const found = await this.asARequest(() =>
      readModel.find(EmailAddress.from(address)),
    );
    assert.ok(found !== undefined, `No account is reached at ${address}.`);
  },
);

Then(
  "no account is reached at {string}",
  async function (this: SpecWorld, address: string) {
    const { readModel } = accountsOf(this);
    const found = await this.asARequest(() =>
      readModel.find(EmailAddress.from(address)),
    );
    assert.equal(found, undefined, `An account is reached at ${address}.`);
  },
);

Then(
  "{string} on {string} is not kept as any account",
  async function (this: SpecWorld, documentId: string, website: string) {
    const database = importDatabaseOf(this);
    const kept = await database.findAccountOf(website, documentId);
    assert.equal(kept, undefined, `${documentId} is kept as an account.`);
    const forgotten = await database.findForgottenAccountOf(
      website,
      documentId,
    );
    assert.equal(
      forgotten,
      undefined,
      `${documentId} is kept as a forgotten account.`,
    );
  },
);

// The tournament and competition an error is kept as of ---------------------

interface KeptOf {
  readonly tournament_address: string | null;
  readonly tournament_name: string | null;
  readonly competition_name: string | null;
}

// Every error kept against `documentId`, with what it is of.
const keptOf = async (
  world: SpecWorld,
  documentId: string,
): Promise<readonly KeptOf[]> => {
  const { rows } = await world.database.query<KeptOf>(
    `select tournament_address, tournament_name, competition_name
       from import_errors where document_id = $1 order by kept`,
    [documentId],
  );
  assert.ok(rows.length > 0, `No error is kept for ${documentId}.`);
  return rows;
};

Then(
  "the error kept for {string} is of the tournament at {string} called {string}",
  async function (
    this: SpecWorld,
    documentId: string,
    address: string,
    name: string,
  ) {
    for (const kept of await keptOf(this, documentId)) {
      assert.equal(kept.tournament_address, address);
      assert.equal(kept.tournament_name, name);
    }
  },
);

Then(
  "the error kept for {string} is of the competition {string}",
  async function (this: SpecWorld, documentId: string, name: string) {
    for (const kept of await keptOf(this, documentId)) {
      assert.equal(kept.competition_name, name);
    }
  },
);

Then(
  "the error kept for {string} is of no tournament",
  async function (this: SpecWorld, documentId: string) {
    for (const kept of await keptOf(this, documentId)) {
      assert.equal(kept.tournament_address, null);
    }
  },
);
