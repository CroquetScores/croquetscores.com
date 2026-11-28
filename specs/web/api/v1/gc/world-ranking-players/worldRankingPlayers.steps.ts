// The public API's list of the golf croquet world ranking players
// (worldRankingPlayers.feature), asked as an app asks: plain requests, with
// the key as a bearer token when it has one. What the answers about a page, a
// mark and a date say is read by the steps the tournaments' list already has
// (tournaments.steps.ts), which are not about tournaments in how they read.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call } from "../../../../support/control.js";
import type { WebWorld } from "../../../../support/world.js";
import {
  answered,
  asked,
  bearer,
  keyMade,
  sceneOf,
  type Answer,
} from "../../apiOfApps.js";

const listPath = (more: Record<string, string> = {}): string => {
  const asks = new URLSearchParams(more).toString();
  return `/api/v1/gc/world-ranking-players${asks === "" ? "" : `?${asks}`}`;
};

const withThatKey = (world: WebWorld): Record<string, string> =>
  bearer(keyMade(world));

When(
  "the golf croquet world ranking players are asked with that key",
  async function (this: WebWorld) {
    sceneOf(this).earlier = undefined;
    await asked(this, listPath(), withThatKey(this));
  },
);

// Asked for as a browser or a cache asks to see what an answer would be,
// which is a HEAD and says nothing but its headers.
When(
  "the head of the golf croquet world ranking players is asked for with that key",
  async function (this: WebWorld) {
    const answer = await fetch(`${this.baseUrl!}${listPath()}`, {
      method: "HEAD",
      headers: withThatKey(this),
    });
    assert.equal(answer.status, 200);
  },
);

When(
  "the golf croquet world ranking players are asked for page {int} with that key",
  async function (this: WebWorld, page: number) {
    sceneOf(this).earlier = undefined;
    await asked(this, listPath({ page: String(page) }), withThatKey(this));
  },
);

When(
  "the golf croquet world ranking players are asked for page {int} with no key",
  async function (this: WebWorld, page: number) {
    await asked(this, listPath({ page: String(page) }), {});
  },
);

When(
  "the golf croquet world ranking players are asked with the key {string}",
  async function (this: WebWorld, key: string) {
    await asked(this, listPath(), bearer(key));
  },
);

When(
  "the golf croquet world ranking players are asked for page {int} with that key and a page size of {int}",
  async function (this: WebWorld, page: number, size: number) {
    await asked(
      this,
      listPath({ page: String(page), pageSize: String(size) }),
      withThatKey(this),
    );
  },
);

When(
  "the golf croquet world ranking players are asked for page {int} with that key and a page size of {string}",
  async function (this: WebWorld, page: number, size: string) {
    await asked(
      this,
      listPath({ page: String(page), pageSize: size }),
      withThatKey(this),
    );
  },
);

When(
  "the golf croquet world ranking players are asked for page {string} with that key",
  async function (this: WebWorld, page: string) {
    await asked(this, listPath({ page }), withThatKey(this));
  },
);

When(
  "the golf croquet world ranking players are asked for page {int} with that key changed since {string}",
  async function (this: WebWorld, page: number, moment: string) {
    await asked(
      this,
      listPath({ page: String(page), changedSince: moment }),
      withThatKey(this),
    );
  },
);

// With the mark of the first full answer, since a 304 repeats none, so a
// scenario that asks again more than once asks about the same thing.
When(
  "the golf croquet world ranking players are asked again for page {int} with that key and the mark it gave",
  async function (this: WebWorld, page: number) {
    const scene = sceneOf(this);
    const earlier: Answer = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await asked(this, listPath({ page: String(page) }), {
      ...withThatKey(this),
      "if-none-match": mark,
    });
  },
);

// What the scenario said is there, which the site's test control puts in the
// world rankings' table as an import would have left it. The id the site gave
// each is kept by name, since it is the site's and the scenario cannot say it.
const idsMade = new WeakMap<WebWorld, Map<string, string>>();

export const idOf = (world: WebWorld, name: string): string => {
  const id = idsMade.get(world)?.get(name);
  assert.ok(
    id !== undefined,
    `No golf croquet world ranking player ${name} was made.`,
  );
  return id;
};

const made = async (
  world: WebWorld,
  name: string,
  worldRankingId: number,
  country?: string,
): Promise<void> => {
  const answer = await call("POST", "/world-ranking-players", {
    sport: "gc",
    name,
    worldRankingId,
    ...(country ? { country } : {}),
  });
  const text = await answer.text();
  assert.equal(answer.status, 201, text);
  const { id } = JSON.parse(text) as { id: string };
  const ids = idsMade.get(world) ?? new Map<string, string>();
  ids.set(name, id);
  idsMade.set(world, ids);
};

// From England unless the scenario says, which is where most of the list is
// from and which a scenario that does not mind says nothing of.
Given(
  /^the golf croquet world ranking player "([^"]*)" with the world ranking number (\d+)(?: from "([^"]*)")?$/,
  async function (
    this: WebWorld,
    name: string,
    number: string,
    country: string | undefined,
  ) {
    await made(this, name, Number(number), country);
  },
);

Given(
  "{int} golf croquet world ranking players",
  async function (this: WebWorld, count: number) {
    for (let each = 1; each <= count; each++) {
      await made(this, `Player ${String(each)}`, each);
    }
  },
);

Given(
  "the golf croquet world ranking player {string} is archived",
  async function (this: WebWorld, name: string) {
    const answer = await call("POST", "/world-ranking-players/archive", {
      sport: "gc",
      name,
    });
    assert.equal(answer.status, 200, await answer.text());
  },
);

Given(
  "the rankings give the golf croquet world ranking player {string} the number {int}",
  async function (this: WebWorld, name: string, number: number) {
    const answer = await call("POST", "/world-ranking-players/renumber", {
      sport: "gc",
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
    "The API listed no golf croquet world ranking players.",
  );
  return worldRankingPlayers as Listed[];
};

const namedInList = (world: WebWorld, name: string): Listed => {
  const found = listed(world).find((each) => each["name"] === name);
  assert.ok(found !== undefined, `${name} was not listed.`);
  return found;
};

Then(
  /^the golf croquet world ranking players listed are (.+)$/,
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

Then(
  "no golf croquet world ranking players are listed",
  function (this: WebWorld) {
    assert.deepEqual(listed(this), []);
  },
);

Then(
  "the page lists {int} golf croquet world ranking players",
  function (this: WebWorld, count: number) {
    assert.equal(listed(this).length, count);
  },
);

Then(
  "the API says there are {int} golf croquet world ranking players in all",
  function (this: WebWorld, total: number) {
    assert.equal(answered(this).body["total"], total);
  },
);

const places = ["first", "second", "third"] as const;

Then(
  /^the (first|second|third) golf croquet world ranking player listed is "([^"]*)"$/,
  function (this: WebWorld, place: (typeof places)[number], name: string) {
    assert.equal(listed(this)[places.indexOf(place)]?.["name"], name);
  },
);

Then(
  "the golf croquet world ranking player {string} says its id",
  function (this: WebWorld, name: string) {
    assert.equal(namedInList(this, name)["id"], idOf(this, name));
  },
);

// Where the games are told of is the player's id without its kind, as a
// tournament's address is, so that the id is one segment of an address.
Then(
  "the golf croquet world ranking player {string} says its country is {string}",
  function (this: WebWorld, name: string, country: string) {
    assert.equal(namedInList(this, name)["country"], country);
  },
);

Then(
  "the golf croquet world ranking player {string} says its world ranking number is {int}",
  function (this: WebWorld, name: string, number: number) {
    assert.equal(namedInList(this, name)["worldRankingId"], number);
  },
);

Then(
  "the golf croquet world ranking player {string} says where the API tells of its games",
  function (this: WebWorld, name: string) {
    assert.equal(
      namedInList(this, name)["games"],
      `/api/v1/gc/world-ranking-players/${idOf(this, name).replace(/^gc-world-ranking-id\//, "")}/games`,
    );
  },
);

Then(
  "the golf croquet world ranking player {string} says it is not archived",
  function (this: WebWorld, name: string) {
    assert.equal(namedInList(this, name)["archivedAt"], null);
  },
);

// Said without the moment where the archiving was done by the site's own
// clock, which keeps running from the moment the scenario set it.
Then(
  "the golf croquet world ranking player {string} says it is archived",
  function (this: WebWorld, name: string) {
    assert.notEqual(namedInList(this, name)["archivedAt"], null);
  },
);

Then(
  "the golf croquet world ranking player {string} says it was archived at {string}",
  function (this: WebWorld, name: string, moment: string) {
    assert.equal(namedInList(this, name)["archivedAt"], moment);
  },
);

Then(
  "the golf croquet world ranking player {string} says it last changed at {string}",
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
  "the golf croquet world ranking player {string} says a mark of itself",
  function (this: WebWorld, name: string) {
    assert.match(String(namedInList(this, name)["etag"]), /^"[^"]+"$/);
  },
);

Given(
  "the mark of the golf croquet world ranking player {string} is kept",
  function (this: WebWorld, name: string) {
    keep(marksKept, this, name, namedInList(this, name)["etag"]);
  },
);

Then(
  "the golf croquet world ranking player {string} says the mark it said before",
  function (this: WebWorld, name: string) {
    assert.equal(
      namedInList(this, name)["etag"],
      marksKept.get(this)?.get(name),
    );
  },
);

Then(
  "the golf croquet world ranking player {string} says another mark than it said before",
  function (this: WebWorld, name: string) {
    const before = marksKept.get(this)?.get(name);
    assert.ok(before !== undefined, "No mark was kept.");
    assert.notEqual(namedInList(this, name)["etag"], before);
  },
);

Given(
  "the id of the golf croquet world ranking player {string} is kept",
  function (this: WebWorld, name: string) {
    keep(idsKept, this, name, namedInList(this, name)["id"]);
  },
);

Then(
  "the golf croquet world ranking player {string} says the id it said before",
  function (this: WebWorld, name: string) {
    assert.equal(namedInList(this, name)["id"], idsKept.get(this)?.get(name));
  },
);
