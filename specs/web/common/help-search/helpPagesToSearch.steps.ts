import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import type { HelpPageToSearch } from "../../../../src/application/services/HelpSearchIndex.js";
import { helpPagesToSearchIn } from "../../../../src/web/common/helpPagesToSearch.js";
import type { SpecWorld } from "../../../support/world.js";
import { languageOf } from "./helpFolders.js";

// A folder of the scenario's own, laid out as the build lays out dist/help.
interface Built {
  readonly directory: string;
  readonly tags: Set<string>;
  listed: readonly HelpPageToSearch[];
}

const builds = new WeakMap<SpecWorld, Built>();

const buildOf = async (world: SpecWorld): Promise<Built> => {
  let built = builds.get(world);
  if (built === undefined) {
    built = {
      directory: await mkdtemp(join(tmpdir(), "built-help-")),
      tags: new Set(),
      listed: [],
    };
    builds.set(world, built);
  }
  return built;
};

After(async function (this: SpecWorld) {
  const built = builds.get(this);
  if (built !== undefined) {
    await rm(built.directory, { recursive: true, force: true });
  }
  builds.delete(this);
});

Given(
  "the built help has the {word} page {string}",
  async function (this: SpecWorld, folder: string, name: string) {
    const built = await buildOf(this);
    const { tag } = await languageOf(folder);
    built.tags.add(tag);
    // The page of a folder is written as the build writes it, as index.json.
    const file = join(built.directory, tag, `${name}.json`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(
      file,
      JSON.stringify({ title: name, html: "", headings: [], text: "Words." }),
    );
  },
);

When("the pages to search are listed", async function (this: SpecWorld) {
  const built = await buildOf(this);
  built.listed = await helpPagesToSearchIn(built.directory, () => [
    ...built.tags,
  ]).all();
});

Then(
  "the pages listed include {string}",
  async function (this: SpecWorld, name: string) {
    const built = await buildOf(this);
    assert.ok(
      built.listed.some((page) => page.name === name),
      `${name} is not among ${built.listed.map((page) => page.name).join(", ")}.`,
    );
  },
);

Then(
  "the pages listed do not include {string}",
  async function (this: SpecWorld, name: string) {
    const built = await buildOf(this);
    assert.ok(
      !built.listed.some((page) => page.name === name),
      `${name} is among the pages listed.`,
    );
  },
);
