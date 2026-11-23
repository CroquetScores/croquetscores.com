import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { gamesOf } from "../../../support/kept.js";
import type { WebWorld } from "../../../support/world.js";
import {
  answeredOf,
  asked,
  bare,
  made,
  manager,
  sceneOf,
  tournamentIdOf,
  within,
} from "./apiScene.js";

// The games of an Advantage competition, as the admin sends and reads them
// (advantageGames.feature): hoops and targets in place of scores.

// The players and games these steps made, by the block and their names, kept
// here rather than on the scene the other steps share.
interface Made {
  /** The players of the tournament, by name, by their ids in it. */
  readonly players: Map<string, string>;
  /** A player entered in a block, by block and name, by their id in it. */
  readonly entered: Map<string, string>;
  /** A game, by block, winner and loser, by its id. */
  readonly games: Map<string, string>;
}

const mades = new WeakMap<WebWorld, Made>();

const madeOf = (world: WebWorld): Made => {
  let found = mades.get(world);
  if (found === undefined) {
    found = { players: new Map(), entered: new Map(), games: new Map() };
    mades.set(world, found);
  }
  return found;
};

const blockOf = (world: WebWorld, name: string): string => {
  const scene = sceneOf(world);
  const found = scene.competitions.get(within(scene.usual, name));
  assert.ok(found !== undefined, `The tournament has no block ${name}.`);
  return found;
};

const enteredIn = (world: WebWorld, block: string, player: string): string => {
  const found = madeOf(world).entered.get(within(block, player));
  assert.ok(found !== undefined, `${player} was not entered in ${block}.`);
  return found;
};

Given(
  "the players {string} and {string} have been entered in {string}",
  async function (
    this: WebWorld,
    first: string,
    second: string,
    block: string,
  ) {
    const scene = sceneOf(this);
    const tournament = tournamentIdOf(this, scene.usual);
    const made_ = madeOf(this);
    for (const name of [first, second]) {
      // A player is added to the tournament once and entered in each block.
      let id = made_.players.get(name);
      if (id === undefined) {
        id = await made("add the player", "/tournaments/players", {
          manager,
          tournament,
          player: { name },
        });
        made_.players.set(name, id);
      }
      made_.entered.set(
        within(block, name),
        await made("enter the player", "/competitions/players", {
          manager,
          tournament,
          competition: blockOf(this, block),
          player: id,
        }),
      );
    }
  },
);

// A side is said as the hoops it made "of" its target, a number said as it was
// typed so that one that is not whole reaches the scoring fraction to be
// refused there.
const SIDE = String.raw`(\S+) of (\S+)`;
const SIDES = String.raw`${SIDE} to ${SIDE}`;
const GAME = String.raw`"([^"]*)" beating "([^"]*)"`;

// As they were typed, with a "w" where the side is declared the winner.
const hoopsAndTargets = (
  winnerHoops: string,
  winnerTarget: string,
  loserHoops: string,
  loserTarget: string,
): Record<string, string> => ({
  winnerHoops,
  winnerTarget,
  loserHoops,
  loserTarget,
});

Given(
  new RegExp(`^the game of ${GAME} ${SIDES} has been added to "([^"]*)"$`),
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    winnerHoops: string,
    winnerTarget: string,
    loserHoops: string,
    loserTarget: string,
    block: string,
  ) {
    const scene = sceneOf(this);
    const id = await made("add the game", "/competitions/games", {
      manager,
      tournament: tournamentIdOf(this, scene.usual),
      competition: blockOf(this, block),
      winner: enteredIn(this, block, winner),
      loser: enteredIn(this, block, loser),
      ...hoopsAndTargets(winnerHoops, winnerTarget, loserHoops, loserTarget),
    });
    madeOf(this).games.set(within(block, `${winner}>${loser}`), id);
  },
);

const gamesAt = (world: WebWorld, block: string): string => {
  const scene = sceneOf(world);
  return `/tournaments/${scene.tournaments.get(scene.usual)!}/competitions/${bare(blockOf(world, block), "competition")}/games`;
};

// Adding and correcting a game have moved to /api/v0, while listing the games
// is still at /api/site, so the two are asked at different addresses.
const gamesWrittenAt = (world: WebWorld, block: string): string =>
  `/api/v0${gamesAt(world, block)}`;

// A game's players are named in the request by the part of their id in the
// competition after its kind (`gamePlayerOf`).
const playersOf = (
  world: WebWorld,
  block: string,
  winner: string,
  loser: string,
): Record<string, string> => ({
  winner: bare(enteredIn(world, block, winner), "competition-player"),
  loser: bare(enteredIn(world, block, loser), "competition-player"),
});

When(
  new RegExp(
    `^a request as "([^"]*)" adds the game of ${GAME} ${SIDES} in "([^"]*)"( without the winner's hoops)?$`,
  ),
  async function (
    this: WebWorld,
    host: string,
    winner: string,
    loser: string,
    winnerHoops: string,
    winnerTarget: string,
    loserHoops: string,
    loserTarget: string,
    block: string,
    without: string | null,
  ) {
    const said = hoopsAndTargets(
      winnerHoops,
      winnerTarget,
      loserHoops,
      loserTarget,
    );
    // A part not sent is one the request leaves out.
    if (without !== null) delete said["winnerHoops"];
    await asked(this, host, "POST", gamesWrittenAt(this, block), {
      ...playersOf(this, block, winner, loser),
      ...said,
    });
  },
);

// A score typed as points, which a competition that is not Advantage takes.
When(
  new RegExp(
    `^a request as "([^"]*)" adds the game of ${GAME} typing (\\S+) to (\\S+) in "([^"]*)"$`,
  ),
  async function (
    this: WebWorld,
    host: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    block: string,
  ) {
    await asked(this, host, "POST", gamesWrittenAt(this, block), {
      ...playersOf(this, block, winner, loser),
      winnerScore,
      loserScore,
    });
  },
);

When(
  new RegExp(
    `^a request as "([^"]*)" corrects the game of ${GAME} in "([^"]*)" to ${SIDES}$`,
  ),
  async function (
    this: WebWorld,
    host: string,
    winner: string,
    loser: string,
    block: string,
    winnerHoops: string,
    winnerTarget: string,
    loserHoops: string,
    loserTarget: string,
  ) {
    const game = madeOf(this).games.get(within(block, `${winner}>${loser}`));
    assert.ok(game !== undefined, `No game of ${winner} beating ${loser}.`);
    await asked(
      this,
      host,
      "POST",
      `${gamesWrittenAt(this, block)}/${bare(game, "game")}/correct`,
      hoopsAndTargets(winnerHoops, winnerTarget, loserHoops, loserTarget),
    );
  },
);

When(
  /^a request as "([^"]*)" lists the games of "([^"]*)"$/,
  async function (this: WebWorld, host: string, block: string) {
    await asked(this, host, "GET", gamesAt(this, block));
  },
);

// What the competition holds, as the site says it and not as an answer did,
// since a refused request is meant to have kept nothing.
Then(
  new RegExp(
    `^the competition "([^"]*)" holds the score of ${GAME} kept as "([^"]*)" to "([^"]*)"$`,
  ),
  async function (
    this: WebWorld,
    block: string,
    winner: string,
    loser: string,
    winnerWritten: string,
    loserWritten: string,
  ) {
    const games = await gamesOf(blockOf(this, block));
    const winnerId = enteredIn(this, block, winner);
    const loserId = enteredIn(this, block, loser);
    assert.ok(
      games.some(
        (game) =>
          game.winner === winnerId &&
          game.loser === loserId &&
          game.winnerWritten === winnerWritten &&
          game.loserWritten === loserWritten,
      ),
      `${block} holds ${JSON.stringify(games.map((game) => `${game.winnerWritten} to ${game.loserWritten}`))}.`,
    );
  },
);

Then(
  /^the competition "([^"]*)" holds no scores$/,
  async function (this: WebWorld, block: string) {
    assert.deepEqual(await gamesOf(blockOf(this, block)), []);
  },
);

interface Listed {
  readonly winnerWon?: boolean;
  readonly winnerScore: string;
  readonly loserScore: string;
  readonly winnerHoops?: number;
  readonly winnerTarget?: number;
  readonly loserHoops?: number;
  readonly loserTarget?: number;
}

const firstListed = (world: WebWorld): Listed => {
  const { status, body } = answeredOf(world);
  assert.equal(status, 200, JSON.stringify(body));
  const [first] = (body as { games: Listed[] }).games;
  assert.ok(first !== undefined, "The list has no games.");
  return first;
};

Then(
  /^the list says the first game is kept as "([^"]*)" to "([^"]*)"$/,
  function (this: WebWorld, winnerScore: string, loserScore: string) {
    const first = firstListed(this);
    assert.equal(first.winnerScore, winnerScore);
    assert.equal(first.loserScore, loserScore);
  },
);

Then(
  "the list says the first game had its winner declared",
  function (this: WebWorld) {
    assert.equal(firstListed(this).winnerWon, true);
  },
);

Then(
  new RegExp(`^the list says the first game was entered as ${SIDES}$`),
  function (
    this: WebWorld,
    winnerHoops: string,
    winnerTarget: string,
    loserHoops: string,
    loserTarget: string,
  ) {
    const first = firstListed(this);
    assert.deepEqual(
      [
        first.winnerHoops,
        first.winnerTarget,
        first.loserHoops,
        first.loserTarget,
      ],
      [
        Number(winnerHoops),
        Number(winnerTarget),
        Number(loserHoops),
        Number(loserTarget),
      ],
    );
  },
);
