import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { runRebuildBackupReadModels } from "../../../src/infrastructure/maintenance/rebuildBackupReadModelsCli.js";
import type { SpecWorld } from "../../support/world.js";

// The script that makes the backup database's read models again, run as its
// own function (`rebuildBackupReadModelsCli.feature`) with a rebuild that takes
// as long as the scenario says, evenly over its streams, on a clock the
// scenario moves.

interface Scenario {
  named: boolean;
  takes: number;
  streams: number;
  events: number;
  failure: string | undefined;
  rebuilt: boolean;
  said: string[];
  exitCode: 0 | 1 | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let found = scenarios.get(world);
  if (found === undefined) {
    found = {
      named: true,
      takes: 10 * 60 * 1000,
      streams: 100,
      events: 500,
      failure: undefined,
      rebuilt: false,
      said: [],
      exitCode: undefined,
    };
    scenarios.set(world, found);
  }
  return found;
};

Given(
  "the backup rebuild is told the backup database",
  function (this: SpecWorld) {
    scenarioOf(this).named = true;
  },
);

Given(
  "the backup rebuild is told no backup database",
  function (this: SpecWorld) {
    scenarioOf(this).named = false;
  },
);

Given(
  "the backup rebuild has {int} streams",
  function (this: SpecWorld, streams: number) {
    scenarioOf(this).streams = streams;
  },
);

Given(
  "the backup rebuild reads {int} events",
  function (this: SpecWorld, events: number) {
    scenarioOf(this).events = events;
  },
);

Given(
  "the backup rebuild takes {int} minutes",
  function (this: SpecWorld, minutes: number) {
    scenarioOf(this).takes = minutes * 60 * 1000;
  },
);

Given(
  "the backup rebuild takes {int} seconds",
  function (this: SpecWorld, seconds: number) {
    scenarioOf(this).takes = seconds * 1000;
  },
);

Given(
  "the backup rebuild fails saying {string}",
  function (this: SpecWorld, said: string) {
    scenarioOf(this).failure = said;
  },
);

When(
  "the backup rebuild script is run with {string}",
  async function (this: SpecWorld, argumentsText: string) {
    const scenario = scenarioOf(this);
    let clock = Date.parse("2026-10-13T10:00:00Z");
    const args = argumentsText.split(" ").filter((each) => each !== "");
    const outcome = await runRebuildBackupReadModels(
      args,
      scenario.named ? "postgres://backup@localhost/backup" : undefined,
      {
        rebuild: async (progress) => {
          scenario.rebuilt = true;
          if (scenario.failure !== undefined) {
            throw new Error(scenario.failure);
          }
          progress.streams(scenario.streams);
          // Evenly over the streams, so that the clock is where the scenario
          // says it is by the end.
          const each = scenario.takes / scenario.streams;
          for (let done = 1; done <= scenario.streams; done += 1) {
            clock += each;
            await progress.streamDone(done);
          }
          return scenario.events;
        },
      },
      {
        now: () => new Date(clock),
        say: (line) => scenario.said.push(line),
      },
    );
    scenario.exitCode = outcome.exitCode;
  },
);

const said = (world: SpecWorld): string => scenarioOf(world).said.join("\n");

Then(
  "the backup rebuild script exits with success",
  function (this: SpecWorld) {
    assert.equal(scenarioOf(this).exitCode, 0, said(this));
  },
);

Then(
  "the backup rebuild script exits with failure",
  function (this: SpecWorld) {
    assert.equal(scenarioOf(this).exitCode, 1, said(this));
  },
);

Then("no backup read model was rebuilt", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).rebuilt, false);
});

Then(
  "the backup rebuild script says the backup database is needed",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("BACKUP_DATABASE_URL"), said(this));
  },
);

Then(
  "the backup rebuild script says it is making the read models of the backup database again",
  function (this: SpecWorld) {
    assert.ok(
      said(this).includes(
        "Making the read models of the backup database again.",
      ),
      said(this),
    );
  },
);

Then(
  "the backup rebuild script says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(said(this).includes(words), said(this));
  },
);

Then(
  "the backup rebuild script says {string} at least once",
  function (this: SpecWorld, words: string) {
    assert.ok(said(this).includes(words), said(this));
  },
);

Then(
  "the backup rebuild script says no update of how far it has got",
  function (this: SpecWorld) {
    assert.ok(!said(this).includes("approximately"), said(this));
  },
);
