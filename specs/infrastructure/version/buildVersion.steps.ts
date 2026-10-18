import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  readBuiltVersion,
  versionOfHistory,
  writeBuiltVersion,
} from "../../../src/infrastructure/version/buildVersion.js";
import type { SpecWorld } from "../../support/world.js";

// The version of a build (`buildVersion.feature`). The history is a real one,
// made with git in a folder of the scenario's own, because what is asked is
// what git says of it: a stand-in that agreed with the code about how to count
// would agree with it wherever it was wrong.

interface Version {
  /** The folders made for the scenario, all removed after it. */
  readonly made: string[];
  /** The folder the history is in. */
  history: string | undefined;
  /** What was worked out of it. */
  worked: number | undefined;
  /** Where the build wrote down its version. */
  recorded: string | undefined;
  /** What the site read of it. */
  read: number | undefined;
}

const versions = new WeakMap<SpecWorld, Version>();

const versionOf = (world: SpecWorld): Version => {
  let found = versions.get(world);
  if (found === undefined) {
    found = {
      made: [],
      history: undefined,
      worked: undefined,
      recorded: undefined,
      read: undefined,
    };
    versions.set(world, found);
  }
  return found;
};

const folderFor = (world: SpecWorld): string => {
  const folder = mkdtempSync(join(tmpdir(), "build-version-"));
  versionOf(world).made.push(folder);
  return folder;
};

After(function (this: SpecWorld) {
  for (const folder of versions.get(this)?.made ?? []) {
    rmSync(folder, { recursive: true, force: true });
  }
});

const git = (folder: string, ...args: string[]): void => {
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Spec",
      "-c",
      "user.email=spec@example.com",
      "-c",
      "commit.gpgsign=false",
      ...args,
    ],
    { cwd: folder, stdio: "pipe" },
  );
};

const commit = (folder: string, count: number): void => {
  for (let each = 0; each < count; each += 1) {
    git(folder, "commit", "--allow-empty", "-m", "A commit");
  }
};

const historyOf = (world: SpecWorld): string => {
  const { history } = versionOf(world);
  assert.ok(history !== undefined, "The scenario has no history.");
  return history;
};

Given(
  "a history of {int} commits on main",
  function (this: SpecWorld, count: number) {
    const folder = folderFor(this);
    git(folder, "init", "--quiet", "--initial-branch", "main");
    commit(folder, count);
    versionOf(this).history = folder;
  },
);

Given(
  "a merge that brought in {int} commits of a branch",
  function (this: SpecWorld, count: number) {
    const folder = historyOf(this);
    git(folder, "switch", "--quiet", "--create", "merged");
    commit(folder, count);
    git(folder, "switch", "--quiet", "main");
    git(
      folder,
      "merge",
      "--quiet",
      "--no-ff",
      "--message",
      "A merge",
      "merged",
    );
  },
);

Given(
  "{int} commits on a branch that has not been merged",
  function (this: SpecWorld, count: number) {
    const folder = historyOf(this);
    git(folder, "switch", "--quiet", "--create", "unmerged");
    commit(folder, count);
    git(folder, "switch", "--quiet", "main");
  },
);

// Cloned from the first, as a build in CI has it: the commit it is at and none
// before it.
Given("the history has been cut short", function (this: SpecWorld) {
  const whole = historyOf(this);
  const folder = folderFor(this);
  git(folder, "clone", "--quiet", "--depth", "1", `file://${whole}`, ".");
  versionOf(this).history = folder;
});

Given("a folder with no history", function (this: SpecWorld) {
  versionOf(this).history = folderFor(this);
});

When("the version is worked out", function (this: SpecWorld) {
  versionOf(this).worked = versionOfHistory(historyOf(this));
});

Then("the version is {int}", function (this: SpecWorld, expected: number) {
  assert.equal(versionOf(this).worked, expected);
});

Then("no version is known", function (this: SpecWorld) {
  assert.equal(versionOf(this).worked, undefined);
});

// What the build wrote down ----------------------------------------------------

const recordIn = (world: SpecWorld): string => {
  const version = versionOf(world);
  version.recorded = join(folderFor(world), "dist", "version.json");
  mkdirSync(join(version.recorded, ".."), { recursive: true });
  return version.recorded;
};

Given(
  "a build that wrote down version {int}",
  function (this: SpecWorld, version: number) {
    writeBuiltVersion(recordIn(this), version);
  },
);

Given("a build that wrote down no version", function (this: SpecWorld) {
  writeBuiltVersion(recordIn(this), undefined);
});

// Where a version would be, and nothing there: development, where nothing is
// built.
Given("nothing was built", function (this: SpecWorld) {
  const version = versionOf(this);
  version.recorded = join(folderFor(this), "dist", "version.json");
});

// Written by hand and not by the build, which would not write what is not a
// version.
Given(
  "a build that wrote down {string} as its version",
  function (this: SpecWorld, written: string) {
    writeFileSync(recordIn(this), JSON.stringify({ version: written }));
  },
);

When("the site reads its version", function (this: SpecWorld) {
  const { recorded } = versionOf(this);
  assert.ok(recorded !== undefined, "The scenario has no build.");
  versionOf(this).read = readBuiltVersion(recorded);
});

Then(
  "the site's version is {int}",
  function (this: SpecWorld, expected: number) {
    assert.equal(versionOf(this).read, expected);
  },
);

Then("the site has no version", function (this: SpecWorld) {
  assert.equal(versionOf(this).read, undefined);
});
