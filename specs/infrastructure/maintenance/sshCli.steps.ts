import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type SshOutcome,
  runSsh,
} from "../../../src/infrastructure/maintenance/sshCli.js";
import type { SpecWorld } from "../../support/world.js";

// The script's function with the settings and the connection to the server
// stood in for (`sshCli.feature`): what is under test is where the sign-in is
// made to and when the script refuses, and not ssh.

interface Scene {
  host: string | undefined;
  sessionStatus: number;
  signedInTo: { account: string; host: string }[];
  said: string[];
  outcome: SshOutcome | undefined;
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  let found = scenes.get(world);
  if (found === undefined) {
    found = {
      host: undefined,
      sessionStatus: 0,
      signedInTo: [],
      said: [],
      outcome: undefined,
    };
    scenes.set(world, found);
  }
  return found;
};

const outcomeOf = (world: SpecWorld): SshOutcome => {
  const found = sceneOf(world).outcome;
  assert.ok(found !== undefined, "The script has not been run.");
  return found;
};

const address = "203.0.113.7";

Given("a server to sign in to", function (this: SpecWorld) {
  sceneOf(this).host = address;
});

Given("no server to sign in to", function (this: SpecWorld) {
  sceneOf(this).host = undefined;
});

Given(
  "the session ends with status {int}",
  function (this: SpecWorld, status: number) {
    sceneOf(this).sessionStatus = status;
  },
);

When("the sign-in script is run", async function (this: SpecWorld) {
  const scene = sceneOf(this);
  scene.outcome = await runSsh({
    host: scene.host,
    signIn: (account, host) => {
      scene.signedInTo.push({ account, host });
      return Promise.resolve(scene.sessionStatus);
    },
    say: (line) => scene.said.push(line),
  });
});

Then("the sign-in is to the server address", function (this: SpecWorld) {
  assert.deepEqual(
    sceneOf(this).signedInTo.map(({ host }) => host),
    [address],
  );
});

Then(
  "the sign-in is as the account {string}",
  function (this: SpecWorld, account: string) {
    assert.deepEqual(
      sceneOf(this).signedInTo.map((each) => each.account),
      [account],
    );
  },
);

Then("no sign-in is made", function (this: SpecWorld) {
  assert.deepEqual(sceneOf(this).signedInTo, []);
});

Then("the sign-in script exits with failure", function (this: SpecWorld) {
  assert.equal(outcomeOf(this).exitCode, 1, sceneOf(this).said.join(" "));
});

Then(
  "the sign-in script exits with status {int}",
  function (this: SpecWorld, status: number) {
    assert.equal(outcomeOf(this).exitCode, status);
  },
);

Then(
  "the sign-in script says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(
      sceneOf(this).said.some((line) => line.includes(words)),
      `The script said:\n${sceneOf(this).said.join("\n")}`,
    );
  },
);
