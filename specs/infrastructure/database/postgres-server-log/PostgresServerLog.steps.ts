// The stream that copies the server's log into the database
// (PostgresServerLog.feature), and the reading and removing of what it kept.
// The file the logger writes to is a list of lines kept in memory, and
// standard error a list of what was said, so that a scenario can see both.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type {
  LogEntry,
  Severity,
} from "../../../../src/application/services/ServerLog.js";
import {
  levelOf,
  PostgresServerLog,
  severityOf,
} from "../../../../src/infrastructure/database/PostgresServerLog.js";
import { ServerLogStream } from "../../../../src/infrastructure/logging/ServerLogStream.js";
import type { SpecWorld } from "../../../support/world.js";
import { unitOfWorkOf } from "../../support/transactions.js";

interface Kept {
  readonly stream: ServerLogStream;
  readonly file: string[];
  readonly said: string[];
  failing: boolean;
  raised: unknown;
  read: readonly LogEntry[];
  removed: number;
}

// A step of any keyword matches by its text, so "the server logs" and "the
// log is flushed" are defined once and read as a Given or a When alike.

// Kept beside the world rather than on it, since nothing else wants it.
const kept = new WeakMap<SpecWorld, Kept>();

const keptOf = (world: SpecWorld): Kept => {
  const found = kept.get(world);
  assert.ok(
    found !== undefined,
    "There is no server log kept in the database.",
  );
  return found;
};

Given("a server log kept in the database", function (this: SpecWorld) {
  const file: string[] = [];
  const said: string[] = [];
  const state: Kept = {
    file,
    said,
    failing: false,
    raised: undefined,
    read: [],
    removed: 0,
    stream: new ServerLogStream({
      file: { write: (line) => file.push(line) },
      database: {
        query: ((text: string, values?: unknown[]) => {
          if (state.failing) {
            return Promise.reject(new Error("The database is away."));
          }
          return this.database.query(text, values);
        }) as typeof this.database.query,
      },
      now: () => {
        assert.ok(this.moment !== undefined, "No moment has been named.");
        return this.moment;
      },
      complain: (text) => said.push(text),
    }),
  };
  kept.set(this, state);
});

Given("the database cannot be written to", function (this: SpecWorld) {
  keptOf(this).failing = true;
});

Given("the database can be written to again", function (this: SpecWorld) {
  keptOf(this).failing = false;
});

// A line as the logger writes it: its level and time, what it said, and
// anything it carried, on one line.
const lineOf = (
  world: SpecWorld,
  message: string,
  severity: string,
  reference?: string,
): string => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  const level = levelOf[severity as keyof typeof levelOf];
  assert.ok(level !== undefined, `There is no severity called ${severity}.`);
  return `${JSON.stringify({
    level,
    time: world.moment.getTime(),
    msg: message,
    ...(reference === undefined ? {} : { correlationId: reference }),
  })}\n`;
};

const writing = (world: SpecWorld, line: string): void => {
  const { stream } = keptOf(world);
  try {
    stream.write(line);
  } catch (failure) {
    keptOf(world).raised = failure;
  }
};

When(
  /^the server logs "([^"]*)" at the severity (\w+)(?: with the reference "([^"]*)")?$/,
  function (
    this: SpecWorld,
    message: string,
    severity: string,
    reference: string | null,
  ) {
    writing(this, lineOf(this, message, severity, reference ?? undefined));
  },
);

When(
  "the server writes {string} to its log",
  function (this: SpecWorld, text: string) {
    writing(this, `${text}\n`);
  },
);

When("the log is flushed", async function (this: SpecWorld) {
  const state = keptOf(this);
  try {
    await state.stream.flush();
  } catch (failure) {
    state.raised = failure;
  }
});

// What was kept ----------------------------------------------------------

const newest = async (world: SpecWorld) => {
  const { rows } = await world.database.query<{
    written_at: Date;
    severity: number;
    message: string;
    details: Record<string, unknown>;
  }>(
    `select written_at, severity, message, details from server_log
      order by kept desc limit 1`,
  );
  const row = rows[0];
  assert.ok(row !== undefined, "Nothing was kept.");
  return row;
};

Then(
  /^(\d+) entr(?:y|ies) (?:is|are) kept$/,
  async function (this: SpecWorld, count: string) {
    const { rows } = await this.database.query<{ count: string }>(
      "select count(*) from server_log",
    );
    assert.equal(Number(rows[0]?.count), Number(count));
  },
);

Then(
  "the newest entry says {string}",
  async function (this: SpecWorld, said: string) {
    assert.equal((await newest(this)).message, said);
  },
);

Then(
  /^the newest entry has the severity (\w+)$/,
  async function (this: SpecWorld, severity: string) {
    assert.equal(severityOf((await newest(this)).severity), severity);
  },
);

Then(
  "the newest entry was written at {string}",
  async function (this: SpecWorld, moment: string) {
    assert.equal(
      (await newest(this)).written_at.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "the newest entry carries the reference {string}",
  async function (this: SpecWorld, reference: string) {
    assert.equal((await newest(this)).details["correlationId"], reference);
  },
);

// The file and the failures -----------------------------------------------

Then(
  "the file has received the line as it was written",
  function (this: SpecWorld) {
    const { file } = keptOf(this);
    assert.equal(file.length, 1);
    assert.ok(file[0]?.endsWith("\n"), "The line lost its ending.");
    assert.ok(file[0]?.includes("Server listening"));
  },
);

Then("no error was raised", function (this: SpecWorld) {
  assert.equal(keptOf(this).raised, undefined);
});

Then(
  "standard error says the log could not be kept",
  function (this: SpecWorld) {
    const { said } = keptOf(this);
    assert.equal(said.length, 1);
    assert.match(said[0] ?? "", /could not be kept/);
  },
);

// Reading and removing ------------------------------------------------------

When("the entries are read", async function (this: SpecWorld) {
  await reading(this, {});
});

When(
  "at most {int} entries are read",
  async function (this: SpecWorld, limit: number) {
    await reading(this, { limit });
  },
);

When(
  /^the entries are read from the severity (\w+)$/,
  async function (this: SpecWorld, severity: string) {
    await reading(this, { severity });
  },
);

When(
  /^the entries are looked up for "([^"]*)"(?: from the severity (\w+))?$/,
  async function (this: SpecWorld, text: string, severity: string | null) {
    await reading(this, {
      mentioning: text,
      ...(severity === null ? {} : { severity }),
    });
  },
);

const reading = async (
  world: SpecWorld,
  filter: { severity?: string; mentioning?: string; limit?: number },
): Promise<void> => {
  const unitOfWork = unitOfWorkOf(world);
  const log = new PostgresServerLog(unitOfWork);
  keptOf(world).read = await unitOfWork.inTransaction(() =>
    log.read({
      severity: filter.severity as Severity | undefined,
      mentioning: filter.mentioning,
      limit: filter.limit ?? 200,
    }),
  );
};

Then(
  /^(\d+) entr(?:y|ies) (?:is|are) read$/,
  function (this: SpecWorld, count: string) {
    assert.equal(keptOf(this).read.length, Number(count));
  },
);

Then("no entry is read", function (this: SpecWorld) {
  assert.equal(keptOf(this).read.length, 0);
});

Then(
  "the first entry read says {string}",
  function (this: SpecWorld, said: string) {
    assert.equal(keptOf(this).read[0]?.message, said);
  },
);

When(
  "the entries older than {string} are removed",
  async function (this: SpecWorld, moment: string) {
    const unitOfWork = unitOfWorkOf(this);
    const log = new PostgresServerLog(unitOfWork);
    keptOf(this).removed = await unitOfWork.inTransaction(() =>
      log.removeBefore(new Date(moment)),
    );
  },
);

Then(
  /^(\d+) entr(?:y|ies) (?:was|were) removed$/,
  function (this: SpecWorld, count: string) {
    assert.equal(keptOf(this).removed, Number(count));
  },
);
