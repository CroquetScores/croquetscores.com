import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type ClaudeAnswer,
  type ClaudeRequest,
  MOST_ENTRIES,
  runSummariseLog,
  type SummaryOutcome,
} from "../../../src/infrastructure/maintenance/summariseLogCli.js";
import { PostgresServerLog } from "../../../src/infrastructure/database/PostgresServerLog.js";
import type { SpecWorld } from "../../support/world.js";
import { unitOfWorkOf } from "../support/transactions.js";
import { emailText, lastEmail, scriptOf, sendTo } from "./maintenanceScript.js";

// The summary script, run as its own function (`summariseLogCli.feature`)
// over the scenario's own database, with a Claude and a mail sender that the
// scenario can read and take down. What Claude was asked is what the script
// would have sent to the Messages API, so that the words it was given are read
// from the request and not from what the script says it sent.

interface Summary {
  /** What Claude writes, or none where it cannot be reached. */
  writes: string | undefined;
  logUnreadable: boolean;
  readonly asked: ClaudeRequest[];
  readonly said: string[];
  outcome: SummaryOutcome | undefined;
}

const summaries = new WeakMap<SpecWorld, Summary>();

const summaryOf = (world: SpecWorld): Summary => {
  let found = summaries.get(world);
  if (found === undefined) {
    found = {
      writes: undefined,
      logUnreadable: false,
      asked: [],
      said: [],
      outcome: undefined,
    };
    summaries.set(world, found);
  }
  return found;
};

Given(
  "a Claude that writes the summary {string}",
  function (this: SpecWorld, text: string) {
    summaryOf(this).writes = text;
  },
);

Given("a Claude that cannot be reached", function (this: SpecWorld) {
  summaryOf(this).writes = undefined;
});

Given("the log cannot be read", function (this: SpecWorld) {
  summaryOf(this).logUnreadable = true;
});

When("the summary is run", async function (this: SpecWorld) {
  const state = summaryOf(this);
  assert.ok(this.moment !== undefined, "No moment has been named.");
  const unitOfWork = unitOfWorkOf(this);
  const log = new PostgresServerLog(unitOfWork);
  state.outcome = await runSummariseLog({
    administrator: scriptOf(this).administrator,
    now: this.moment,
    read: (filter) => {
      if (state.logUnreadable) {
        return Promise.reject(new Error("The database is away."));
      }
      return unitOfWork.inTransaction(() => log.read(filter));
    },
    ask: (request): Promise<ClaudeAnswer> => {
      state.asked.push(request);
      if (state.writes === undefined) {
        return Promise.reject(new Error("Claude cannot be reached."));
      }
      return Promise.resolve({
        content: [{ type: "text", text: state.writes }],
      });
    },
    send: sendTo(this),
    say: (line) => {
      state.said.push(line);
    },
  });
});

// What Claude was given ---------------------------------------------------

const givenText = (world: SpecWorld): string => {
  const request = summaryOf(world).asked[0];
  assert.ok(request !== undefined, "Claude was not asked.");
  return request.messages.map((each) => each.content).join("\n");
};

const entriesGiven = (world: SpecWorld): string[] =>
  givenText(world)
    .split("\n")
    .filter((line) => line.startsWith("{"));

Then(
  "Claude was given the entry {string}",
  function (this: SpecWorld, message: string) {
    assert.ok(givenText(this).includes(message), "Claude was not given it.");
  },
);

Then(
  "Claude was not given the entry {string}",
  function (this: SpecWorld, message: string) {
    const { asked } = summaryOf(this);
    if (asked.length === 0) return;
    assert.ok(!givenText(this).includes(message), "Claude was given it.");
  },
);

Then(
  "Claude was given the text {string}",
  function (this: SpecWorld, text: string) {
    assert.ok(givenText(this).includes(text), "Claude was not given it.");
  },
);

Then(
  "Claude was not given the text {string}",
  function (this: SpecWorld, text: string) {
    assert.ok(!givenText(this).includes(text), "Claude was given it.");
  },
);

Then(
  "Claude was given {int} entries",
  function (this: SpecWorld, count: number) {
    assert.equal(entriesGiven(this).length, count);
  },
);

Then(
  "Claude was told there were more entries than it was given",
  function (this: SpecWorld) {
    assert.ok(
      givenText(this).includes(`more than ${String(MOST_ENTRIES)} entries`),
      "Claude was not told.",
    );
  },
);

Then(
  "Claude was not told there were more entries than it was given",
  function (this: SpecWorld) {
    assert.ok(
      !givenText(this).includes(`more than ${String(MOST_ENTRIES)} entries`),
      "Claude was told.",
    );
  },
);

Then("Claude was given no way to act", function (this: SpecWorld) {
  const request = summaryOf(this).asked[0];
  assert.ok(request !== undefined, "Claude was not asked.");
  assert.ok(!("tools" in request), "Claude was given tools.");
});

Then("Claude was not asked", function (this: SpecWorld) {
  assert.equal(summaryOf(this).asked.length, 0);
});

// The email ------------------------------------------------------------------

Then("the email says {string}", function (this: SpecWorld, words: string) {
  assert.ok(
    emailText(this).includes(words),
    `The email says ${emailText(this)}`,
  );
});

Then(
  "the email says that nothing was written at Warn or more severe",
  function (this: SpecWorld) {
    assert.ok(
      emailText(this).includes("Nothing was written at Warn or more severe"),
    );
  },
);

Then(
  "the email says that the summary could not be written",
  function (this: SpecWorld) {
    assert.ok(emailText(this).includes("The summary could not be written"));
  },
);

Then(
  "the email says that the log could not be read",
  function (this: SpecWorld) {
    assert.ok(emailText(this).includes("The log could not be read"));
  },
);

Then(
  /^the email says there (?:was|were) (\d+) entr(?:y|ies) at (\w+)$/,
  function (this: SpecWorld, count: string, severity: string) {
    assert.ok(
      emailText(this).includes(`${severity}: ${count}`),
      `The email says ${emailText(this)}`,
    );
  },
);

Then(
  /^the email's subject says (\d+) entr(?:y|ies)$/,
  function (this: SpecWorld, count: string) {
    assert.match(lastEmail(this).subject, new RegExp(`\\b${count} entr`));
  },
);

Then(
  "the email's subject says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(lastEmail(this).subject.includes(words));
  },
);

// How it went --------------------------------------------------------------

Then("the summary script exits with success", function (this: SpecWorld) {
  assert.equal(
    summaryOf(this).outcome?.exitCode,
    0,
    summaryOf(this).said.join("\n"),
  );
});

Then("the summary script exits with failure", function (this: SpecWorld) {
  assert.equal(
    summaryOf(this).outcome?.exitCode,
    1,
    summaryOf(this).said.join("\n"),
  );
});

Then(
  "the summary script says the administrator could not be told",
  function (this: SpecWorld) {
    assert.ok(
      summaryOf(this).said.includes("The administrator could not be told."),
    );
  },
);
