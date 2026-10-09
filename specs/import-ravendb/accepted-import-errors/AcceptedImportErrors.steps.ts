import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { AcceptedImportErrorsFile } from "../../../src/import-ravendb/AcceptedImportErrors.js";
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

// A line each thing accepted is said on, as a Markdown list's item.
const linesAccepted = async (world: SpecWorld): Promise<string[]> =>
  (await contentOf(world)).split("\n").filter((line) => line.startsWith("- "));

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

After(async function (this: SpecWorld) {
  const saying = sayings.get(this);
  if (saying !== undefined) {
    await rm(saying.folder, { recursive: true, force: true });
  }
});

Given(
  "the file of accepted import errors says {string}",
  async function (this: SpecWorld, said: string) {
    await writeFile(sayingOf(this).path, said);
  },
);

const begin = async function (this: SpecWorld): Promise<void> {
  await sayingOf(this).file.begin();
};
Given("the file of accepted import errors is begun", begin);
When("the file of accepted import errors is begun", begin);

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
    await sayingOf(this).file.accept({
      documentId,
      address,
      website,
      what: `game ${String(game)}`,
      code,
      why: "Accepted by the scenario.",
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

Then(
  "the file of accepted import errors links to {string}",
  async function (this: SpecWorld, link: string) {
    assert.ok((await contentOf(this)).includes(`](${link})`));
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
