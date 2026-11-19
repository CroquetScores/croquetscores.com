// The allowances the API holds each caller to (rateLimit.feature), asked as an
// app asks, from addresses a scenario chooses. A key's allowance is changed as
// an administrator changes it, by the interface the administrator's page uses.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { sessionFor } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";
import { answered, asIfFrom, asked, bearer, keyMade } from "../apiOfApps.js";
import { permissionsOf, bare } from "../permissions/permissions.steps.js";

interface KeyListed {
  readonly id: string;
  readonly owner: string;
  readonly perMinute: number;
  readonly perDay: number;
}

const administrator = "admin@example.com";

// Said as the administrator's page says it, from the same site and with its
// session, since the interface refuses a request that does not come from its
// own pages.
const asAdministrator = async (
  world: WebWorld,
  method: "GET" | "POST",
  path: string,
  body?: object,
): Promise<Response> =>
  fetch(`${world.baseUrl!}/api/site${path}`, {
    method,
    headers: {
      cookie: `session=${await sessionFor(administrator)}`,
      "sec-fetch-site": "same-origin",
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

const limitOf = async (
  world: WebWorld,
  owner: string,
  changes: { perMinute?: number; perDay?: number },
): Promise<void> => {
  const listing = await asAdministrator(world, "GET", "/api-keys");
  assert.equal(listing.status, 200, "The administrator could not list keys.");
  const { keys } = (await listing.json()) as { keys: KeyListed[] };
  const owned = keys.filter((each) => each.owner === owner);
  assert.ok(owned.length > 0, `${owner} has no key.`);
  for (const key of owned) {
    const answer = await asAdministrator(world, "POST", "/api-keys/limits", {
      keyId: key.id,
      perMinute: changes.perMinute ?? key.perMinute,
      perDay: changes.perDay ?? key.perDay,
    });
    assert.equal(answer.status, 204, "The limits were not changed.");
  }
};

Given(
  "the key of {string} is limited to {int} a minute",
  async function (this: WebWorld, owner: string, perMinute: number) {
    await limitOf(this, owner, { perMinute });
  },
);

Given(
  "the key of {string} is limited to {int} a day",
  async function (this: WebWorld, owner: string, perDay: number) {
    await limitOf(this, owner, { perDay });
  },
);

const askedTimes = async (
  world: WebWorld,
  tournament: string,
  times: number,
  headers: Record<string, string>,
): Promise<void> => {
  for (let each = 0; each < times; each++) {
    await asked(world, permissionsOf(bare(world, tournament)), headers);
  }
};

Given(
  "the permissions in {string} have been asked {int} times with that key",
  async function (this: WebWorld, tournament: string, times: number) {
    await askedTimes(this, tournament, times, bearer(keyMade(this)));
  },
);

Given(
  "the permissions in {string} have been asked {int} times with the key {string}",
  async function (
    this: WebWorld,
    tournament: string,
    times: number,
    key: string,
  ) {
    await askedTimes(this, tournament, times, bearer(key));
  },
);

Given(
  "the permissions in {string} have been asked {int} times with no key",
  async function (this: WebWorld, tournament: string, times: number) {
    await askedTimes(this, tournament, times, {});
  },
);

Given(
  "the API has been asked for an address there is nothing at {int} times",
  async function (this: WebWorld, times: number) {
    for (let each = 0; each < times; each++) {
      await asked(this, "/api/v0/nothing-here", bearer(keyMade(this)));
    }
  },
);

const numberIn = (world: WebWorld, header: string): number => {
  const said = answered(world).headers.get(header);
  assert.ok(said !== null, `The API sent no ${header}.`);
  return Number(said);
};

Then(
  "the API says the allowance was {int}",
  function (this: WebWorld, allowance: number) {
    assert.equal(numberIn(this, "ratelimit-limit"), allowance);
  },
);

Then("the API says {int} are left", function (this: WebWorld, left: number) {
  assert.equal(numberIn(this, "ratelimit-remaining"), left);
});

Then(
  "the API says when the allowance is made again",
  function (this: WebWorld) {
    assert.ok(numberIn(this, "ratelimit-reset") >= 0);
  },
);

Then(
  "the API tells the caller to wait a number of seconds",
  function (this: WebWorld) {
    assert.match(answered(this).headers.get("retry-after") ?? "", /^\d+$/);
  },
);

// The website's own interface asks nothing of a key, so it is asked without
// one, and as often as the scenario says.
const statuses = new WeakMap<WebWorld, number[]>();

When(
  "the site's own interface is asked {int} times",
  async function (this: WebWorld, times: number) {
    const seen: number[] = [];
    for (let each = 0; each < times; each++) {
      const answer = await fetch(`${this.baseUrl!}/api/site/api-keys`, {
        headers: asIfFrom(this),
      });
      seen.push(answer.status);
    }
    statuses.set(this, seen);
  },
);

Then("none of the answers was 429", function (this: WebWorld) {
  const seen = statuses.get(this);
  assert.ok(seen !== undefined && seen.length > 0, "Nothing was asked.");
  assert.ok(!seen.includes(429), `Some were refused: ${seen.join(", ")}.`);
});
