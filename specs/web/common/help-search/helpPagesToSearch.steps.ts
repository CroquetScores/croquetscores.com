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

const written = async (
  world: SpecWorld,
  folder: string,
  name: string,
  content: object,
): Promise<void> => {
  const built = await buildOf(world);
  const { tag } = await languageOf(folder);
  built.tags.add(tag);
  const file = join(built.directory, tag, `${name}.json`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(content));
};

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

Given(
  "the built help has the {word} page {string} titled {string}",
  async function (
    this: SpecWorld,
    folder: string,
    name: string,
    title: string,
  ) {
    await written(this, folder, name, {
      title,
      html: "",
      headings: [],
      text: "Words.",
    });
  },
);

Then(
  "the page {string} is listed titled {string}",
  async function (this: SpecWorld, name: string, title: string) {
    assert.equal((await listedAs(this, name)).title, title);
  },
);

// The page as an earlier build wrote it: a title and its HTML, and none of the
// words kept apart for the search.
Given(
  "the built help has the {word} page {string} written without its words",
  async function (this: SpecWorld, folder: string, name: string) {
    await written(this, folder, name, { title: name, html: "" });
  },
);

Given(
  "the built help has the {word} file {string} that is not a page",
  async function (this: SpecWorld, folder: string, name: string) {
    await written(this, folder, name, { version: 1 });
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

Then(
  "the pages listed include {string} once",
  async function (this: SpecWorld, name: string) {
    const built = await buildOf(this);
    assert.equal(built.listed.filter((page) => page.name === name).length, 1);
  },
);

const listedAs = async (world: SpecWorld, name: string) => {
  const found = (await buildOf(world)).listed.find(
    (page) => page.name === name,
  );
  assert.ok(found !== undefined, `${name} is not listed.`);
  return found;
};

Then(
  "the page {string} is listed with no headings",
  async function (this: SpecWorld, name: string) {
    assert.deepEqual((await listedAs(this, name)).headings, []);
  },
);

Then(
  "the page {string} is listed with no text",
  async function (this: SpecWorld, name: string) {
    assert.equal((await listedAs(this, name)).text, "");
  },
);
