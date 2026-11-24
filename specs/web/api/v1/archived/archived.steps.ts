// The public API's list of the tournaments whose year has changed
// (changedYear.feature), asked as an app asks: plain requests, with the key as
// a bearer token when it has one.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";
import { tournamentIdOf } from "../../site/advantage/apiScene.js";
import { answered, asked, bearer, keyMade, sceneOf } from "../apiOfApps.js";

const pathOf = (more: Record<string, string> = {}): string => {
  const asks = new URLSearchParams(more).toString();
  return `/api/v1/tournaments/archived${asks === "" ? "" : `?${asks}`}`;
};

const withThatKey = (world: WebWorld): Record<string, string> =>
  bearer(keyMade(world));

When(
  "the archived tournaments are asked with that key",
  async function (this: WebWorld) {
    sceneOf(this).earlier = undefined;
    await asked(this, pathOf(), withThatKey(this));
  },
);

When(
  "the archived tournaments are asked with no key",
  async function (this: WebWorld) {
    await asked(this, pathOf(), {});
  },
);

When(
  "the archived tournaments are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await asked(this, pathOf(), bearer(key));
  },
);

When(
  "the archived tournaments are asked with that key archived since {string}",
  async function (this: WebWorld, moment: string) {
    await asked(this, pathOf({ archivedSince: moment }), withThatKey(this));
  },
);

When(
  "the archived tournaments are asked with that key and a page size of {int}",
  async function (this: WebWorld, size: number) {
    await asked(this, pathOf({ pageSize: String(size) }), withThatKey(this));
  },
);

When(
  "the archived tournaments are asked with that key and a page size of {string}",
  async function (this: WebWorld, size: string) {
    await asked(this, pathOf({ pageSize: size }), withThatKey(this));
  },
);

When(
  "the archived tournaments are asked for page {int} with that key and a page size of {int}",
  async function (this: WebWorld, page: number, size: number) {
    await asked(
      this,
      pathOf({ page: String(page), pageSize: String(size) }),
      withThatKey(this),
    );
  },
);

When(
  "the archived tournaments are asked for page {string} with that key",
  async function (this: WebWorld, page: string) {
    await asked(this, pathOf({ page }), withThatKey(this));
  },
);

// With the mark of the first full answer, since a 304 repeats none.
When(
  "the archived tournaments are asked again with that key and the mark it gave",
  async function (this: WebWorld) {
    const scene = sceneOf(this);
    const earlier = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await asked(this, pathOf(), {
      ...withThatKey(this),
      "if-none-match": mark,
    });
  },
);

// Each as it was made, whatever it is called now: the scenarios that make
// many care about none of them.
Given("every tournament has been archived", async function (this: WebWorld) {
  for (const name of [...this.tournaments.keys()]) {
    const answer = await call("POST", "/tournaments/archive", {
      manager: "organiser@example.com",
      id: tournamentIdOf(this, name),
    });
    assert.equal(answer.status, 200, "The site would not archive it.");
  }
});

Given(
  "{string} has restored the tournament {string}",
  async function (this: WebWorld, manager: string, name: string) {
    const answer = await call("POST", "/tournaments/restore", {
      manager,
      id: tournamentIdOf(this, name),
    });
    assert.equal(answer.status, 200, "The site would not restore it.");
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

const named = (world: WebWorld, name: string): Listed => {
  const id = tournamentIdOf(world, name);
  const found = listed(world).find((each) => each["tournamentId"] === id);
  assert.ok(found !== undefined, `${name} was not listed.`);
  return found;
};

Then(
  /^the archived tournaments are ("[^"]+"(?: and "[^"]+")*)$/,
  function (this: WebWorld, names: string) {
    const wanted = [...names.matchAll(/"([^"]+)"/g)].map((each) =>
      tournamentIdOf(this, each[1]!),
    );
    assert.deepEqual(
      listed(this)
        .map((each) => each["tournamentId"])
        .sort(),
      wanted.sort(),
    );
  },
);

Then("no tournaments are listed as archived", function (this: WebWorld) {
  assert.deepEqual(listed(this), []);
});

Then(
  "the page lists {int} archived tournaments",
  function (this: WebWorld, count: number) {
    assert.equal(listed(this).length, count);
  },
);

Then(
  "the archived tournament {string} says its id",
  function (this: WebWorld, name: string) {
    assert.equal(named(this, name)["tournamentId"], tournamentIdOf(this, name));
  },
);

Then(
  "the archived tournament {string} says it was archived at {string}",
  function (this: WebWorld, name: string, moment: string) {
    assert.equal(named(this, name)["archivedAt"], moment);
  },
);

Then(
  "the archived tournament {string} says a mark of itself",
  function (this: WebWorld, name: string) {
    assert.match(String(named(this, name)["etag"]), /^"[^"]+"$/);
  },
);
