import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import {
  accessInHand,
  aFileThatIsNotThere,
  holding,
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
