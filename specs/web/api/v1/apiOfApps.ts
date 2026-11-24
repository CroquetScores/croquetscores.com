// What every scenario about the public API shares: the key an app sends, the
// address it is said to come from, what it was answered with, and the steps
// that read an answer for what every answer has (status, code, field, sentence
// and the headers that say what may be kept). The API is asked as an app asks
// it, with plain requests and the key as a bearer token, and a key is made as
// its owner makes one, by the page that makes them, so that nothing of the
// site's code is named here.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { sessionFor } from "../../support/control.js";
import type { WebWorld } from "../../support/world.js";

export interface Answer {
  readonly status: number;
  readonly headers: Headers;
  readonly body: Record<string, unknown>;
}

interface Scene {
  /** The key last made, as its owner was shown it. */
  key: string | undefined;
  /** The address the next requests are said to come from, if one is said. */
  address: string | undefined;
  answer: Answer | undefined;
  /** The answer a request was last made with the mark and date of, to ask again. */
  earlier: Answer | undefined;
  /** A moment a scenario kept, to ask what changed since. */
  kept: string | undefined;
  /** The session of the reader a scenario signed in, as their browser holds it. */
  session: string | undefined;
  /** The key the caller sends with what it changes, which may be one that does not work. */
  sends: string | undefined;
}

const scenes = new WeakMap<WebWorld, Scene>();

export const sceneOf = (world: WebWorld): Scene => {
  let scene = scenes.get(world);
  if (scene === undefined) {
    scene = {
      key: undefined,
      address: undefined,
      answer: undefined,
      earlier: undefined,
      kept: undefined,
      session: undefined,
      sends: undefined,
    };
    scenes.set(world, scene);
  }
  return scene;
};

/** Keeps the key a page shows its owner, as the owner would copy it. */
export const rememberKeyShownBy = (world: WebWorld, page: string): void => {
  const shown = /id="api-key-new">(cs_[^<]+)</.exec(page);
  assert.ok(shown?.[1] !== undefined, "The page showed no key.");
  sceneOf(world).key = shown[1];
};

export const makeKey = async (
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
  rememberKeyShownBy(world, await answer.text());
};

export const keyMade = (world: WebWorld): string => {
  const { key } = sceneOf(world);
  assert.ok(key !== undefined, "No key was made.");
  return key;
};

let addressesGiven = 0;

/** An address no other scenario of the run has asked from. */
const nextAddress = (): string => {
  addressesGiven += 1;
  return `10.20.${String(Math.floor(addressesGiven / 250) % 250)}.${String((addressesGiven % 250) + 1)}`;
};

/** What a request sends to be counted against an address the scenario chose. */
export const asIfFrom = (world: WebWorld): Record<string, string> => {
  const { address } = sceneOf(world);
  return address === undefined ? {} : { "x-forwarded-for": address };
};

export const asked = async (
  world: WebWorld,
  path: string,
  headers: Record<string, string>,
): Promise<Answer> => {
  const answer = await fetch(`${world.baseUrl!}${path}`, {
    headers: { ...asIfFrom(world), ...headers },
  });
  const text = await answer.text();
  const said: Answer = {
    status: answer.status,
    headers: answer.headers,
    body: text === "" ? {} : (JSON.parse(text) as Record<string, unknown>),
  };
  sceneOf(world).answer = said;
  return said;
};

/**
 * Changes something as a caller does: with the session of the reader the
 * scenario signed in, as their browser sends it from the site's own pages,
 * and with the key it chose to send, as an app does. Either, both or neither,
 * since which of them a route goes by is what the scenarios are about.
 */
export const told = async (
  world: WebWorld,
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: object,
): Promise<Answer> => {
  const scene = sceneOf(world);
  const { session, sends } = scene;
  // Each scenario asks from an address of its own unless it chose one, so that
  // what one is refused is not counted against the next: a caller with no key
  // is counted by its address, and they would all be one address here.
  scene.address ??= nextAddress();
  const answer = await fetch(`${world.baseUrl!}${path}`, {
    method,
    headers: {
      ...asIfFrom(world),
      ...(session === undefined
        ? {}
        : { cookie: `session=${session}`, "sec-fetch-site": "same-origin" }),
      ...(sends === undefined ? {} : bearer(sends)),
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await answer.text();
  const said: Answer = {
    status: answer.status,
    headers: answer.headers,
    body: text === "" ? {} : (JSON.parse(text) as Record<string, unknown>),
  };
  sceneOf(world).answer = said;
  return said;
};

export const bearer = (key: string): Record<string, string> => ({
  authorization: `Bearer ${key}`,
});

export const answered = (world: WebWorld): Answer => {
  const { answer } = sceneOf(world);
  assert.ok(answer !== undefined, "Nothing has been asked of the API.");
  return answer;
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

Given(
  "the caller is signed in as {string}",
  async function (this: WebWorld, address: string) {
    sceneOf(this).session = await sessionFor(address);
  },
);

Given("the caller sends that key", function (this: WebWorld) {
  sceneOf(this).sends = keyMade(this);
});

Given(
  "the caller sends the key {string}",
  function (this: WebWorld, key: string) {
    sceneOf(this).sends = key;
  },
);

Given(
  "the caller is at the address {string}",
  function (this: WebWorld, address: string) {
    sceneOf(this).address = address;
  },
);

Then("the API answers {int}", function (this: WebWorld, status: number) {
  assert.equal(answered(this).status, status);
});

Then("the API's code is {string}", function (this: WebWorld, code: string) {
  assert.equal(answered(this).body["code"], code);
});

Then(
  "the API says the field at fault is {string}",
  function (this: WebWorld, field: string) {
    assert.equal(answered(this).body["field"], field);
  },
);

Then("the API says no field was at fault", function (this: WebWorld) {
  assert.equal(answered(this).body["field"], undefined);
});

Then("the API says a sentence", function (this: WebWorld) {
  const { message } = answered(this).body;
  assert.ok(
    typeof message === "string" && message.length > 0,
    "The API said no sentence.",
  );
});

Then("the API says nothing more", function (this: WebWorld) {
  assert.deepEqual(answered(this).body, {});
});

Then("the API asks for a bearer token", function (this: WebWorld) {
  assert.match(answered(this).headers.get("www-authenticate") ?? "", /^Bearer/);
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
