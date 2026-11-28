// The public API's list of an association croquet world ranking player's games
// (worldRankingPlayerGames.feature), asked as an app asks: plain requests, with
// the key as a bearer token when it has one. What the answers about a page, a
// mark and a date say is read by the steps the tournaments' list already has
// (tournaments.steps.ts), and "no games are listed" is the competition's
// (competition.steps.ts), which reads the same field of an answer.
import { Given, Then, When } from "@cucumber/cucumber";
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
  return `/api/v1/ac/world-ranking-players/${bare(id)}/games${asks === "" ? "" : `?${asks}`}`;
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
  "the games of the world ranking player {string} are asked with that key",
  async function (this: WebWorld, player: string) {
    await askedOf(this, player, {}, withThatKey(this));
  },
);

When(
  "the games of the world ranking player {string} are asked with no key",
  async function (this: WebWorld, player: string) {
    await askedOf(this, player, {}, {});
  },
);

When(
  "the games of the world ranking player {string} are asked with the key {string}",
  async function (this: WebWorld, player: string, key: string) {
    await askedOf(this, player, {}, bearer(key));
  },
);

When(
  "the games of the world ranking player with the id {string} are asked with that key",
  async function (this: WebWorld, id: string) {
    await asked(this, gamesPath(id), withThatKey(this));
  },
);

When(
  "the games of the world ranking player {string} are asked with that key and a page size of {int}",
  async function (this: WebWorld, player: string, size: number) {
    await askedOf(this, player, { pageSize: String(size) }, withThatKey(this));
  },
);

When(
  "the games of the world ranking player {string} are asked with that key and a page size of {string}",
  async function (this: WebWorld, player: string, size: string) {
    await askedOf(this, player, { pageSize: size }, withThatKey(this));
  },
);

When(
  "the games of the world ranking player {string} are asked for page {int} with that key and a page size of {int}",
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
  "the games of the world ranking player {string} are asked for page {string} with that key",
  async function (this: WebWorld, player: string, page: string) {
    await askedOf(this, player, { page }, withThatKey(this));
  },
);

When(
  "the games of the world ranking player {string} are asked with that key changed since {string}",
  async function (this: WebWorld, player: string, moment: string) {
    await askedOf(this, player, { changedSince: moment }, withThatKey(this));
  },
);

// With the mark of the first full answer, since a 304 repeats none, so a
// scenario that asks again more than once asks about the same thing.
When(
  "the games of the world ranking player {string} are asked again with that key and the mark it gave",
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

type Said = Record<string, unknown>;

const listed = (world: WebWorld): readonly Said[] => {
  const { games } = answered(world).body;
  assert.ok(Array.isArray(games), "The API listed no games.");
  return games as Said[];
};

const places = ["first", "second", "third"] as const;

const gameAt = (world: WebWorld, place: (typeof places)[number]): Said => {
  const found = listed(world)[places.indexOf(place)];
  assert.ok(found !== undefined, `No ${place} game was listed.`);
  return found;
};

// The one game a scenario that says "the game" is about.
const onlyGame = (world: WebWorld): Said => {
  assert.equal(listed(world).length, 1, "Not exactly one game was listed.");
  return gameAt(world, "first");
};

Then("one game is listed", function (this: WebWorld) {
  assert.equal(listed(this).length, 1);
});

Then(
  "the API says there is {int} game in all",
  function (this: WebWorld, total: number) {
    assert.equal(answered(this).body["total"], total);
  },
);

Then("the page lists {int} games", function (this: WebWorld, count: number) {
  assert.equal(listed(this).length, count);
});

Then(
  "the API says there are {int} games in all",
  function (this: WebWorld, total: number) {
    assert.equal(answered(this).body["total"], total);
  },
);

Then("the game says its id", function (this: WebWorld) {
  const id = onlyGame(this)["id"];
  assert.ok(
    typeof id === "string" && [...this.games.values()].includes(id),
    "The game's id was not one a game was added with.",
  );
});

Then(
  "the game says the id of {string}",
  function (this: WebWorld, name: string) {
    const game = onlyGame(this);
    const tournament = this.tournaments.get(name);
    if (tournament !== undefined) {
      assert.equal(game["tournamentId"], tournament.id);
      return;
    }
    const competitions = [...this.competitions.entries()].filter(
      ([key]) => key.split("\u0000")[1] === name,
    );
    assert.equal(competitions.length, 1, `No competition called ${name}.`);
    assert.equal(game["competitionId"], competitions[0]![1]);
  },
);

Then("the game says the player won", function (this: WebWorld) {
  assert.equal(onlyGame(this)["won"], true);
});

Then("the game says the player did not win", function (this: WebWorld) {
  assert.equal(onlyGame(this)["won"], false);
});

Then("the first game says the player won", function (this: WebWorld) {
  assert.equal(gameAt(this, "first")["won"], true);
});

Then("the second game says the player did not win", function (this: WebWorld) {
  assert.equal(gameAt(this, "second")["won"], false);
});

Then(
  "the game says the player scored {string}",
  function (this: WebWorld, score: string) {
    assert.equal(onlyGame(this)["score"], score);
  },
);

Then(
  "the game says the opponent scored {string}",
  function (this: WebWorld, score: string) {
    assert.equal(onlyGame(this)["opponentScore"], score);
  },
);

Then(
  "the game says the id of the world ranking player {string} as the opponent",
  function (this: WebWorld, name: string) {
    assert.equal(onlyGame(this)["opponentId"], idOf(this, name));
  },
);

Then(
  "the game says the opponent is not a world ranking player",
  function (this: WebWorld) {
    assert.equal(onlyGame(this)["opponentId"], null);
  },
);

Then(
  "the game says the opponent is called {string}",
  function (this: WebWorld, name: string) {
    assert.equal(onlyGame(this)["opponentName"], name);
  },
);

for (const [said, field, value] of [
  ["was not drawn", "drawn", false],
  ["was drawn", "drawn", true],
  ["was not archived", "archived", false],
  ["was archived", "archived", true],
  ["was not withdrawn", "withdrawn", false],
  ["was withdrawn", "withdrawn", true],
] as const) {
  Then(`the game says it ${said}`, function (this: WebWorld) {
    assert.equal(onlyGame(this)[field], value);
  });
}

Then(
  "the game says it was added at {string}",
  function (this: WebWorld, moment: string) {
    assert.equal(onlyGame(this)["addedAt"], moment);
  },
);

Then(
  "the game says it last changed at {string}",
  function (this: WebWorld, moment: string) {
    assert.equal(onlyGame(this)["changedAt"], moment);
  },
);

// Which competition a listed game is in, by the name the scenario gave it.
const inCompetition = (
  world: WebWorld,
  place: (typeof places)[number],
  name: string,
): void => {
  const found = [...world.competitions.entries()].filter(
    ([key]) => key.split("\u0000")[1] === name,
  );
  assert.equal(found.length, 1, `No competition called ${name}.`);
  assert.equal(gameAt(world, place)["competitionId"], found[0]![1]);
};

Then(
  /^the (first|second|third) game listed is in "([^"]*)"$/,
  function (this: WebWorld, place: (typeof places)[number], name: string) {
    inCompetition(this, place, name);
  },
);

const marksKept = new WeakMap<WebWorld, unknown>();

Given("the mark of the first game is kept", function (this: WebWorld) {
  marksKept.set(this, gameAt(this, "first")["etag"]);
});

Then("the first game says the mark it said before", function (this: WebWorld) {
  assert.equal(gameAt(this, "first")["etag"], marksKept.get(this));
});

Then(
  "the first game says another mark than it said before",
  function (this: WebWorld) {
    const before = marksKept.get(this);
    assert.ok(before !== undefined, "No mark was kept.");
    assert.notEqual(gameAt(this, "first")["etag"], before);
  },
);
