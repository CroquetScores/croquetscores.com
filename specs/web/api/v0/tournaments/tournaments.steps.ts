// The public API's list of a year's tournaments (tournaments.feature), asked as
// an app asks: plain requests, with the key as a bearer token when it has one.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { tournamentIdOf } from "../../site/advantage/apiScene.js";
import {
  answered,
  asked,
  bearer,
  keyMade,
  sceneOf,
  type Answer,
} from "../apiOfApps.js";

const listPath = (
  year: string | number | undefined,
  more: Record<string, string> = {},
): string => {
  const asks = new URLSearchParams({
    ...(year === undefined ? {} : { year: String(year) }),
    ...more,
  });
  return `/api/v0/tournaments?${asks.toString()}`;
};

const withThatKey = (world: WebWorld): Record<string, string> =>
  bearer(keyMade(world));

When(
  "the tournaments of {int} are asked with that key",
  async function (this: WebWorld, year: number) {
    sceneOf(this).earlier = undefined;
    await asked(this, listPath(year), withThatKey(this));
  },
);

When(
  "the tournaments of {string} are asked with that key",
  async function (this: WebWorld, year: string) {
    await asked(this, listPath(year), withThatKey(this));
  },
);

When(
  "the tournaments of {int} are asked with no key",
  async function (this: WebWorld, year: number) {
    await asked(this, listPath(year), {});
  },
);

When(
  "the tournaments of {int} are asked with the key {string}",
  async function (this: WebWorld, year: number, key: string) {
    await asked(this, listPath(year), bearer(key));
  },
);

When(
  "the tournaments are asked with that key and no year",
  async function (this: WebWorld) {
    await asked(this, listPath(undefined), withThatKey(this));
  },
);

When(
  "the tournaments of {int} in the sport {string} are asked with that key",
  async function (this: WebWorld, year: number, sport: string) {
    await asked(this, listPath(year, { sport }), withThatKey(this));
  },
);

When(
  "the tournaments of {int} are asked with that key and a page size of {int}",
  async function (this: WebWorld, year: number, size: number) {
    await asked(
      this,
      listPath(year, { pageSize: String(size) }),
      withThatKey(this),
    );
  },
);

When(
  "the tournaments of {int} are asked with that key and a page size of {string}",
  async function (this: WebWorld, year: number, size: string) {
    await asked(this, listPath(year, { pageSize: size }), withThatKey(this));
  },
);

When(
  "the tournaments of {int} are asked for page {int} with that key and a page size of {int}",
  async function (this: WebWorld, year: number, page: number, size: number) {
    await asked(
      this,
      listPath(year, { page: String(page), pageSize: String(size) }),
      withThatKey(this),
    );
  },
);

When(
  "the tournaments of {int} are asked for page {string} with that key",
  async function (this: WebWorld, year: number, page: string) {
    await asked(this, listPath(year, { page }), withThatKey(this));
  },
);

When(
  "the tournaments of {int} are asked with that key changed since {string}",
  async function (this: WebWorld, year: number, moment: string) {
    await asked(
      this,
      listPath(year, { changedSince: moment }),
      withThatKey(this),
    );
  },
);

const headerOf = (answer: Answer, name: string): string => {
  const value = answer.headers.get(name);
  assert.ok(value !== null, `The API sent no ${name}.`);
  return value;
};

// Each asks with the mark of the first full answer, since a 304 repeats none, so
// a scenario that asks again more than once asks about the same thing.
When(
  "the tournaments of {int} are asked again with that key and the mark it gave",
  async function (this: WebWorld, year: number) {
    const scene = sceneOf(this);
    const earlier = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    await asked(this, listPath(year), {
      ...withThatKey(this),
      "if-none-match": headerOf(earlier, "etag"),
    });
  },
);

When(
  "the tournaments of {int} are asked again with that key and the date it gave",
  async function (this: WebWorld, year: number) {
    const earlier = answered(this);
    await asked(this, listPath(year), {
      ...withThatKey(this),
      "if-modified-since": headerOf(earlier, "last-modified"),
    });
  },
);

Given(
  "the tournaments of {int} have been asked {int} times with that key",
  async function (this: WebWorld, year: number, times: number) {
    for (let each = 0; each < times; each++) {
      await asked(this, listPath(year), withThatKey(this));
    }
  },
);

Given(
  "the tournaments of {int} have been asked {int} times with no key",
  async function (this: WebWorld, year: number, times: number) {
    for (let each = 0; each < times; each++) {
      await asked(this, listPath(year), {});
    }
  },
);

interface Listed {
  readonly [field: string]: unknown;
}

const listed = (world: WebWorld): readonly Listed[] => {
  const { tournaments } = answered(world).body;
  assert.ok(Array.isArray(tournaments), "The API listed no tournaments.");
  return tournaments as Listed[];
};

const namedInList = (world: WebWorld, name: string): Listed => {
  const found = listed(world).find((each) => each["name"] === name);
  assert.ok(found !== undefined, `${name} was not listed.`);
  return found;
};

Then(
  /^the tournaments listed are (.+)$/,
  function (this: WebWorld, names: string) {
    const wanted = [...names.matchAll(/"([^"]+)"/g)].map((each) => each[1]!);
    assert.deepEqual(
      listed(this)
        .map((each) => each["name"])
        .sort(),
      [...wanted].sort(),
    );
  },
);

Then("no tournaments are listed", function (this: WebWorld) {
  assert.deepEqual(listed(this), []);
});

Then(
  "the page lists {int} tournaments",
  function (this: WebWorld, count: number) {
    assert.equal(listed(this).length, count);
  },
);

Then(
  "the tournament {string} says its id",
  function (this: WebWorld, name: string) {
    assert.equal(namedInList(this, name)["id"], tournamentIdOf(this, name));
  },
);

const fieldIs = (field: string, said: string): void => {
  Then(
    `the tournament {string} says ${said} {string}`,
    function (this: WebWorld, name: string, value: string) {
      assert.equal(namedInList(this, name)[field], value);
    },
  );
};

fieldIs("starts", "it starts on");
fieldIs("finishes", "it finishes on");
fieldIs("country", "its country is");
fieldIs("region", "its region is");
fieldIs("sport", "its sport is");
fieldIs("changedAt", "it last changed at");

Then(
  "the tournament {string} says where the API tells of it",
  function (this: WebWorld, name: string) {
    assert.equal(
      namedInList(this, name)["href"],
      `/api/v0/tournaments/${tournamentIdOf(this, name).replace(/^tournament\//, "")}`,
    );
  },
);

Then(
  "the tournament {string} says where it is found",
  function (this: WebWorld, name: string) {
    const kept = this.tournaments.get(name);
    assert.ok(kept !== undefined, `No tournament called ${name} was made.`);
    assert.equal(namedInList(this, name)["uri"], `/${kept.address}`);
  },
);

for (const [kind, said] of [
  ["national", "national"],
  ["international", "international"],
] as const) {
  Then(
    `the tournament {string} says it is ${said}`,
    function (this: WebWorld, name: string) {
      assert.equal(namedInList(this, name)[kind], true);
    },
  );
  Then(
    `the tournament {string} says it is not ${said}`,
    function (this: WebWorld, name: string) {
      assert.equal(namedInList(this, name)[kind], false);
    },
  );
}

Then(
  "the API says there are {int} tournaments in all",
  function (this: WebWorld, total: number) {
    assert.equal(answered(this).body["total"], total);
  },
);

Then(
  "the API says the next page is {int}",
  function (this: WebWorld, page: number) {
    assert.equal(answered(this).body["next"], page);
  },
);

Then("the API says there is no next page", function (this: WebWorld) {
  assert.equal(answered(this).body["next"], null);
});

Then(
  "the API says the page size is {int}",
  function (this: WebWorld, size: number) {
    assert.equal(answered(this).body["pageSize"], size);
  },
);

Then("the API gives a mark of its answer", function (this: WebWorld) {
  assert.match(headerOf(answered(this), "etag"), /^"[^"]+"$/);
});

Then("the API says when its answer last changed", function (this: WebWorld) {
  assert.ok(
    Number.isFinite(Date.parse(headerOf(answered(this), "last-modified"))),
    "The API's date was not a date.",
  );
});

Then(
  "the API says nothing of when its answer last changed",
  function (this: WebWorld) {
    assert.equal(answered(this).headers.get("last-modified"), null);
  },
);

Then(
  "the API says the answer is for the app to keep and to check before it uses it",
  function (this: WebWorld) {
    assert.equal(
      answered(this).headers.get("cache-control"),
      "private, no-cache",
    );
  },
);
