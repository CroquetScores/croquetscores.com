// The server's log, put where it is kept, for the features about writing,
// reading and removing it (PostgresServerLog.feature, LogEntries.feature,
// PruneLog.feature, logs.feature). Entries are written as the stream writes
// them, a row for each, rather than by logging.
//
// Here rather than in specs/support/ because it writes to the database.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { levelOf } from "../../../src/infrastructure/database/PostgresServerLog.js";
import type { Severity } from "../../../src/application/services/ServerLog.js";
import type { SpecWorld } from "../../support/world.js";

const levelNamed = (severity: string | null | undefined): number => {
  if (severity === undefined || severity === null) return levelOf.Info;
  const level = levelOf[severity as Severity];
  assert.ok(level !== undefined, `There is no severity called ${severity}.`);
  return level;
};

export const keep = async (
  world: SpecWorld,
  writtenAt: Date,
  message: string,
  severity: string | null | undefined,
  reference: string | null | undefined,
): Promise<void> => {
  const level = levelNamed(severity);
  await world.database.query(
    `insert into server_log (written_at, severity, message, details)
     values ($1, $2, $3, $4)`,
    [
      writtenAt,
      level,
      message,
      JSON.stringify({
        level,
        msg: message,
        ...(reference === null || reference === undefined
          ? {}
          : { correlationId: reference }),
      }),
    ],
  );
};

Given(
  /^an entry written at "([^"]*)" saying "([^"]*)"(?: at the severity (\w+))?(?: with the reference "([^"]*)")?$/,
  async function (
    this: SpecWorld,
    writtenAt: string,
    message: string,
    severity: string | null,
    reference: string | null,
  ) {
    await keep(this, new Date(writtenAt), message, severity, reference);
  },
);

Given(
  /^(\d+) entries written at "([^"]*)"$/,
  async function (this: SpecWorld, count: string, writtenAt: string) {
    for (let each = 0; each < Number(count); each++) {
      await keep(this, new Date(writtenAt), `Entry ${each}`, null, null);
    }
  },
);

const messagesKept = async (world: SpecWorld): Promise<string[]> => {
  const { rows } = await world.database.query<{ message: string }>(
    "select message from server_log",
  );
  return rows.map((row) => row.message);
};

Then("an entry says {string}", async function (this: SpecWorld, said: string) {
  assert.ok((await messagesKept(this)).includes(said), `No entry says it.`);
});

Then("no entry says {string}", async function (this: SpecWorld, said: string) {
  assert.ok(!(await messagesKept(this)).includes(said), "An entry says it.");
});
