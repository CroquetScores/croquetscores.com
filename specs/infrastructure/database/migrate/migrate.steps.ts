import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { migrate } from "../../../../src/infrastructure/database/migrate.js";
import type { SpecWorld } from "../../../support/world.js";

Given("a migrated database", function (this: SpecWorld) {
  // The @postgres hook made it and migrated it. This step says out loud what
  // the scenario is standing on.
  assert.ok(this.database);
});

When("the migrations are applied", async function (this: SpecWorld) {
  this.appliedMigrations = await migrate(this.database);
});

Then(
  "the table {string} exists",
  async function (this: SpecWorld, table: string) {
    const { rows } = await this.database.query<{ exists: boolean }>(
      "select to_regclass($1) is not null as exists",
      [table],
    );
    assert.equal(
      rows[0]?.exists,
      true,
      `Expected the table ${table} to exist.`,
    );
  },
);

Then(
  "{string} is recorded as applied",
  async function (this: SpecWorld, name: string) {
    const { rows } = await this.database.query<{ name: string }>(
      "select name from schema_migrations where name = $1",
      [name],
    );
    assert.equal(rows.length, 1, `Expected ${name} to be recorded as applied.`);
  },
);

Then("no migration is applied", function (this: SpecWorld) {
  assert.deepEqual(this.appliedMigrations, []);
});
