import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type DatabaseAccessOutcome,
  runDatabaseAccess,
} from "../../../src/infrastructure/maintenance/databaseAccessCli.js";
import type { SpecWorld } from "../../support/world.js";
import { accessInHand, momentIn } from "./databaseAccessInHand.js";

// The script, run as its own function with the arguments as the command line
// would give them (`databaseAccess.feature`). It is given no database to
// reach, which is the point: it has none to use.

const outcomes = new WeakMap<SpecWorld, DatabaseAccessOutcome>();

const outcomeOf = (world: SpecWorld): DatabaseAccessOutcome => {
  const found = outcomes.get(world);
  assert.ok(found !== undefined, "The script has not been run.");
  return found;
};

// The database being nowhere is said by pointing the setting at nothing for
// the scenario: the script reads no such setting, and so is unmoved by it.
// Put back by a hook of this file, and not by the scenario's own list of what
// to close, which a scenario with no database of its own never runs: a setting
// left pointing at nothing would be inherited by every scenario the same worker
// runs next, and take their database away from them.
const settingWas = new WeakMap<SpecWorld, string | undefined>();

Given("the database is not there", function (this: SpecWorld) {
  settingWas.set(this, process.env["DATABASE_URL"]);
  process.env["DATABASE_URL"] = "postgres://nobody@127.0.0.1:1/nothing";
});

After(function (this: SpecWorld) {
  if (!settingWas.has(this)) return;
  const was = settingWas.get(this);
  if (was === undefined) delete process.env["DATABASE_URL"];
  else process.env["DATABASE_URL"] = was;
  settingWas.delete(this);
});

// Said as a Given and as a When alike.
When(
  "the script is run with {string}",
  async function (this: SpecWorld, said: string) {
    const words = said.split(/\s+/).filter((word) => word !== "");
    const held = accessInHand(this);
    outcomes.set(
      this,
      await runDatabaseAccess(words, held.writer, () => momentIn(this)),
    );
    // What the site would find, so that "database access is off" is about the
    // file the script left and not about what the reader remembered.
    held.state = await held.reader.current();
  },
);

Then("the script exits with success", function (this: SpecWorld) {
  assert.equal(outcomeOf(this).exitCode, 0, outcomeOf(this).said);
});

Then("the script exits with failure", function (this: SpecWorld) {
  assert.equal(outcomeOf(this).exitCode, 1, outcomeOf(this).said);
});

const says = (world: SpecWorld, words: string): void => {
  assert.ok(
    outcomeOf(world).said.toLowerCase().includes(words.toLowerCase()),
    `The script said "${outcomeOf(world).said}".`,
  );
};

Then(
  /^the script says database access is off for (\d+) minutes$/,
  function (this: SpecWorld, minutes: string) {
    says(this, `database access is off for ${minutes} minutes`);
  },
);

Then("the script says database access is on", function (this: SpecWorld) {
  says(this, "database access is on");
});

Then("the script says database access is not off", function (this: SpecWorld) {
  says(this, "database access is not off");
});

Then(
  /^the script says (\d+) minutes are now expected$/,
  function (this: SpecWorld, minutes: string) {
    says(this, `${minutes} minutes are now expected`);
  },
);

Then("the script says the minutes are needed", function (this: SpecWorld) {
  says(this, "minutes are needed");
});

Then(
  "the script says the minutes from now are needed",
  function (this: SpecWorld) {
    says(this, "minutes from now are needed");
  },
);

Then(
  "the script says the minutes must be a whole number",
  function (this: SpecWorld) {
    says(this, "must be a whole number");
  },
);

Then(
  "the script says the minutes must be from 1 to 1440",
  function (this: SpecWorld) {
    says(this, "from 1 to 1440");
  },
);

Then("the script says how it is used", function (this: SpecWorld) {
  says(this, "usage");
});
