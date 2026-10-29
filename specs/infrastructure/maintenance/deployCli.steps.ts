import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type DeployOutcome,
  runDeploy,
} from "../../../src/infrastructure/maintenance/deployCli.js";
import type { SpecWorld } from "../../support/world.js";

// The script's function with git, the settings and the connection to the
// server stood in for (`deployCli.feature`): what is under test is which
// commit is chosen and when the script refuses, and not git or ssh.

interface Scene {
  host: string | undefined;
  /** Keyed by the full reference, as `refs/heads/trial`. */
  references: Map<string, string>;
  onGitHub: Set<string>;
  fetched: boolean;
  githubOutOfReach: boolean;
  serverStatus: number;
  given: string[];
  /** Whether each deploy the server was given was told to leave the database. */
  leftDatabaseAlone: boolean[];
  said: string[];
  outcome: DeployOutcome | undefined;
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  let found = scenes.get(world);
  if (found === undefined) {
    found = {
      host: undefined,
      references: new Map(),
      onGitHub: new Set(),
      fetched: false,
      githubOutOfReach: false,
      serverStatus: 0,
      given: [],
      leftDatabaseAlone: [],
      said: [],
      outcome: undefined,
    };
    scenes.set(world, found);
  }
  return found;
};

const outcomeOf = (world: SpecWorld): DeployOutcome => {
  const found = sceneOf(world).outcome;
  assert.ok(found !== undefined, "The script has not been run.");
  return found;
};

Given("a server address", function (this: SpecWorld) {
  sceneOf(this).host = "203.0.113.7";
});

Given("no server address", function (this: SpecWorld) {
  sceneOf(this).host = undefined;
});

// A commit on GitHub's copy of a branch is on GitHub by being there.
Given(
  "{string} is the commit {string}",
  function (this: SpecWorld, name: string, commit: string) {
    const scene = sceneOf(this);
    scene.references.set(`refs/remotes/${name}`, commit);
    scene.onGitHub.add(commit);
  },
);

Given(
  "the branch {string} is the commit {string}",
  function (this: SpecWorld, name: string, commit: string) {
    sceneOf(this).references.set(`refs/heads/${name}`, commit);
  },
);

Given(
  "the commit {string} is on GitHub",
  function (this: SpecWorld, commit: string) {
    sceneOf(this).onGitHub.add(commit);
  },
);

Given("GitHub cannot be reached", function (this: SpecWorld) {
  sceneOf(this).githubOutOfReach = true;
});

Given("the server's deploy ends with success", function (this: SpecWorld) {
  sceneOf(this).serverStatus = 0;
});

Given("the server's deploy ends with failure", function (this: SpecWorld) {
  sceneOf(this).serverStatus = 1;
});

const run = async (
  world: SpecWorld,
  args: readonly string[],
): Promise<void> => {
  const scene = sceneOf(world);
  scene.outcome = await runDeploy(args, {
    host: scene.host,
    fetch: () => {
      scene.fetched = true;
      return scene.githubOutOfReach
        ? Promise.reject(new Error("no route to github.com"))
        : Promise.resolve();
    },
    resolve: (reference) => Promise.resolve(scene.references.get(reference)),
    onGitHub: (commit) => Promise.resolve(scene.onGitHub.has(commit)),
    deploy: (_host, commit, options) => {
      scene.given.push(commit);
      scene.leftDatabaseAlone.push(options.skipDatabaseUpdate);
      return Promise.resolve(scene.serverStatus);
    },
    say: (line) => scene.said.push(line),
  });
};

When("the script is run with no branch", async function (this: SpecWorld) {
  await run(this, []);
});

When(
  "the script is run with the branch {string}",
  async function (this: SpecWorld, name: string) {
    await run(this, [name]);
  },
);

When(
  "the script is run with the branches {string} and {string}",
  async function (this: SpecWorld, first: string, second: string) {
    await run(this, [first, second]);
  },
);

When(
  "the script is run with no branch and the flag {string}",
  async function (this: SpecWorld, flag: string) {
    await run(this, [flag]);
  },
);

When(
  "the script is run with the branch {string} and the flag {string}",
  async function (this: SpecWorld, name: string, flag: string) {
    await run(this, [name, flag]);
  },
);

When(
  "the script is run with the flag {string} and the branch {string}",
  async function (this: SpecWorld, flag: string, name: string) {
    await run(this, [flag, name]);
  },
);

Then(
  "the server is given the commit {string}",
  function (this: SpecWorld, commit: string) {
    assert.deepEqual(sceneOf(this).given, [commit]);
  },
);

Then("the server is given no commit", function (this: SpecWorld) {
  assert.deepEqual(sceneOf(this).given, []);
});

Then(
  "the server is told to leave the database alone",
  function (this: SpecWorld) {
    assert.deepEqual(sceneOf(this).leftDatabaseAlone, [true]);
  },
);

Then(
  "the server is not told to leave the database alone",
  function (this: SpecWorld) {
    assert.deepEqual(sceneOf(this).leftDatabaseAlone, [false]);
  },
);

Then("GitHub was asked for what is new", function (this: SpecWorld) {
  assert.ok(sceneOf(this).fetched, "GitHub was not asked.");
});

Then("the deploy script exits with success", function (this: SpecWorld) {
  assert.equal(outcomeOf(this).exitCode, 0, sceneOf(this).said.join(" "));
});

Then("the deploy script exits with failure", function (this: SpecWorld) {
  assert.equal(outcomeOf(this).exitCode, 1, sceneOf(this).said.join(" "));
});

Then(
  "the deploy script says {string}",
  function (this: SpecWorld, words: string) {
    const said = sceneOf(this).said.join("\n");
    assert.ok(
      said.toLowerCase().includes(words.toLowerCase()),
      `The script said "${said}".`,
    );
  },
);
