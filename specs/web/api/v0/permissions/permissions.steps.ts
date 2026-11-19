// The public API's answer to what a key may do in a tournament
// (permissions.feature), asked as an app asks: plain requests, with the key
// as a bearer token. A key is made as its owner makes one, by the page that
// makes them, so that nothing of the site's code is named here.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { sessionFor } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";
import { tournamentIdOf } from "../../site/advantage/apiScene.js";

interface Answer {
  readonly status: number;
  readonly headers: Headers;
  readonly body: Record<string, unknown>;
}

interface Scene {
  /** The key last made, as its owner was shown it. */
  key: string | undefined;
  answer: Answer | undefined;
}

const scenes = new WeakMap<WebWorld, Scene>();

const sceneOf = (world: WebWorld): Scene => {
  let scene = scenes.get(world);
  if (scene === undefined) {
    scene = { key: undefined, answer: undefined };
    scenes.set(world, scene);
  }
  return scene;
};

const makeKey = async (
  world: WebWorld,
  address: string,
  write: boolean,
): Promise<void> => {
  const session = await sessionFor(address);
  const answer = await fetch(`${world.baseUrl!}/account/api-keys/new`, {
    method: "POST",
    headers: {
      cookie: `session=${session}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      label: "An app",
      ...(write ? { write: "on" } : {}),
    }),
  });
  assert.equal(answer.status, 200, "The site would not make the key.");
  const shown = /id="api-key-new">(cs_[^<]+)</.exec(await answer.text());
  assert.ok(shown?.[1] !== undefined, "The page showed no key.");
  sceneOf(world).key = shown[1];
};

Given(
  "{string} has made a key that may read and write",
  async function (this: WebWorld, address: string) {
    await makeKey(this, address, true);
  },
);

Given(
  "{string} has made a key that may only read",
  async function (this: WebWorld, address: string) {
    await makeKey(this, address, false);
  },
);

// The address names the tournament by the part of its id after "tournament/".
const permissionsOf = (tournament: string): string =>
  `/api/v0/tournaments/${tournament}/permissions`;

const asked = async (
  world: WebWorld,
  path: string,
  headers: Record<string, string>,
): Promise<void> => {
  const answer = await fetch(`${world.baseUrl!}${path}`, { headers });
  const text = await answer.text();
  sceneOf(world).answer = {
    status: answer.status,
    headers: answer.headers,
    body: text === "" ? {} : (JSON.parse(text) as Record<string, unknown>),
  };
};

const bare = (world: WebWorld, name: string): string =>
  tournamentIdOf(world, name).replace(/^tournament\//, "");

const keyMade = (world: WebWorld): string => {
  const { key } = sceneOf(world);
  assert.ok(key !== undefined, "No key was made.");
  return key;
};

When(
  "the permissions in {string} are asked with no key",
  async function (this: WebWorld, tournament: string) {
    await asked(this, permissionsOf(bare(this, tournament)), {});
  },
);

When(
  "the permissions in {string} are asked with that key",
  async function (this: WebWorld, tournament: string) {
    await asked(this, permissionsOf(bare(this, tournament)), {
      authorization: `Bearer ${keyMade(this)}`,
    });
  },
);

When(
  "the permissions in {string} are asked with that key in the address",
  async function (this: WebWorld, tournament: string) {
    await asked(
      this,
      `${permissionsOf(bare(this, tournament))}?key=${keyMade(this)}`,
      {},
    );
  },
);

When(
  "the permissions in {string} are asked with the key {string}",
  async function (this: WebWorld, tournament: string, key: string) {
    await asked(this, permissionsOf(bare(this, tournament)), {
      authorization: `Bearer ${key}`,
    });
  },
);

When(
  "the permissions in a tournament there is not are asked with that key",
  async function (this: WebWorld) {
    await asked(this, permissionsOf("not-a-tournament"), {
      authorization: `Bearer ${keyMade(this)}`,
    });
  },
);

When(
  "the permissions in a tournament there is not are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await asked(this, permissionsOf("not-a-tournament"), {
      authorization: `Bearer ${key}`,
    });
  },
);

const answered = (world: WebWorld): Answer => {
  const { answer } = sceneOf(world);
  assert.ok(answer !== undefined, "Nothing has been asked of the API.");
  return answer;
};

Then("the API answers {int}", function (this: WebWorld, status: number) {
  assert.equal(answered(this).status, status);
});

Then("the API's code is {string}", function (this: WebWorld, code: string) {
  assert.equal(answered(this).body["code"], code);
});

Then("the API asks for a bearer token", function (this: WebWorld) {
  assert.match(answered(this).headers.get("www-authenticate") ?? "", /^Bearer/);
});

Then(
  "the API says the part is {string}",
  function (this: WebWorld, part: string) {
    assert.equal(answered(this).body["part"], part);
  },
);

Then("the API says the key may write", function (this: WebWorld) {
  assert.equal(answered(this).body["mayWrite"], true);
});

Then("the API says the key may not write", function (this: WebWorld) {
  assert.equal(answered(this).body["mayWrite"], false);
});

Then("the API says the key may read", function (this: WebWorld) {
  assert.equal(answered(this).body["mayRead"], true);
});

Then("the API says the answer is not to be kept", function (this: WebWorld) {
  assert.equal(answered(this).headers.get("cache-control"), "no-store");
});

Then(
  "the API says the answer depends on the Authorization header",
  function (this: WebWorld) {
    assert.match(answered(this).headers.get("vary") ?? "", /Authorization/i);
  },
);
