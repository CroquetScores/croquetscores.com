import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  AcceptedImportErrorsFile,
  CORRECTED,
} from "../../../src/import-ravendb/AcceptedImportErrors.js";
import type { SpecWorld } from "../../support/world.js";

interface Saying {
  readonly folder: string;
  readonly path: string;
  readonly file: AcceptedImportErrorsFile;
}

const sayings = new WeakMap<SpecWorld, Saying>();

const sayingOf = (world: SpecWorld): Saying => {
  const saying = sayings.get(world);
  assert.ok(
    saying !== undefined,
    "There is no file of accepted import errors.",
  );
  return saying;
};

const contentOf = async (world: SpecWorld): Promise<string> =>
  readFile(sayingOf(world).path, "utf8");

// The heading each thing accepted is said under.
const linesAccepted = async (world: SpecWorld): Promise<string[]> =>
  (await contentOf(world)).split("\n").filter((line) => line.startsWith("## "));

// In a folder of the scenario's own, where nothing is yet.
Given(
  "a file of accepted import errors of the scenario's own, for the new site at {string}",
  async function (this: SpecWorld, newSite: string) {
    const folder = await mkdtemp(join(tmpdir(), "accepted-import-errors-"));
    const path = join(folder, "accepted-import-errors.md");
    sayings.set(this, {
      folder,
      path,
      file: new AcceptedImportErrorsFile(path, newSite),
    });
  },
);

// The same file, in the same folder, for what the import corrected.
Given(
  "the file is of import corrections, for the new site at {string}",
  function (this: SpecWorld, newSite: string) {
    const { folder, path } = sayingOf(this);
    sayings.set(this, {
      folder,
      path,
      file: new AcceptedImportErrorsFile(path, newSite, CORRECTED),
    });
  },
);

After(async function (this: SpecWorld) {
  const saying = sayings.get(this);
  if (saying !== undefined) {
    await rm(saying.folder, { recursive: true, force: true });
  }
});

Given(
  "the file of accepted import errors was left saying {string}",
  async function (this: SpecWorld, said: string) {
    await writeFile(sayingOf(this).path, said);
  },
);

// Now, after an import that kept no errors, unless the scenario says when
// and what it kept.
const begin = async function (this: SpecWorld): Promise<void> {
  await sayingOf(this).file.begin(new Date(), 0);
};
// Once, for Given and When alike: Cucumber matches a step whatever its word.
Given("the file of accepted import errors is begun", begin);

When(
  "the file of accepted import errors is begun at {string}",
  async function (this: SpecWorld, at: string) {
    await sayingOf(this).file.begin(new Date(at), 0);
  },
);

When(
  "the file of accepted import errors is begun after an import that kept {int} errors",
  async function (this: SpecWorld, errors: number) {
    await sayingOf(this).file.begin(new Date(), errors);
  },
);

When(
  "the file of accepted import errors is begun after an import whose errors were not counted",
  async function (this: SpecWorld) {
    await sayingOf(this).file.begin(new Date(), undefined);
  },
);

When(
  "the file of accepted import errors is ended with {int} errors kept",
  async function (this: SpecWorld, errors: number) {
    await sayingOf(this).file.end(errors);
  },
);

When(
  "game {int} of {string} of {string} on {string} is accepted as {string}",
  async function (
    this: SpecWorld,
    game: number,
    documentId: string,
    address: string,
    website: string,
    code: string,
  ) {
    // At the tournament's address on both sites, as a document is until it
    // is a competition of the site's.
    await sayingOf(this).file.accept({
      documentId,
      website,
      newSitePath: address,
      oldSitePath: address,
      what: `game ${String(game)}`,
      code,
      description: "Accepted by the scenario.",
    });
  },
);

Then(
  "the file of accepted import errors says {string}",
  async function (this: SpecWorld, said: string) {
    assert.ok((await contentOf(this)).includes(said));
  },
);

Then(
  "the file of accepted import errors does not say {string}",
  async function (this: SpecWorld, said: string) {
    assert.ok(!(await contentOf(this)).includes(said));
  },
);

// A line of its own, the address written out rather than as a link.
Then(
  /^the file of accepted import errors says the (new|old) site address "([^"]*)"$/,
  async function (this: SpecWorld, which: string, address: string) {
    const label = which === "new" ? "New site" : "Old site";
    assert.ok(
      (await contentOf(this)).split("\n").includes(`${label}: ${address}`),
    );
  },
);

Then(
  "the file of accepted import errors says nothing accepted",
  async function (this: SpecWorld) {
    assert.deepEqual(await linesAccepted(this), []);
  },
);

Then(
  "the file of accepted import errors says {int} things accepted",
  async function (this: SpecWorld, count: number) {
    assert.equal((await linesAccepted(this)).length, count);
  },
);

// The machine's own way of writing a moment, as the file writes it.
Then(
  "the file of accepted import errors says it was begun at {string}",
  async function (this: SpecWorld, at: string) {
    assert.ok((await contentOf(this)).includes(new Date(at).toLocaleString()));
  },
);

// From the line the file says an import's counts on, as "Previous import:
// 7,806 import errors, 2 accepted import errors.", the number's separators
// taken out.
Then(
  /^the file of accepted import errors says (the previous|this) import kept (\d+|uncounted) (import errors|accepted import errors|import corrections)$/,
  async function (this: SpecWorld, which: string, count: string, what: string) {
    const heading = which === "this" ? "This import" : "Previous import";
    const found = new RegExp(
      `^${heading}: (\\S+) import errors, (\\S+) (?:accepted import errors|import corrections)\\.$`,
      "m",
    ).exec(await contentOf(this));
    assert.ok(found !== null, `The file says nothing of ${which} import.`);
    const said = what === "import errors" ? found[1] : found[2];
    assert.equal(said?.replaceAll(",", ""), count);
  },
);
