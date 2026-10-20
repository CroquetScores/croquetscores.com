// Reading the server's log (LogEntries.feature), through the mediator "the
// application's server log" stands up. What was answered, or what asking was
// refused with, is kept as everything the mediator answers is.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { LogEntries } from "../../../../../src/application/operations/logs/LogEntries.js";
import type { LogEntry } from "../../../../../src/application/services/ServerLog.js";
import type { SpecWorld } from "../../../../support/world.js";
import { accountAt, keepingWhatCameOf } from "../../accounts/roleRequests.js";

// A severity is written bare, as the log names it, or in quotes where the
// scenario means one the log does not write in.
When(
  /^the reader signed in to the account for "([^"]*)" reads the log(?: from the severity (?:"([^"]*)"|(\w+)))?(?: mentioning "([^"]*)")?$/,
  async function (
    this: SpecWorld,
    reader: string,
    unknown: string | null,
    severity: string | null,
    mentioning: string | null,
  ) {
    const asking = await accountAt(this, reader);
    const { mediator } = this;
    assert.ok(mediator !== undefined, "The server log is not stood up.");
    await keepingWhatCameOf(this, () =>
      mediator.query(
        new LogEntries(
          asking.id.value,
          unknown ?? severity ?? undefined,
          mentioning ?? undefined,
        ),
      ),
    );
  },
);

const entriesAnswered = (world: SpecWorld): readonly LogEntry[] => {
  assert.equal(world.failure, undefined, "Reading was refused.");
  return world.answer as readonly LogEntry[];
};

Then(
  /^(\d+) entr(?:y|ies) (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(entriesAnswered(this).length, Number(count));
  },
);

Then(
  "the first entry answered says {string}",
  function (this: SpecWorld, said: string) {
    assert.equal(entriesAnswered(this)[0]?.message, said);
  },
);

Then(
  "the first entry answered was written at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(
      entriesAnswered(this)[0]?.writtenAt,
      new Date(moment).toISOString(),
    );
  },
);

Then(
  /^the first entry answered has the severity (\w+)$/,
  function (this: SpecWorld, severity: string) {
    assert.equal(entriesAnswered(this)[0]?.severity, severity);
  },
);

Then(
  "reading the log is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal((this.failure as { code?: string } | undefined)?.code, code);
  },
);
