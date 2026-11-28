// The public API's list of a golf croquet world ranking player's games
// (worldRankingPlayerGames.feature), asked as an app asks: plain requests,
// with the key as a bearer token when it has one. What an answer says of a
// game, a page, a mark and a date is read by the steps the association croquet
// list of games already has (ac/world-ranking-player-games), which read the
// same fields of an answer, so only what asks for golf croquet's games and
// what names a golf croquet player is written here.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../../support/world.js";
import {
  answered,
  asked,
  bearer,
  keyMade,
  sceneOf,
  type Answer,
} from "../../apiOfApps.js";
import { idOf } from "../world-ranking-players/worldRankingPlayers.steps.js";

const bare = (id: string): string => id.slice(id.indexOf("/") + 1);

const gamesPath = (id: string, more: Record<string, string> = {}): string => {
  const asks = new URLSearchParams(more).toString();
  return `/api/v1/gc/world-ranking-players/${bare(id)}/games${asks === "" ? "" : `?${asks}`}`;
};

const withThatKey = (world: WebWorld): Record<string, string> =>
  bearer(keyMade(world));

const askedOf = async (
  world: WebWorld,
  player: string,
  more: Record<string, string>,
  headers: Record<string, string>,
): Promise<void> => {
  sceneOf(world).earlier = undefined;
  await asked(world, gamesPath(idOf(world, player), more), headers);
};

When(
  "the games of the golf croquet world ranking player {string} are asked with that key",
  async function (this: WebWorld, player: string) {
    await askedOf(this, player, {}, withThatKey(this));
  },
);

When(
  "the games of the golf croquet world ranking player {string} from {string} are asked with that key",
  async function (this: WebWorld, player: string, country: string) {
    await askedOf(this, `${player} from ${country}`, {}, withThatKey(this));
  },
);

When(
  "the games of the golf croquet world ranking player {string} are asked with no key",
  async function (this: WebWorld, player: string) {
    await askedOf(this, player, {}, {});
  },
);

When(
  "the games of the golf croquet world ranking player {string} are asked with the key {string}",
  async function (this: WebWorld, player: string, key: string) {
    await askedOf(this, player, {}, bearer(key));
  },
);

When(
  "the games of the golf croquet world ranking player with the id {string} are asked with that key",
  async function (this: WebWorld, id: string) {
    await asked(this, gamesPath(id), withThatKey(this));
  },
);

When(
  "the games of the golf croquet world ranking player {string} are asked with that key and a page size of {int}",
  async function (this: WebWorld, player: string, size: number) {
    await askedOf(this, player, { pageSize: String(size) }, withThatKey(this));
  },
);

When(
  "the games of the golf croquet world ranking player {string} are asked with that key and a page size of {string}",
  async function (this: WebWorld, player: string, size: string) {
    await askedOf(this, player, { pageSize: size }, withThatKey(this));
  },
);

When(
  "the games of the golf croquet world ranking player {string} are asked for page {int} with that key and a page size of {int}",
  async function (this: WebWorld, player: string, page: number, size: number) {
    await askedOf(
      this,
      player,
      { page: String(page), pageSize: String(size) },
      withThatKey(this),
    );
  },
);

When(
  "the games of the golf croquet world ranking player {string} are asked for page {string} with that key",
  async function (this: WebWorld, player: string, page: string) {
    await askedOf(this, player, { page }, withThatKey(this));
  },
);

When(
  "the games of the golf croquet world ranking player {string} are asked with that key changed since {string}",
  async function (this: WebWorld, player: string, moment: string) {
    await askedOf(this, player, { changedSince: moment }, withThatKey(this));
  },
);

// With the mark of the first full answer, since a 304 repeats none, so a
// scenario that asks again more than once asks about the same thing.
When(
  "the games of the golf croquet world ranking player {string} are asked again with that key and the mark it gave",
  async function (this: WebWorld, player: string) {
    const scene = sceneOf(this);
    const earlier: Answer = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await asked(this, gamesPath(idOf(this, player)), {
      ...withThatKey(this),
      "if-none-match": mark,
    });
  },
);

Then(
  "the game says the id of the golf croquet world ranking player {string} as the opponent",
  function (this: WebWorld, name: string) {
    const { games } = answered(this).body;
    assert.ok(Array.isArray(games), "The API listed no games.");
    assert.equal(games.length, 1, "Not exactly one game was listed.");
    assert.equal(
      (games[0] as Record<string, unknown>)["opponentId"],
      idOf(this, name),
    );
  },
);
