import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type Ended,
  PgDumpRefused,
  type Program,
  runPgDump,
} from "../../../src/infrastructure/maintenance/pgDump.js";
import type { SpecWorld } from "../../support/world.js";

// pg_dump asked for a dump (`pgDump.feature`), over a program runner that is
// the scenario's own: no pg_dump is run, so what is asked of it and what is
// made of its answer are read.

interface Dump {
  address: string;
  tables: readonly string[];
  program: string | undefined;
  ends: Ended | "no pg_dump";
  asked: Program | undefined;
  refused: PgDumpRefused | undefined;
}

const dumps = new WeakMap<SpecWorld, Dump>();

const dumpOf = (world: SpecWorld): Dump => {
  let found = dumps.get(world);
  if (found === undefined) {
    found = {
      address:
        "postgres://backup:secret-word@website.example:5433/croquetscores",
      tables: [],
      program: undefined,
      ends: { code: 0, said: "" },
      asked: undefined,
      refused: undefined,
    };
    dumps.set(world, found);
  }
  return found;
};

const askedOf = (world: SpecWorld): Program => {
  const { asked } = dumpOf(world);
  assert.ok(asked !== undefined, "pg_dump was never asked for a dump.");
  return asked;
};

const argumentAfter = (world: SpecWorld, flag: string): string | undefined => {
  const { args } = askedOf(world);
  const at = args.indexOf(flag);
  return at === -1 ? undefined : args[at + 1];
};

const ask = async (world: SpecWorld, file: string): Promise<void> => {
  const dump = dumpOf(world);
  try {
    await runPgDump(
      {
        address: dump.address,
        file,
        tables: dump.tables,
        program: dump.program,
      },
      (program) => {
        dump.asked = program;
        if (dump.ends === "no pg_dump") {
          return Promise.reject(new Error("spawn pg_dump ENOENT"));
        }
        return Promise.resolve(dump.ends);
      },
    );
  } catch (failure) {
    if (failure instanceof PgDumpRefused) {
      dump.refused = failure;
      // Where the shared step that says what a refusal was looks for it.
      world.failure = failure;
      return;
    }
    throw failure;
  }
};

Given("the address {string}", function (this: SpecWorld, address: string) {
  dumpOf(this).address = address;
});

Given(
  "the tables {string} and {string}",
  function (this: SpecWorld, one: string, other: string) {
    dumpOf(this).tables = [one, other];
  },
);

Given(
  "the program to run is {string}",
  function (this: SpecWorld, program: string) {
    dumpOf(this).program = program;
  },
);

Given("pg_dump ends in success", function (this: SpecWorld) {
  dumpOf(this).ends = { code: 0, said: "" };
});

Given(
  "pg_dump ends in failure saying {string}",
  function (this: SpecWorld, said: string) {
    dumpOf(this).ends = { code: 1, said };
  },
);

Given("there is no pg_dump on the computer", function (this: SpecWorld) {
  dumpOf(this).ends = "no pg_dump";
});

When(
  "pg_dump is asked for a dump into {string}",
  async function (this: SpecWorld, file: string) {
    await ask(this, file);
  },
);

When("pg_dump is asked for a dump", async function (this: SpecWorld) {
  await ask(this, "C:\\backups\\one.dump.partial");
});

Then("pg_dump is asked for the custom format", function (this: SpecWorld) {
  assert.ok(askedOf(this).args.includes("--format=custom"));
});

Then(
  "pg_dump is asked to write {string}",
  function (this: SpecWorld, file: string) {
    assert.equal(argumentAfter(this, "--file"), file);
  },
);

Then(
  "pg_dump is asked never to prompt for a password",
  function (this: SpecWorld) {
    assert.ok(askedOf(this).args.includes("--no-password"));
  },
);

Then(
  "pg_dump is asked for the table {string}",
  function (this: SpecWorld, table: string) {
    assert.ok(askedOf(this).args.includes(`--table=${table}`));
  },
);

Then(
  "pg_dump is asked for {int} tables",
  function (this: SpecWorld, n: number) {
    assert.equal(
      askedOf(this).args.filter((each) => each.startsWith("--table=")).length,
      n,
    );
  },
);

Then(
  "the program run is {string}",
  function (this: SpecWorld, program: string) {
    assert.equal(askedOf(this).command, program);
  },
);

Then(
  "pg_dump is asked for the host {string}",
  function (this: SpecWorld, host: string) {
    assert.equal(argumentAfter(this, "--host"), host);
  },
);

Then(
  "pg_dump is asked for the port {string}",
  function (this: SpecWorld, port: string) {
    assert.equal(argumentAfter(this, "--port"), port);
  },
);

Then(
  "pg_dump is asked for the user {string}",
  function (this: SpecWorld, user: string) {
    assert.equal(argumentAfter(this, "--username"), user);
  },
);

Then(
  "pg_dump is asked for the database {string}",
  function (this: SpecWorld, database: string) {
    assert.equal(argumentAfter(this, "--dbname"), database);
  },
);

Then(
  "pg_dump's environment has the password {string}",
  function (this: SpecWorld, password: string) {
    assert.equal(askedOf(this).env["PGPASSWORD"], password);
  },
);

Then("pg_dump's environment has no password", function (this: SpecWorld) {
  assert.equal(askedOf(this).env["PGPASSWORD"], undefined);
});

Then(
  "none of pg_dump's arguments has the password {string}",
  function (this: SpecWorld, password: string) {
    for (const each of askedOf(this).args) {
      assert.ok(!each.includes(password), `The argument ${each} has it.`);
    }
  },
);

Then(
  "none of pg_dump's arguments has {string}",
  function (this: SpecWorld, text: string) {
    for (const each of askedOf(this).args) {
      assert.ok(!each.includes(text), `The argument ${each} has it.`);
    }
  },
);

Then(
  "pg_dump's environment has the ssl mode {string}",
  function (this: SpecWorld, mode: string) {
    assert.equal(askedOf(this).env["PGSSLMODE"], mode);
  },
);

Then("pg_dump's environment has no ssl mode", function (this: SpecWorld) {
  assert.equal(askedOf(this).env["PGSSLMODE"], undefined);
});

Then("the refusal says {string}", function (this: SpecWorld, words: string) {
  assert.ok(dumpOf(this).refused?.message.includes(words) === true);
});

Then(
  "the refusal does not say {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(dumpOf(this).refused?.message.includes(words) === false);
  },
);

Then("nothing is refused", function (this: SpecWorld) {
  assert.equal(dumpOf(this).refused, undefined);
});
