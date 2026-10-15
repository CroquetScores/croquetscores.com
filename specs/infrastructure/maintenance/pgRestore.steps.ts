import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type {
  Ended,
  Program,
} from "../../../src/infrastructure/maintenance/pgDump.js";
import {
  PgRestoreRefused,
  pgRestoreProgramFor,
  runPgRestore,
} from "../../../src/infrastructure/maintenance/pgRestore.js";
import type { SpecWorld } from "../../support/world.js";

// pg_restore asked to put a file's data into a database (`pgRestore.feature`),
// over a program runner that is the scenario's own: no pg_restore is run, so
// what is asked of it and what is made of its answer are read.

interface Restore {
  address: string;
  pgDump: string | undefined;
  ends: Ended | "no pg_restore";
  asked: Program | undefined;
  refused: PgRestoreRefused | undefined;
}

const restores = new WeakMap<SpecWorld, Restore>();

const restoreOf = (world: SpecWorld): Restore => {
  let found = restores.get(world);
  if (found === undefined) {
    found = {
      address: "postgres://postgres:secret-word@localhost:5432/restored",
      pgDump: undefined,
      ends: { code: 0, said: "" },
      asked: undefined,
      refused: undefined,
    };
    restores.set(world, found);
  }
  return found;
};

const askedOf = (world: SpecWorld): Program => {
  const { asked } = restoreOf(world);
  assert.ok(asked !== undefined, "pg_restore was never asked to restore.");
  return asked;
};

const argumentAfter = (world: SpecWorld, flag: string): string | undefined => {
  const { args } = askedOf(world);
  const at = args.indexOf(flag);
  return at === -1 ? undefined : args[at + 1];
};

Given(
  "the restored database is at {string}",
  function (this: SpecWorld, address: string) {
    restoreOf(this).address = address;
  },
);

Given("pg_dump is named {string}", function (this: SpecWorld, name: string) {
  restoreOf(this).pgDump = name;
});

Given("pg_restore ends in success", function (this: SpecWorld) {
  restoreOf(this).ends = { code: 0, said: "" };
});

Given(
  "pg_restore ends in failure saying {string}",
  function (this: SpecWorld, said: string) {
    restoreOf(this).ends = { code: 1, said };
  },
);

Given("there is no pg_restore on the computer", function (this: SpecWorld) {
  restoreOf(this).ends = "no pg_restore";
});

When(
  "pg_restore is asked to restore {string}",
  async function (this: SpecWorld, file: string) {
    const restore = restoreOf(this);
    try {
      await runPgRestore(
        {
          address: restore.address,
          file,
          program: pgRestoreProgramFor(restore.pgDump),
        },
        (program) => {
          restore.asked = program;
          if (restore.ends === "no pg_restore") {
            return Promise.reject(new Error("spawn pg_restore ENOENT"));
          }
          return Promise.resolve(restore.ends);
        },
      );
    } catch (failure) {
      if (failure instanceof PgRestoreRefused) {
        restore.refused = failure;
        // Where the shared step that says what a refusal was looks for it.
        this.failure = failure;
        return;
      }
      throw failure;
    }
  },
);

Then("pg_restore is asked for the data only", function (this: SpecWorld) {
  assert.ok(askedOf(this).args.includes("--data-only"));
});

Then("pg_restore is asked for no owners", function (this: SpecWorld) {
  assert.ok(askedOf(this).args.includes("--no-owner"));
});

Then(
  "pg_restore is asked to stop at the first error",
  function (this: SpecWorld) {
    assert.ok(askedOf(this).args.includes("--exit-on-error"));
  },
);

Then(
  "pg_restore is asked never to prompt for a password",
  function (this: SpecWorld) {
    assert.ok(askedOf(this).args.includes("--no-password"));
  },
);

Then(
  "the last argument to pg_restore is {string}",
  function (this: SpecWorld, file: string) {
    assert.equal(askedOf(this).args.at(-1), file);
  },
);

Then(
  "pg_restore is asked for the database {string}",
  function (this: SpecWorld, database: string) {
    assert.equal(argumentAfter(this, "--dbname"), database);
  },
);

Then(
  "pg_restore is asked for the host {string}",
  function (this: SpecWorld, host: string) {
    assert.equal(argumentAfter(this, "--host"), host);
  },
);

Then(
  "pg_restore is asked for the port {string}",
  function (this: SpecWorld, port: string) {
    assert.equal(argumentAfter(this, "--port"), port);
  },
);

Then(
  "pg_restore is asked for the user {string}",
  function (this: SpecWorld, user: string) {
    assert.equal(argumentAfter(this, "--username"), user);
  },
);

Then(
  "pg_restore's environment has the password {string}",
  function (this: SpecWorld, password: string) {
    assert.equal(askedOf(this).env["PGPASSWORD"], password);
  },
);

Then(
  "none of pg_restore's arguments has the text {string}",
  function (this: SpecWorld, text: string) {
    for (const each of askedOf(this).args) {
      assert.ok(!each.includes(text), `The argument ${each} has it.`);
    }
  },
);

Then(
  "pg_restore was run as {string}",
  function (this: SpecWorld, program: string) {
    assert.equal(askedOf(this).command, program);
  },
);

Then(
  "the refusal of pg_restore says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(restoreOf(this).refused?.message.includes(words) === true);
  },
);

Then("pg_restore was not refused", function (this: SpecWorld) {
  assert.equal(restoreOf(this).refused, undefined);
});
