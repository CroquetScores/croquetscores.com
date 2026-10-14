import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { DatabaseAccess } from "../../../src/application/common/DatabaseAccess.js";
import type { RebuildProgress } from "../../../src/application/common/RebuildProgress.js";
import { runRebuildReadModels } from "../../../src/infrastructure/maintenance/rebuildReadModelsCli.js";
import type { SpecWorld } from "../../support/world.js";
import { accessInHand, momentIn } from "./databaseAccessInHand.js";

// The script that makes the read models again, run as its own function
// (`rebuildReadModelsCli.feature`) with a rebuild that takes as long as the
// scenario says, evenly over its streams, on a clock the scenario moves. What
// happened is kept in order, so that the order is what is asserted.

type Happened =
  | { readonly kind: "said"; readonly line: string; readonly at: number }
  | { readonly kind: "waited"; readonly milliseconds: number }
  | { readonly kind: "began" }
  | { readonly kind: "ended" };

interface Rebuild {
  takes: number;
  streams: number;
  events: number;
  fails: boolean;
  calls: number;
  accessWasOff: boolean | undefined;
  expectedBackAt: string | undefined;
  /** Each different moment the site was expected back at, as it was found. */
  returns: string[];
  /** How many streams were done when the return was first moved. */
  firstMovedAtDone: number | undefined;
  /** Whether writing the expected return, or turning access on, fails. */
  writingTheReturnFails: boolean;
  turningOnFails: boolean;
  /** Whether somebody is to turn access on at the first update. */
  somebodyTurnsItOn: boolean;
  readonly happened: Happened[];
  exitCode: 0 | 1 | undefined;
}

const rebuilds = new WeakMap<SpecWorld, Rebuild>();

const rebuildOf = (world: SpecWorld): Rebuild => {
  let found = rebuilds.get(world);
  if (found === undefined) {
    found = {
      takes: 10 * 60 * 1000,
      streams: 100,
      events: 500,
      fails: false,
      calls: 0,
      accessWasOff: undefined,
      expectedBackAt: undefined,
      returns: [],
      firstMovedAtDone: undefined,
      somebodyTurnsItOn: false,
      writingTheReturnFails: false,
      turningOnFails: false,
      happened: [],
      exitCode: undefined,
    };
    rebuilds.set(world, found);
  }
  return found;
};

const said = (world: SpecWorld): string[] =>
  rebuildOf(world)
    .happened.filter((each) => each.kind === "said")
    .map((each) => each.line);

Given(
  /^the rebuild takes (\d+) (minutes|seconds)(?: over (\d+) streams?)?$/,
  function (
    this: SpecWorld,
    amount: string,
    unit: string,
    streams: string | null,
  ) {
    const rebuild = rebuildOf(this);
    rebuild.takes = Number(amount) * (unit === "minutes" ? 60_000 : 1000);
    if (streams !== null) rebuild.streams = Number(streams);
  },
);

Given(
  "somebody turns database access on during the rebuild",
  function (this: SpecWorld) {
    rebuildOf(this).somebodyTurnsItOn = true;
  },
);

Given("writing the expected return fails", function (this: SpecWorld) {
  rebuildOf(this).writingTheReturnFails = true;
});

Given("turning access on fails", function (this: SpecWorld) {
  rebuildOf(this).turningOnFails = true;
});

Given("the rebuild fails", function (this: SpecWorld) {
  rebuildOf(this).fails = true;
});

Given("there are {int} events", function (this: SpecWorld, events: number) {
  rebuildOf(this).events = events;
});

When(
  "the rebuild script is run with {string}",
  async function (this: SpecWorld, args: string) {
    const rebuild = rebuildOf(this);
    const held = accessInHand(this);
    const move = (milliseconds: number): void => {
      this.moment = new Date(momentIn(this).getTime() + milliseconds);
    };

    // The switch as the script is given it, failing where the scenario says.
    const access: DatabaseAccess = {
      current: () => held.writer.current(),
      turnOff: (minutes, at) => held.writer.turnOff(minutes, at),
      turnOffIfOn: (minutes, at) => held.writer.turnOffIfOn(minutes, at),
      moveReturn: (minutes, at) =>
        rebuild.writingTheReturnFails
          ? Promise.reject(new Error("The disk is full."))
          : held.writer.moveReturn(minutes, at),
      turnOn: () =>
        rebuild.turningOnFails
          ? Promise.reject(new Error("The file could not be removed."))
          : held.writer.turnOn(),
    };

    const outcome = await runRebuildReadModels(
      args.split(/\s+/).filter((word) => word !== ""),
      access,
      {
        rebuild: async (progress: RebuildProgress) => {
          rebuild.calls += 1;
          progress.streams(rebuild.streams);
          // The read models are touched from here, and what the site would
          // find of its switch is read as they are.
          rebuild.happened.push({ kind: "began" });
          const state = await held.writer.current();
          rebuild.accessWasOff = state.off;
          rebuild.expectedBackAt = state.off
            ? state.expectedBackAt.toISOString()
            : undefined;
          if (rebuild.fails) throw new Error("The database went away.");
          const each = rebuild.takes / rebuild.streams;
          const startedAt = momentIn(this).getTime();
          for (let done = 1; done <= rebuild.streams; done += 1) {
            this.moment = new Date(startedAt + each * done);
            const saidBefore = rebuild.happened.length;
            await progress.streamDone(done);
            // What a reader would be told now, kept where it changes, and
            // looked at only when something was said, since nothing else can
            // have moved it.
            if (done === 1 || rebuild.happened.length !== saidBefore) {
              const now = await held.writer.current();
              const back = now.off
                ? now.expectedBackAt.toISOString()
                : undefined;
              if (back !== undefined && rebuild.returns.at(-1) !== back) {
                rebuild.returns.push(back);
                // The first is what it was turned off with, not a move.
                if (rebuild.returns.length === 2) {
                  rebuild.firstMovedAtDone = done;
                }
              }
            }
            if (rebuild.somebodyTurnsItOn && done === 150) {
              await held.writer.turnOn();
            }
          }
          rebuild.happened.push({ kind: "ended" });
          return rebuild.events;
        },
      },
      {
        now: () => momentIn(this),
        wait: (milliseconds) => {
          rebuild.happened.push({ kind: "waited", milliseconds });
          move(milliseconds);
          return Promise.resolve();
        },
        say: (line) => {
          rebuild.happened.push({
            kind: "said",
            line,
            at: momentIn(this).getTime(),
          });
        },
      },
    );
    rebuild.exitCode = outcome.exitCode;
    // What the site would find, so that "database access is on" is about the
    // file the script left.
    held.state = await held.reader.current();
  },
);

Then("the rebuild script exits with success", function (this: SpecWorld) {
  assert.equal(rebuildOf(this).exitCode, 0, said(this).join("\n"));
});

Then("the rebuild script exits with failure", function (this: SpecWorld) {
  assert.equal(rebuildOf(this).exitCode, 1, said(this).join("\n"));
});

const sayings = (world: SpecWorld, words: string): boolean =>
  said(world).some((line) => line.toLowerCase().includes(words.toLowerCase()));

Then("the rebuild script says {}", function (this: SpecWorld, words: string) {
  // "database access is off for 20 minutes", "the rebuild took 10.0
  // minutes", "there are 2,500 streams in the event store", and the rest
  // are sentences the script says in so many words.
  const wanted = words
    .replace(/^the rebuild failed$/, "the rebuild failed")
    .replace(/^the minutes are needed$/, "minutes are needed");
  assert.ok(
    sayings(this, wanted),
    `The script said:\n${said(this).join("\n")}`,
  );
});

Then(
  "the rebuild script does not say {}",
  function (this: SpecWorld, words: string) {
    // "how long it took" is a thing the script says as "took".
    const wanted = words === "how long it took" ? "took" : words;
    assert.ok(
      !sayings(this, wanted),
      `The script said:\n${said(this).join("\n")}`,
    );
  },
);

Then(
  /^the rebuild script said (\d+) updates?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(
      said(this).filter((line) => /streams? completed/.test(line)).length,
      Number(count),
    );
  },
);

Then(
  "the rebuild script said its updates 10 seconds apart",
  function (this: SpecWorld) {
    const times = rebuildOf(this)
      .happened.filter(
        (each) => each.kind === "said" && /streams? completed/.test(each.line),
      )
      .map((each) => (each.kind === "said" ? each.at : 0));
    assert.ok(times.length > 1, "There were not two updates.");
    for (let at = 1; at < times.length; at += 1) {
      assert.equal(times[at]! - times[at - 1]!, 10_000);
    }
  },
);

Then("no read model was rebuilt", function (this: SpecWorld) {
  assert.equal(rebuildOf(this).calls, 0);
});

Then("the read models were made again", function (this: SpecWorld) {
  assert.equal(rebuildOf(this).calls, 1);
});

Then(
  "access was off while the read models were made again",
  function (this: SpecWorld) {
    assert.equal(rebuildOf(this).accessWasOff, true);
  },
);

Then(
  "access had been turned off expected back at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(
      rebuildOf(this).expectedBackAt,
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "the script waited a second before the read models were made again",
  function (this: SpecWorld) {
    const { happened } = rebuildOf(this);
    const waited = happened.findIndex(
      (each) => each.kind === "waited" && each.milliseconds === 1000,
    );
    const began = happened.findIndex((each) => each.kind === "began");
    assert.ok(waited >= 0 && waited < began, "It did not wait first.");
  },
);

Then(
  "the streams were said before the read models were made again",
  function (this: SpecWorld) {
    const { happened } = rebuildOf(this);
    const streams = happened.findIndex(
      (each) =>
        each.kind === "said" && /streams? in the event store/.test(each.line),
    );
    const began = happened.findIndex((each) => each.kind === "began");
    assert.ok(streams >= 0 && streams < began);
  },
);

Then(
  "the updates were said while the read models were being made again",
  function (this: SpecWorld) {
    const { happened } = rebuildOf(this);
    const began = happened.findIndex((each) => each.kind === "began");
    const ended = happened.findIndex((each) => each.kind === "ended");
    const updates = happened
      .map((each, index) => ({ each, index }))
      .filter(
        ({ each }) =>
          each.kind === "said" && /streams? completed/.test(each.line),
      );
    assert.ok(updates.length > 0, "There were no updates.");
    for (const { index } of updates) {
      assert.ok(index > began && index < ended);
    }
  },
);

Then(
  "the rebuild script said, in order, that access was off, how many streams there are, the updates, that the read models were made again, how long it took, and that access was on",
  function (this: SpecWorld) {
    const lines = said(this);
    const at = (pattern: RegExp, from = 0): number =>
      lines.findIndex((line, index) => index >= from && pattern.test(line));
    const off = at(/access is off/i);
    const streams = at(/streams? in the event store/);
    const update = at(/streams? completed/, streams);
    const made = at(/made again from/, update);
    const took = at(/took/, made);
    const on = at(/access is on/i, took);
    for (const place of [off, streams, update, made, took, on]) {
      assert.ok(place >= 0, `Out of order:\n${lines.join("\n")}`);
    }
  },
);

Then(
  "the expected return was moved to {string}",
  function (this: SpecWorld, moment: string) {
    assert.ok(
      rebuildOf(this).returns.includes(new Date(moment).toISOString()),
      `It was expected back at ${rebuildOf(this).returns.join(", ")}.`,
    );
  },
);

Then(
  /^the expected return was moved (\d+) times?$/,
  function (this: SpecWorld, count: string) {
    // The first moment is the one it was turned off with, and is not a move.
    assert.equal(
      Math.max(0, rebuildOf(this).returns.length - 1),
      Number(count),
    );
  },
);

Then(
  "the expected return was first moved when {int} streams were done",
  function (this: SpecWorld, done: number) {
    assert.equal(rebuildOf(this).firstMovedAtDone, done);
  },
);

Then(
  /^the rebuild script said the expected return could not be moved (\d+) times?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(
      said(this).filter((line) => /could not be moved/.test(line)).length,
      Number(count),
    );
  },
);
