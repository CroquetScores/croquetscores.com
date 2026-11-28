import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { readAssets } from "../../../../src/web/common/assets.js";
import type { SpecWorld } from "../../../support/world.js";

// What a scenario has: the folder its files are in, and the names the files were
// given each time they were read, in order. Held here and not on the world,
// which every spec in the repository shares, for something only these scenarios
// have.
interface Scene {
  folder: string;
  reads: Map<string, string>[];
  /** The files the scenario has written, which are the ones asked for. */
  asked: Set<string>;
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  const scene = scenes.get(world);
  assert.ok(scene !== undefined, "There is no folder of files.");
  return scene;
};

// A folder of its own, so that what one scenario writes is not what another
// reads.
Given("a folder of the site's files", function (this: SpecWorld) {
  scenes.set(this, {
    folder: mkdtempSync(join(tmpdir(), "asset-names-")),
    reads: [],
    asked: new Set(),
  });
});

After(function (this: SpecWorld) {
  const scene = scenes.get(this);
  if (scene === undefined) return;
  rmSync(scene.folder, { recursive: true, force: true });
  scenes.delete(this);
});

const write = (scene: Scene, name: string, contents: string): string => {
  const path = join(scene.folder, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  scene.asked.add(name);
  return path;
};

Given(
  "the file {string} says {string}",
  function (this: SpecWorld, name: string, contents: string) {
    write(sceneOf(this), name, contents);
  },
);

// Every file the scenario has written is asked for by its name, as a page asks
// for the stylesheet, so that what is read is what the site would give a page.
const read = (world: SpecWorld): void => {
  const scene = sceneOf(world);
  const assets = readAssets(scene.folder, "administrator@example.com");
  scene.reads.push(
    new Map([...scene.asked].map((name) => [name, assets.url(name)])),
  );
};

Given("the files have been read", function (this: SpecWorld) {
  read(this);
});

When("the files are read", function (this: SpecWorld) {
  read(this);
});

When("the files are read again", function (this: SpecWorld) {
  read(this);
});

// The time moves on as well as the contents change, as it does when a file is
// written a minute after it was last: on a machine whose clock counts in whole
// seconds, or two writes close together, the time written would be the same
// and the file would not look changed to anything that goes by it.
const aLaterTime = (path: string): Date =>
  new Date(statSync(path).mtimeMs + 10_000);

When(
  "the file {string} is changed to say {string}",
  function (this: SpecWorld, name: string, contents: string) {
    const path = join(sceneOf(this).folder, name);
    const later = aLaterTime(path);
    write(sceneOf(this), name, contents);
    utimesSync(path, later, later);
  },
);

When(
  "the file {string} is added saying {string}",
  function (this: SpecWorld, name: string, contents: string) {
    write(sceneOf(this), name, contents);
  },
);

When(
  "the file {string} is changed to say {string} without its size or time moving",
  function (this: SpecWorld, name: string, contents: string) {
    const path = join(sceneOf(this).folder, name);
    const { size, atime, mtime } = statSync(path);
    write(sceneOf(this), name, contents);
    // The scenario is about a file that looks the same, so it has to: a
    // different length would be seen, and so would a different time.
    assert.equal(
      statSync(path).size,
      size,
      "The new contents are not the length of the old.",
    );
    utimesSync(path, atime, mtime);
  },
);

const code = /\.([0-9a-f]{8})\.[^.]+$/;

const nameOf = (world: SpecWorld, file: string, read: number): string => {
  const name = sceneOf(world).reads.at(read)?.get(file);
  assert.ok(name !== undefined, `There is no name for ${file}.`);
  return name;
};

const codeOf = (world: SpecWorld, file: string): string => {
  const found = code.exec(nameOf(world, file, -1));
  assert.ok(found?.[1] !== undefined, `${file} has no code in its name.`);
  return found[1];
};

Then(
  "the name of {string} has a code in it",
  function (this: SpecWorld, file: string) {
    codeOf(this, file);
  },
);

Then(
  "the name of {string} ends in {string}",
  function (this: SpecWorld, file: string, ending: string) {
    assert.ok(nameOf(this, file, -1).endsWith(ending));
  },
);

Then(
  "{string} and {string} have different codes",
  function (this: SpecWorld, first: string, second: string) {
    assert.notEqual(codeOf(this, first), codeOf(this, second));
  },
);

Then(
  "{string} and {string} have the same code",
  function (this: SpecWorld, first: string, second: string) {
    assert.equal(codeOf(this, first), codeOf(this, second));
  },
);

Then(
  "{string} has the same name as it had",
  function (this: SpecWorld, file: string) {
    assert.equal(nameOf(this, file, -1), nameOf(this, file, 0));
  },
);

Then(
  "{string} has a different name from the one it had",
  function (this: SpecWorld, file: string) {
    assert.notEqual(nameOf(this, file, -1), nameOf(this, file, 0));
  },
);
