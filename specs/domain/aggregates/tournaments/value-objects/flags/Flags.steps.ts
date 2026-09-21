import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { inspect } from "node:util";

import { Flags } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Flags.js";
import type { SpecWorld } from "../../../../../support/world.js";

// Found from here rather than from wherever the run was started, so that the
// scenarios read the same folder however they are run.
const IMAGES = fileURLToPath(
  new URL("../../../../../../assets/images", import.meta.url),
);

// Every file under assets/images, by its path there, written with forward
// slashes as a flag's relative path is on every system.
const filesUnderImages = (): string[] =>
  readdirSync(IMAGES, { recursive: true, encoding: "utf8" })
    .filter((path) => statSync(join(IMAGES, path)).isFile())
    .map((path) => path.split(sep).join("/"));

const flagsOfWorld = (world: SpecWorld): Flags => {
  assert.ok(
    world.flags !== undefined,
    `No flags have been made: ${inspect(world.failure)}`,
  );
  return world.flags;
};

// The flag the scenario names by position, and the count of those named so
// far, so that "there are no more flags" knows where it is.
const flagAt = (world: SpecWorld, position: number, name: string): void => {
  const flag = flagsOfWorld(world).all[position];
  assert.ok(flag !== undefined, `There is no flag ${position + 1}.`);
  assert.equal(String(flag), name);
  world.flagsChecked = position + 1;
};

Given("the file {string}", function (this: SpecWorld, path: string) {
  this.flagFiles.push(path);
});

Given("the flags there are", function (this: SpecWorld) {
  this.flags = Flags.thereAre;
});

// Making the flags may be refused, and the scenario says which it expects.
When("the flags are made", function (this: SpecWorld) {
  try {
    this.flags = Flags.from(this.flagFiles);
  } catch (failure) {
    this.failure = failure;
  }
});

When("the flag {string} is found", function (this: SpecWorld, name: string) {
  const flag = flagsOfWorld(this).find(name);
  assert.ok(flag !== undefined, `There is no flag "${name}".`);
  this.flag = flag;
});

Then("there is a flag {string}", function (this: SpecWorld, name: string) {
  assert.notEqual(flagsOfWorld(this).find(name), undefined);
});

Then("there is no flag {string}", function (this: SpecWorld, name: string) {
  assert.equal(flagsOfWorld(this).find(name), undefined);
});

Then("the first flag is {string}", function (this: SpecWorld, name: string) {
  flagAt(this, 0, name);
});

Then("the second flag is {string}", function (this: SpecWorld, name: string) {
  flagAt(this, 1, name);
});

Then("the third flag is {string}", function (this: SpecWorld, name: string) {
  flagAt(this, 2, name);
});

Then("there are no more flags", function (this: SpecWorld) {
  assert.deepEqual(
    flagsOfWorld(this).all.slice(this.flagsChecked).map(String),
    [],
  );
});

// Each side is named in full when it fails, so that whoever reads it knows
// which images to add to the list, or which to take out of it.
Then(
  "every image under assets\\/images is one of them",
  function (this: SpecWorld) {
    const listed = new Set(
      flagsOfWorld(this).all.map((flag) => flag.relativePath),
    );
    assert.deepEqual(
      filesUnderImages().filter((path) => !listed.has(path)),
      [],
      "These images are not flags there are.",
    );
  },
);

Then(
  "every one of them has its image under assets\\/images",
  function (this: SpecWorld) {
    const files = new Set(filesUnderImages());
    assert.deepEqual(
      flagsOfWorld(this)
        .all.map((flag) => flag.relativePath)
        .filter((path) => !files.has(path)),
      [],
      "These flags have no image.",
    );
  },
);
