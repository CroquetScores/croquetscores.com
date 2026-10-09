import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { MissingTournamentsFile } from "../../../src/import-ravendb/MissingTournaments.js";
import type { SpecWorld } from "../../support/world.js";

interface Saying {
  readonly folder: string;
  readonly path: string;
  readonly file: MissingTournamentsFile;
}

const sayings = new WeakMap<SpecWorld, Saying>();

const sayingOf = (world: SpecWorld): Saying => {
  const saying = sayings.get(world);
  assert.ok(saying !== undefined, "There is no file of missing tournaments.");
  return saying;
};

const contentOf = async (world: SpecWorld): Promise<string> =>
  readFile(sayingOf(world).path, "utf8");

// In a folder of the scenario's own, where nothing is yet.
Given(
  "a file of missing tournaments of the scenario's own",
  async function (this: SpecWorld) {
    const folder = await mkdtemp(join(tmpdir(), "missing-tournaments-"));
    const path = join(folder, "missing-tournaments.md");
    sayings.set(this, {
      folder,
      path,
      file: new MissingTournamentsFile(path),
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
  "the file of missing tournaments was left saying {string}",
  async function (this: SpecWorld, said: string) {
    await writeFile(sayingOf(this).path, said);
  },
);

// Once, for Given and When alike: Cucumber matches a step whatever its word.
Given(
  "the file of missing tournaments is begun",
  async function (this: SpecWorld) {
    await sayingOf(this).file.begin();
  },
);

When(
  "{string} is written as naming the missing tournament {string}",
  async function (this: SpecWorld, documentId: string, tournamentId: string) {
    await sayingOf(this).file.missing(tournamentId, documentId);
  },
);

Then(
  "the file of missing tournaments says {string}",
  async function (this: SpecWorld, said: string) {
    assert.ok((await contentOf(this)).includes(said));
  },
);

Then(
  "the file of missing tournaments does not say {string}",
  async function (this: SpecWorld, said: string) {
    assert.ok(!(await contentOf(this)).includes(said));
  },
);

Then(
  "the file of missing tournaments has the line {string}",
  async function (this: SpecWorld, line: string) {
    assert.ok((await contentOf(this)).split("\n").includes(line));
  },
);
