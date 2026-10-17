import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import {
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  type BackupOutcome,
  runBackup,
} from "../../../src/infrastructure/maintenance/backupCli.js";
import type { SpecWorld } from "../../support/world.js";

// The backup script, run as its own function (`backupCli.feature`) over a
// folder of the scenario's own. pg_dump is the scenario's, so that what was
// asked of it is read and it can be made to write a file or to fail; the mail
// sender is the scenario's for the same reason, and the clock is the moment
// the shared step gives the world (`ReadOnlyDate.steps.ts`).

const WEBSITES_ADDRESS =
  "postgres://backup:secret-word@website.example:5432/croquetscores";

interface Backup {
  folder: string | undefined;
  folderIsNamed: boolean;
  administrator: string;
  websiteNamed: boolean;
  program: string | undefined;
  dumpWrites: string;
  dumpFails: boolean;
  dumpFailsPartWay: boolean;
  failureWords: string;
  takesSeconds: number;
  emailFails: boolean;
  dumps: {
    database: string;
    file: string;
    tables: readonly string[];
    program: string | undefined;
  }[];
  readonly said: string[];
  readonly emails: { to: string; subject: string; body: string }[];
  exitCode: 0 | 1 | undefined;
}

const backups = new WeakMap<SpecWorld, Backup>();

const backupOf = (world: SpecWorld): Backup => {
  let found = backups.get(world);
  if (found === undefined) {
    found = {
      folder: undefined,
      folderIsNamed: true,
      administrator: "",
      websiteNamed: true,
      program: undefined,
      dumpWrites: "a dump",
      dumpFails: false,
      dumpFailsPartWay: false,
      failureWords: "pg_dump ended with 1",
      takesSeconds: 0,
      emailFails: false,
      dumps: [],
      said: [],
      emails: [],
      exitCode: undefined,
    };
    backups.set(world, found);
  }
  return found;
};

const folderOf = (world: SpecWorld): string => {
  const { folder } = backupOf(world);
  assert.ok(folder !== undefined, "No folder was made for the backups.");
  return folder;
};

const momentOf = (world: SpecWorld): Date => {
  assert.ok(world.moment !== undefined, "No moment was given.");
  return world.moment;
};

// The folder made for the scenario is its own and goes with it.
After(async function (this: SpecWorld) {
  const { folder } = backupOf(this);
  if (folder !== undefined) await rm(folder, { recursive: true, force: true });
});

const filesIn = async (world: SpecWorld): Promise<string[]> =>
  (await readdir(folderOf(world))).sort();

// The folder, the database and the people ----------------------------------

Given("a folder for the backups", async function (this: SpecWorld) {
  backupOf(this).folder = await mkdtemp(join(tmpdir(), "backups-"));
});

Given("the website's database is named", function (this: SpecWorld) {
  backupOf(this).websiteNamed = true;
});

Given("the website's database is not named", function (this: SpecWorld) {
  backupOf(this).websiteNamed = false;
});

Given("no folder is named", function (this: SpecWorld) {
  backupOf(this).folderIsNamed = false;
});

Given("the folder is not there", async function (this: SpecWorld) {
  await rm(folderOf(this), { recursive: true, force: true });
});

Given(
  "the administrator is {string}",
  function (this: SpecWorld, address: string) {
    backupOf(this).administrator = address;
  },
);

Given(
  "the settings name the program {string}",
  function (this: SpecWorld, program: string) {
    backupOf(this).program = program;
  },
);

// What pg_dump does --------------------------------------------------------

Given("pg_dump makes {string}", function (this: SpecWorld, content: string) {
  backupOf(this).dumpWrites = content;
});

Given("pg_dump fails", function (this: SpecWorld) {
  backupOf(this).dumpFails = true;
});

Given("pg_dump fails part way", function (this: SpecWorld) {
  const backup = backupOf(this);
  backup.dumpFails = true;
  backup.dumpFailsPartWay = true;
});

Given(
  "pg_dump fails saying {string}",
  function (this: SpecWorld, words: string) {
    const backup = backupOf(this);
    backup.dumpFails = true;
    backup.failureWords = words;
  },
);

Given(
  "the dump takes {int} seconds",
  function (this: SpecWorld, seconds: number) {
    backupOf(this).takesSeconds = seconds;
  },
);

Given("email cannot be sent", function (this: SpecWorld) {
  backupOf(this).emailFails = true;
});

Given(
  "the folder has the file {string} holding {string}",
  async function (this: SpecWorld, name: string, content: string) {
    await writeFile(join(folderOf(this), name), content);
  },
);

// Running it ---------------------------------------------------------------

const run = async (
  world: SpecWorld,
  args: readonly string[],
): Promise<BackupOutcome> => {
  const backup = backupOf(world);
  // Where the website's address is wanted in a failure's own words, as
  // pg_dump says where it could not reach.
  const words = backup.failureWords.replace(
    "the website's address",
    WEBSITES_ADDRESS,
  );
  const outcome = await runBackup(args, {
    settings: {
      administrator: backup.administrator,
      websiteDatabase: backup.websiteNamed ? WEBSITES_ADDRESS : undefined,
      folder: backup.folderIsNamed ? backup.folder : undefined,
      program: backup.program,
    },
    dump: async (request) => {
      backup.dumps.push(request);
      if (backup.dumpFails) {
        if (backup.dumpFailsPartWay) {
          await writeFile(request.file, "half of a du");
        }
        throw new Error(words);
      }
      await writeFile(request.file, backup.dumpWrites);
      world.moment = new Date(
        momentOf(world).getTime() + backup.takesSeconds * 1000,
      );
    },
    send: (email) => {
      if (backup.emailFails) {
        return Promise.reject(new Error("The mail sender is down."));
      }
      backup.emails.push(email);
      return Promise.resolve();
    },
    now: () => momentOf(world),
    say: (line) => {
      backup.said.push(line);
    },
  });
  backup.exitCode = outcome.exitCode;
  return outcome;
};

When("the backup is run", async function (this: SpecWorld) {
  await run(this, []);
});

When(
  "the backup is run with {string}",
  async function (this: SpecWorld, argument: string) {
    await run(this, [argument]);
  },
);

// What was made ------------------------------------------------------------

Then("the folder has {int} file", async function (this: SpecWorld, n: number) {
  assert.equal((await filesIn(this)).length, n);
});

Then("the folder has {int} files", async function (this: SpecWorld, n: number) {
  assert.equal((await filesIn(this)).length, n);
});

Then(
  "the folder has the file {string}",
  async function (this: SpecWorld, name: string) {
    const files = await filesIn(this);
    assert.ok(files.includes(name), `The folder has ${files.join(", ")}.`);
  },
);

Then(
  "the file {string} holds {string}",
  async function (this: SpecWorld, name: string, content: string) {
    assert.equal(await readFile(join(folderOf(this), name), "utf8"), content);
  },
);

Then("the folder is still not there", async function (this: SpecWorld) {
  await assert.rejects(stat(folderOf(this)));
});

Then("the dump was of the website's database", function (this: SpecWorld) {
  const { dumps } = backupOf(this);
  assert.equal(dumps.length, 1);
  assert.equal(dumps[0]?.database, WEBSITES_ADDRESS);
});

Then(
  "the dump was of the table {string}",
  function (this: SpecWorld, table: string) {
    const { dumps } = backupOf(this);
    assert.equal(dumps.length, 1);
    assert.ok(dumps[0]?.tables.includes(table) === true);
  },
);

Then("the dump was of {int} tables", function (this: SpecWorld, n: number) {
  const { dumps } = backupOf(this);
  assert.equal(dumps.length, 1);
  assert.equal(dumps[0]?.tables.length, n);
});

Then(
  "the dump was written to a name that is not the file's",
  function (this: SpecWorld) {
    const { dumps } = backupOf(this);
    assert.equal(dumps.length, 1);
    assert.ok(
      dumps[0]?.file.endsWith(".dump.partial") === true,
      `It was written to ${dumps[0]?.file ?? "nothing"}.`,
    );
  },
);

Then(
  "the dump was made by {string}",
  function (this: SpecWorld, program: string) {
    const { dumps } = backupOf(this);
    assert.equal(dumps.length, 1);
    // The script is told the program by its settings, which name none where
    // pg_dump of the computer's own is to be used.
    assert.equal(dumps[0]?.program ?? "pg_dump", program);
  },
);

Then("pg_dump was not run", function (this: SpecWorld) {
  assert.equal(backupOf(this).dumps.length, 0);
});

// How it went --------------------------------------------------------------

Then("the backup exits with failure", function (this: SpecWorld) {
  assert.equal(backupOf(this).exitCode, 1);
});

Then("the backup exits with success", function (this: SpecWorld) {
  assert.equal(backupOf(this).exitCode, 0);
});

const lastEmail = (
  world: SpecWorld,
): { to: string; subject: string; body: string } => {
  const email = backupOf(world).emails.at(-1);
  assert.ok(email !== undefined, "No email was sent.");
  return email;
};

const emailText = (world: SpecWorld): string => {
  const email = lastEmail(world);
  return `${email.subject}\n${email.body}`;
};

const saidOnTheScreen = (world: SpecWorld): string =>
  backupOf(world).said.join("\n");

Then("an email was sent to {string}", function (this: SpecWorld, to: string) {
  assert.equal(lastEmail(this).to, to);
});

Then("the email says the backup worked", function (this: SpecWorld) {
  assert.match(emailText(this), /The backup worked\./);
});

Then("the email says the backup failed", function (this: SpecWorld) {
  assert.match(emailText(this), /The backup failed\./);
});

Then(
  "the email says the file is called {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(emailText(this).includes(`The file is called ${name}.`));
  },
);

Then(
  "the email says the file is {int} bytes",
  function (this: SpecWorld, bytes: number) {
    assert.ok(emailText(this).includes(`The file is ${String(bytes)} bytes.`));
  },
);

Then(
  "the email says it took {float} minutes",
  function (this: SpecWorld, minutes: number) {
    assert.ok(
      emailText(this).includes(`It took ${minutes.toFixed(1)} minutes.`),
    );
  },
);

Then(
  "the email says it took less than 0.1 minutes",
  function (this: SpecWorld) {
    assert.ok(emailText(this).includes("It took less than 0.1 minutes."));
  },
);

Then(
  "the email says the failure was making the dump",
  function (this: SpecWorld) {
    assert.ok(emailText(this).includes("The failure was making the dump"));
  },
);

Then(
  "the email says the failure was that the website's database is not named",
  function (this: SpecWorld) {
    assert.ok(
      emailText(this).includes(
        "The failure was that the website's database is not named.",
      ),
    );
  },
);

Then(
  "the email says the failure was that the folder is not named",
  function (this: SpecWorld) {
    assert.ok(
      emailText(this).includes("The failure was that the folder is not named."),
    );
  },
);

Then(
  "the email says the failure was that the folder is not there",
  function (this: SpecWorld) {
    assert.ok(
      emailText(this).includes("The failure was that the folder is not there."),
    );
  },
);

Then(
  "the email says a file of that name was already there",
  function (this: SpecWorld) {
    assert.ok(
      emailText(this).includes("a file of that name was already there"),
    );
  },
);

Then("the email says why: {string}", function (this: SpecWorld, why: string) {
  assert.ok(emailText(this).includes(`Why: ${why}`));
});

Then(
  "the email does not say the website's address",
  function (this: SpecWorld) {
    const text = emailText(this);
    assert.ok(!text.includes("website.example"));
    assert.ok(!text.includes(WEBSITES_ADDRESS));
  },
);

Then(
  "the email does not say the website's password",
  function (this: SpecWorld) {
    assert.ok(!emailText(this).includes("secret-word"));
  },
);

// What it says on the screen -----------------------------------------------

Then("the backup says it failed", function (this: SpecWorld) {
  assert.match(saidOnTheScreen(this), /The backup failed\./);
});

Then(
  "the backup says the file is called {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(saidOnTheScreen(this).includes(`The file is called ${name}.`));
  },
);

Then(
  "the backup says the file is {int} bytes",
  function (this: SpecWorld, bytes: number) {
    assert.ok(
      saidOnTheScreen(this).includes(`The file is ${String(bytes)} bytes.`),
    );
  },
);

Then(
  "the backup says the administrator could not be told",
  function (this: SpecWorld) {
    assert.match(saidOnTheScreen(this), /The administrator could not be told/);
  },
);
