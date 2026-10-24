import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ImportFiles } from "../../../src/import-ravendb/ImportFiles.js";
import type { SpecWorld } from "../../support/world.js";

// The import's files, in a folder of the scenario's own where nothing is yet
// (ImportFiles.feature).

interface Files {
  readonly parent: string;
  readonly folder: string;
  readonly files: ImportFiles;
}

const filesOfWorlds = new WeakMap<SpecWorld, Files>();

const filesOf = (world: SpecWorld): Files => {
  const found = filesOfWorlds.get(world);
  assert.ok(found !== undefined, "There is no folder for the import's files.");
  return found;
};

Given(
  "a folder for the import's files, for the new site at {string}",
  async function (this: SpecWorld, newSite: string) {
    const parent = await mkdtemp(join(tmpdir(), "import-files-"));
    const folder = join(parent, "import-from-ravendb");
    filesOfWorlds.set(this, {
      parent,
      folder,
      files: new ImportFiles(folder, newSite),
    });
  },
);

After(async function (this: SpecWorld) {
  const found = filesOfWorlds.get(this);
  if (found !== undefined) {
    await rm(found.parent, { recursive: true, force: true });
  }
});

// The folder is made by the files being begun, so what a scenario leaves in
// it first is made here.
Given(
  "the import's folder has the file {string} saying {string}",
  async function (this: SpecWorld, name: string, said: string) {
    const { folder } = filesOf(this);
    await rm(folder, { recursive: true, force: true });
    await mkdir(folder, { recursive: true });
    await writeFile(join(folder, name), said);
  },
);

Given("the import's folder is not there", async function (this: SpecWorld) {
  await rm(filesOf(this).folder, { recursive: true, force: true });
});

// Once for Given and When alike: Cucumber matches a step whatever its word.
const begin = async function (this: SpecWorld): Promise<void> {
  await filesOf(this).files.begin(new Date());
};
Given("the files are begun", begin);

Given(
  "the files are begun at {string}",
  async function (this: SpecWorld, at: string) {
    await filesOf(this).files.begin(new Date(at));
  },
);

Given("the files are ended", async function (this: SpecWorld) {
  await filesOf(this).files.end();
});

// ---- What is said ------------------------------------------------------

// A correction of a game of a block, at the tournament's address on both
// sites, as a document is until it is a competition of the site's.
const said = async (
  world: SpecWorld,
  code: string,
  what: string,
  documentId: string,
): Promise<void> => {
  await filesOf(world).files.accept({
    documentId,
    website: "croquetscores.com",
    newSitePath: "2014/ac/spring-open",
    oldSitePath: "2014/ac/spring-open",
    what,
    code,
    description: "Said by the scenario.",
  });
};

When(
  "a correction of the code {string} is said",
  async function (this: SpecWorld, code: string) {
    await said(this, code, "", "croquetscores.com/blocks/1");
  },
);

// Said whether Given or When: the one expression serves both.
Given(
  "game {int} of {string} of {string} on {string} is said as {string}",
  async function (
    this: SpecWorld,
    game: number,
    documentId: string,
    address: string,
    website: string,
    code: string,
  ) {
    await filesOf(this).files.accept({
      documentId,
      website,
      newSitePath: address,
      oldSitePath: address,
      what: `game ${String(game)}`,
      code,
      description: "Said by the scenario.",
    });
  },
);

When(
  "a document that was not brought over is said as {string}",
  async function (this: SpecWorld, code: string) {
    await filesOf(this).files.accept({
      documentId: "croquetscores.com/blocks/9",
      website: "croquetscores.com",
      newSitePath: undefined,
      oldSitePath: "",
      what: "",
      code,
      description: "Said by the scenario.",
    });
  },
);

// A message written \n for a line break, since a step is one line.
const messageOf = (written: string): string => written.replaceAll("\\n", "\n");

Given(
  "the files are told of an error for {string} saying {string}",
  async function (this: SpecWorld, documentId: string, message: string) {
    await filesOf(this).files.keptError({
      documentId,
      message: messageOf(message),
    });
  },
);

Given(
  "the files are told of an error for {string} saying {string}, said for a person as {string}",
  async function (
    this: SpecWorld,
    documentId: string,
    message: string,
    summary: string,
  ) {
    await filesOf(this).files.keptError({
      documentId,
      message: messageOf(message),
      summary,
    });
  },
);

Given(
  "the files are told of an error for {string} saying {string} at {string} on the new site and {string} on the old site",
  async function (
    this: SpecWorld,
    documentId: string,
    message: string,
    newSite: string,
    oldSite: string,
  ) {
    await filesOf(this).files.keptError({
      documentId,
      message: messageOf(message),
      of: {
        tournamentAddress: "2014/ac/spring-open",
        tournamentName: "Spring Open",
        newSitePath: newSite,
        oldSitePath: oldSite,
      },
    });
  },
);

// ---- What was written --------------------------------------------------

const contentOf = (world: SpecWorld, name: string): Promise<string> =>
  readFile(join(filesOf(world).folder, name), "utf8");

const linesOf = async (world: SpecWorld, name: string): Promise<string[]> =>
  (await contentOf(world, name)).split("\n");

const exists = async (path: string): Promise<boolean> => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

Then("the import's folder is there", async function (this: SpecWorld) {
  assert.ok((await stat(filesOf(this).folder)).isDirectory());
});

Then(
  "the import's folder has the file {string}",
  async function (this: SpecWorld, name: string) {
    const { folder } = filesOf(this);
    assert.ok(
      await exists(join(folder, name)),
      `The folder has ${(await readdir(folder)).join(", ")}.`,
    );
  },
);

Then(
  "the import's folder does not have the file {string}",
  async function (this: SpecWorld, name: string) {
    assert.ok(!(await exists(join(filesOf(this).folder, name))));
  },
);

Then(
  "line {int} of the file {string} is {string}",
  async function (this: SpecWorld, line: number, name: string, text: string) {
    assert.equal((await linesOf(this, name))[line - 1], text);
  },
);

Then(
  "line {int} of the file {string} is empty",
  async function (this: SpecWorld, line: number, name: string) {
    assert.equal((await linesOf(this, name))[line - 1], "");
  },
);

// The machine's own way of writing a moment, as the files write it.
Then(
  "line {int} of the file {string} says the import began at {string}",
  async function (this: SpecWorld, line: number, name: string, at: string) {
    assert.equal(
      (await linesOf(this, name))[line - 1],
      `Import began ${new Date(at).toLocaleString()}.`,
    );
  },
);

Then(
  "the file {string} says {string}",
  async function (this: SpecWorld, name: string, text: string) {
    assert.ok((await contentOf(this, name)).includes(text));
  },
);

Then(
  "the file {string} does not say {string}",
  async function (this: SpecWorld, name: string, text: string) {
    assert.ok(!(await contentOf(this, name)).includes(text));
  },
);

Then(
  "the file {string} says {string} before {string}",
  async function (this: SpecWorld, name: string, first: string, then: string) {
    const content = await contentOf(this, name);
    const at = content.indexOf(first);
    const after = content.indexOf(then);
    assert.ok(at !== -1, `It does not say ${first}.`);
    assert.ok(after !== -1, `It does not say ${then}.`);
    assert.ok(at < after, `${first} is not before ${then}.`);
  },
);

// A line of its own, the address written out rather than as a link.
Then(
  /^the file "([^"]*)" says the (new|old) site address "([^"]*)"$/,
  async function (
    this: SpecWorld,
    name: string,
    which: string,
    address: string,
  ) {
    const label = which === "new" ? "New site" : "Old site";
    assert.ok((await linesOf(this, name)).includes(`${label}: ${address}`));
  },
);

// A heading each, but the headings of the totals are not a thing said.
Then(
  /^the file "([^"]*)" says (\d+) things?$/,
  async function (this: SpecWorld, name: string, count: string) {
    const headings = (await linesOf(this, name)).filter((line) =>
      line.startsWith("## "),
    );
    assert.equal(headings.length, Number(count));
  },
);

Then(
  "the file {string} has the line {string}",
  async function (this: SpecWorld, name: string, line: string) {
    assert.ok((await linesOf(this, name)).includes(line));
  },
);

Then(
  "the file {string} ends with the line {string}",
  async function (this: SpecWorld, name: string, line: string) {
    const lines = (await linesOf(this, name)).filter((each) => each !== "");
    assert.equal(lines.at(-1), line);
  },
);
