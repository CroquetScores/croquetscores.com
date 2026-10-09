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

// Now, after an import that kept no errors, unless the scenario says when
// and what it kept.
const begin = async function (this: SpecWorld): Promise<void> {
  await sayingOf(this).file.begin(new Date(), 0);
};
Given("the file of accepted import errors is begun", begin);
When("the file of accepted import errors is begun", begin);

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
  /^the file of accepted import errors says (the previous|this) import kept (\d+|uncounted) (import errors|accepted import errors)$/,
  async function (this: SpecWorld, which: string, count: string, what: string) {
    const heading = which === "this" ? "This import" : "Previous import";
    const found = new RegExp(
      `^${heading}: (\\S+) import errors, (\\S+) accepted import errors\\.$`,
      "m",
    ).exec(await contentOf(this));
    assert.ok(found !== null, `The file says nothing of ${which} import.`);
    const said = what === "import errors" ? found[1] : found[2];
    assert.equal(said?.replaceAll(",", ""), count);
  },
);
