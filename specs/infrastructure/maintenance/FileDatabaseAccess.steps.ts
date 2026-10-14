import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import {
  accessInHand,
  aFileThatIsNotThere,
  holding,
  momentIn,
} from "./databaseAccessInHand.js";

// The switch the site reads and the script writes (`FileDatabaseAccess.feature`
// and `databaseAccess.feature`). What a step is refused with is left on the
// world, as every request's is.

Given("a database access file that does not exist", function (this: SpecWorld) {
  aFileThatIsNotThere(this);
});

Given(
  "a database access file holding {string}",
  function (this: SpecWorld, text: string) {
    aFileThatIsNotThere(this);
    holding(this, text);
  },
);

Given("a database access file holding no minutes", function (this: SpecWorld) {
  aFileThatIsNotThere(this);
  holding(this, JSON.stringify({ turnedOffAt: "2026-10-13T10:00:00.000Z" }));
});

// Turning it off, moving the return and turning it on are said in
// maintenance.steps.ts, which does them to the application's own switch where
// the scenario built the application and to this file's where it did not: the
// same words, since they are the same thing done.

Given(
  "the database access file is made to hold {string}",
  function (this: SpecWorld, text: string) {
    holding(this, text);
  },
);

Given(
  "a reading of the file is held after it has read it",
  async function (this: SpecWorld) {
    accessInHand(this).hold();
    // Long enough for it to have read the file, and no longer.
    await new Promise((resolve) => setTimeout(resolve, 50));
  },
);

When(
  "database access is turned on through the switch that is reading",
  async function (this: SpecWorld) {
    await accessInHand(this).reader.turnOn();
  },
);

When(
  "database access is turned off through the switch that is reading",
  async function (this: SpecWorld) {
    await accessInHand(this).reader.turnOff(30, momentIn(this));
  },
);

When("the held reading is let go", async function (this: SpecWorld) {
  await accessInHand(this).release();
});

When(
  /^database access is turned off for (-?[\d.]+) minutes unless it is off already$/,
  async function (this: SpecWorld, minutes: string) {
    this.failure = undefined;
    try {
      await accessInHand(this).writer.turnOffIfOn(
        Number(minutes),
        momentIn(this),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

// Both asked of the file at once, as two people begin at the same moment, and
// what each was refused with kept.
const bothRefusals = new WeakMap<SpecWorld, unknown[]>();

When(
  /^database access is turned off for (\d+) and for (\d+) minutes at once unless it is off already$/,
  async function (this: SpecWorld, first: string, second: string) {
    const { writer } = accessInHand(this);
    const results = await Promise.allSettled([
      writer.turnOffIfOn(Number(first), momentIn(this)),
      writer.turnOffIfOn(Number(second), momentIn(this)),
    ]);
    bothRefusals.set(
      this,
      results.map((each): unknown =>
        each.status === "rejected" ? (each.reason as unknown) : undefined,
      ),
    );
  },
);

Then(
  "one of the two is refused with {string}",
  function (this: SpecWorld, code: string) {
    const refusals = (bothRefusals.get(this) ?? []).filter(
      (each) => each !== undefined,
    );
    assert.equal(refusals.length, 1, "Not exactly one was refused.");
    assert.equal((refusals[0] as { code?: string }).code, code);
  },
);

When("database access is read", async function (this: SpecWorld) {
  const held = accessInHand(this);
  held.state = await held.reader.current();
});

// What was read -----------------------------------------------------------------

const read = (world: SpecWorld) => {
  const { state } = accessInHand(world);
  assert.ok(state !== undefined, "Database access has not been read.");
  return state;
};

Then("database access is on", function (this: SpecWorld) {
  assert.equal(read(this).off, false);
});

Then("database access is off", function (this: SpecWorld) {
  assert.equal(read(this).off, true);
});

Then(
  "access is expected back at {string}",
  function (this: SpecWorld, moment: string) {
    const state = read(this);
    assert.ok(state.off, "Database access is on.");
    assert.equal(
      state.expectedBackAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "access was turned off at {string}",
  function (this: SpecWorld, moment: string) {
    const state = read(this);
    assert.ok(state.off, "Database access is on.");
    assert.equal(
      state.turnedOffAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then("a fault is logged", function (this: SpecWorld) {
  assert.ok(accessInHand(this).faults.length > 0, "No fault was logged.");
});

Then("the file was read once", function (this: SpecWorld) {
  assert.equal(accessInHand(this).reads(), 1);
});

Then(
  /^(\d+) faults? (?:is|are) logged$/,
  function (this: SpecWorld, count: string) {
    assert.equal(accessInHand(this).faults.length, Number(count));
  },
);
