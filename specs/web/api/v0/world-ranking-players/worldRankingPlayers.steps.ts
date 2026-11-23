// The public API's list of the association croquet world ranking players
// (worldRankingPlayers.feature), asked as an app asks: plain requests, with
// the key as a bearer token when it has one. What the answers about a page, a
// mark and a date say is read by the steps the tournaments' list already has
// (tournaments.steps.ts), which are not about tournaments in how they read.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";
import {
  answered,
  asked,
  bearer,
  keyMade,
  sceneOf,
  type Answer,
} from "../apiOfApps.js";

const listPath = (more: Record<string, string> = {}): string => {
  const asks = new URLSearchParams(more).toString();
  return `/api/v0/ac/world-ranking-players${asks === "" ? "" : `?${asks}`}`;
};

const withThatKey = (world: WebWorld): Record<string, string> =>
  bearer(keyMade(world));

When(
  "the world ranking players are asked with that key",
  async function (this: WebWorld) {
    sceneOf(this).earlier = undefined;
    await asked(this, listPath(), withThatKey(this));
  },
);

When(
  "the world ranking players are asked with no key",
  async function (this: WebWorld) {
    await asked(this, listPath(), {});
  },
);

When(
  "the world ranking players are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await asked(this, listPath(), bearer(key));
  },
);

When(
  "the world ranking players are asked with that key and a page size of {int}",
  async function (this: WebWorld, size: number) {
    await asked(this, listPath({ pageSize: String(size) }), withThatKey(this));
  },
);

When(
  "the world ranking players are asked with that key and a page size of {string}",
  async function (this: WebWorld, size: string) {
    await asked(this, listPath({ pageSize: size }), withThatKey(this));
  },
);

When(
  "the world ranking players are asked for page {int} with that key and a page size of {int}",
  async function (this: WebWorld, page: number, size: number) {
    await asked(
      this,
      listPath({ page: String(page), pageSize: String(size) }),
      withThatKey(this),
    );
  },
);

When(
  "the world ranking players are asked for page {string} with that key",
  async function (this: WebWorld, page: string) {
    await asked(this, listPath({ page }), withThatKey(this));
  },
);

When(
  "the world ranking players are asked with that key changed since {string}",
  async function (this: WebWorld, moment: string) {
    await asked(this, listPath({ changedSince: moment }), withThatKey(this));
  },
);

// With the mark of the first full answer, since a 304 repeats none, so a
// scenario that asks again more than once asks about the same thing.
When(
  "the world ranking players are asked again with that key and the mark it gave",
  async function (this: WebWorld) {
    const scene = sceneOf(this);
    const earlier: Answer = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await asked(this, listPath(), {
      ...withThatKey(this),
      "if-none-match": mark,
    });
  },
);

// What the scenario said is there, which the site's test control puts in the
// world rankings' table as an import would have left it. The id the site gave
// each is kept by name, since it is the site's and the scenario cannot say it.
const idsMade = new WeakMap<WebWorld, Map<string, string>>();

const idOf = (world: WebWorld, name: string): string => {
  const id = idsMade.get(world)?.get(name);
  assert.ok(id !== undefined, `No world ranking player ${name} was made.`);
  return id;
};

const made = async (
  world: WebWorld,
  name: string,
  worldRankingId: number,
): Promise<void> => {
  const answer = await call("POST", "/world-ranking-players", {
    sport: "ac",
    name,
    worldRankingId,
  });
  const text = await answer.text();
  assert.equal(answer.status, 201, text);
  const { id } = JSON.parse(text) as { id: string };
  const ids = idsMade.get(world) ?? new Map<string, string>();
  ids.set(name, id);
  idsMade.set(world, ids);
};

Given(
  "the world ranking player {string} with the world ranking number {int}",
  async function (this: WebWorld, name: string, number: number) {
    await made(this, name, number);
  },
);

Given(
  "the golf croquet world ranking player {string}",
  async function (this: WebWorld, name: string) {
    const answer = await call("POST", "/world-ranking-players", {
      sport: "gc",
      name,
    });
    assert.equal(answer.status, 201, await answer.text());
  },
);

Given(
  "{int} world ranking players",
  async function (this: WebWorld, count: number) {
    for (let each = 1; each <= count; each++) {
      await made(this, `Player ${String(each)}`, each);
    }
  },
);

Given(
  "the world ranking player {string} is archived",
  async function (this: WebWorld, name: string) {
    const answer = await call("POST", "/world-ranking-players/archive", {
      name,
    });
    assert.equal(answer.status, 200, await answer.text());
  },
);

Given(
  "the rankings give the world ranking player {string} the number {int}",
  async function (this: WebWorld, name: string, number: number) {
    const answer = await call("POST", "/world-ranking-players/renumber", {
      name,
      worldRankingId: number,
    });
    assert.equal(answer.status, 200, await answer.text());
  },
);

interface Listed {
  readonly [field: string]: unknown;
}

const listed = (world: WebWorld): readonly Listed[] => {
  const { worldRankingPlayers } = answered(world).body;
  assert.ok(
    Array.isArray(worldRankingPlayers),
    "The API listed no world ranking players.",
  );
  return worldRankingPlayers as Listed[];
};

const namedInList = (world: WebWorld, name: string): Listed => {
  const found = listed(world).find((each) => each["name"] === name);
  assert.ok(found !== undefined, `${name} was not listed.`);
  return found;
};

Then(
  /^the world ranking players listed are (.+)$/,
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

Then("no world ranking players are listed", function (this: WebWorld) {
  assert.deepEqual(listed(this), []);
});

Then(
  "the page lists {int} world ranking players",
  function (this: WebWorld, count: number) {
    assert.equal(listed(this).length, count);
  },
);

Then(
  "the API says there are {int} world ranking players in all",
  function (this: WebWorld, total: number) {
    assert.equal(answered(this).body["total"], total);
  },
);

const places = ["first", "second", "third"] as const;

Then(
  /^the (first|second|third) world ranking player listed is "([^"]*)"$/,
  function (this: WebWorld, place: (typeof places)[number], name: string) {
    assert.equal(listed(this)[places.indexOf(place)]?.["name"], name);
  },
);

Then(
  "the world ranking player {string} says its id",
  function (this: WebWorld, name: string) {
    assert.equal(namedInList(this, name)["id"], idOf(this, name));
  },
);

Then(
  "the world ranking player {string} says its world ranking number is {int}",
  function (this: WebWorld, name: string, number: number) {
    assert.equal(namedInList(this, name)["worldRankingId"], number);
  },
);

// Where the games are told of is the player's id without its kind, as a
// tournament's address is, so that the id is one segment of an address.
Then(
  "the world ranking player {string} says where the API tells of its games",
  function (this: WebWorld, name: string) {
    assert.equal(
      namedInList(this, name)["games"],
      `/api/v0/ac/world-ranking-players/${idOf(this, name).replace(/^ac-world-ranking-id\//, "")}/games`,
    );
  },
);

Then(
  "the world ranking player {string} says it is not archived",
  function (this: WebWorld, name: string) {
    assert.equal(namedInList(this, name)["archivedAt"], null);
  },
);

Then(
  "the world ranking player {string} says it was archived at {string}",
  function (this: WebWorld, name: string, moment: string) {
    assert.equal(namedInList(this, name)["archivedAt"], moment);
  },
);

Then(
  "the world ranking player {string} says it last changed at {string}",
  function (this: WebWorld, name: string, moment: string) {
    assert.equal(namedInList(this, name)["changedAt"], moment);
  },
);

const marksKept = new WeakMap<WebWorld, Map<string, unknown>>();
const idsKept = new WeakMap<WebWorld, Map<string, unknown>>();

const keep = (
  kept: WeakMap<WebWorld, Map<string, unknown>>,
  world: WebWorld,
  name: string,
  value: unknown,
): void => {
  const each = kept.get(world) ?? new Map<string, unknown>();
  each.set(name, value);
  kept.set(world, each);
};

Then(
  "the world ranking player {string} says a mark of itself",
  function (this: WebWorld, name: string) {
    assert.match(String(namedInList(this, name)["etag"]), /^"[^"]+"$/);
  },
);

Given(
  "the mark of the world ranking player {string} is kept",
  function (this: WebWorld, name: string) {
    keep(marksKept, this, name, namedInList(this, name)["etag"]);
  },
);

Then(
  "the world ranking player {string} says the mark it said before",
  function (this: WebWorld, name: string) {
    assert.equal(
      namedInList(this, name)["etag"],
      marksKept.get(this)?.get(name),
    );
  },
);

Then(
  "the world ranking player {string} says another mark than it said before",
  function (this: WebWorld, name: string) {
    const before = marksKept.get(this)?.get(name);
    assert.ok(before !== undefined, "No mark was kept.");
    assert.notEqual(namedInList(this, name)["etag"], before);
  },
);

Given(
  "the id of the world ranking player {string} is kept",
  function (this: WebWorld, name: string) {
    keep(idsKept, this, name, namedInList(this, name)["id"]);
  },
);

Then(
  "the world ranking player {string} says the id it said before",
  function (this: WebWorld, name: string) {
    assert.equal(namedInList(this, name)["id"], idsKept.get(this)?.get(name));
  },
);
