import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { CarryForwardCount } from "../../../src/domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { SpecWorld } from "../../support/world.js";
import {
  type WrittenCompetitionPlayer,
  competitionKeptFor,
  competitionPlayerCalled,
  competitionPlayerWritten,
  competitionWritten,
  firstGameAddedAt,
  gamesInUse,
  nameOf,
} from "../importingTournaments.js";

// The competition being written -------------------------------------------------

Given(
  "player {int} is in the competition",
  function (this: SpecWorld, number: number) {
    competitionPlayerWritten(this, number);
  },
);

Given(
  "the competition is called {string}",
  function (this: SpecWorld, name: string) {
    competitionWritten(this).Name = name;
  },
);

Given("the competition was archived", function (this: SpecWorld) {
  competitionWritten(this).IsArchived = true;
});

Given("player {int} withdrew", function (this: SpecWorld, number: number) {
  competitionPlayerWritten(this, number).IsWithdrawn = true;
});

// What the old sites called each count, by what the feature calls it.
const OLD_COUNTS: Readonly<
  Record<string, keyof WrittenCompetitionPlayer["CarryForward"]>
> = {
  "match wins": "MatchWins",
  "match losses": "MatchLosses",
  "game wins": "GameWins",
  "game losses": "GameLosses",
  "hoops for": "ForHoops",
  "hoops against": "AgainstHoops",
};

// And what the site calls it.
const COUNTS: Readonly<Record<string, CarryForwardCount>> = {
  "match wins": "matchWins",
  "match losses": "matchLosses",
  "game wins": "gameWins",
  "game losses": "gameLosses",
  "hoops for": "hoopsFor",
  "hoops against": "hoopsAgainst",
};

const A_COUNT =
  "(match wins|match losses|game wins|game losses|hoops for|hoops against)";

Given(
  "player {int} carried forward {int} of each count",
  function (this: SpecWorld, number: number, count: number) {
    const carried = competitionPlayerWritten(this, number).CarryForward;
    for (const field of Object.values(OLD_COUNTS)) carried[field] = count;
  },
);

Given(
  new RegExp(`^player (\\d+) carried forward (\\d+) ${A_COUNT}$`),
  function (this: SpecWorld, number: string, count: string, which: string) {
    const field = OLD_COUNTS[which];
    assert.ok(field !== undefined, `There is no count ${which}.`);
    competitionPlayerWritten(this, Number(number)).CarryForward[field] =
      Number(count);
  },
);

// What it became -----------------------------------------------------------------

Then(
  "{string} on {string} is kept as the competition {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const { inTournament } = await competitionKeptFor(this, id, website);
    assert.equal(inTournament.reference.name.toString(), name);
  },
);

Then(
  "{string} is in the competition kept for {string} on {string}",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    const { tournament, competition } = await competitionKeptFor(
      this,
      id,
      website,
    );
    competitionPlayerCalled(tournament, competition, name);
  },
);

Then(
  "the first player of the competition kept for {string} on {string} is {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const { tournament, competition } = await competitionKeptFor(
      this,
      id,
      website,
    );
    const [first] = competition.players;
    assert.ok(first !== undefined, "The competition has no players.");
    assert.equal(nameOf(tournament, competition, first.id), name);
  },
);

Then(
  /^"(.*)" has (not )?withdrawn from the competition kept for "(.*)" on "(.*)"$/,
  async function (
    this: SpecWorld,
    name: string,
    not: string | undefined,
    id: string,
    website: string,
  ) {
    const { tournament, competition } = await competitionKeptFor(
      this,
      id,
      website,
    );
    const player = competitionPlayerCalled(tournament, competition, name);
    assert.equal(player.withdrawn, not === undefined);
  },
);

Then(
  "{string} carries nothing forward in the competition kept for {string} on {string}",
  async function (this: SpecWorld, name: string, id: string, website: string) {
    const { tournament, competition } = await competitionKeptFor(
      this,
      id,
      website,
    );
    const player = competitionPlayerCalled(tournament, competition, name);
    assert.equal(player.carryForward.carriesAnything, false);
  },
);

Then(
  new RegExp(
    `^"(.*)" carries forward (\\d+) ${A_COUNT} in the competition kept for "(.*)" on "(.*)"$`,
  ),
  async function (
    this: SpecWorld,
    name: string,
    count: string,
    which: string,
    id: string,
    website: string,
  ) {
    const { tournament, competition } = await competitionKeptFor(
      this,
      id,
      website,
    );
    const player = competitionPlayerCalled(tournament, competition, name);
    const field = COUNTS[which];
    assert.ok(field !== undefined, `There is no count ${which}.`);
    assert.equal(player.carryForward.of(field), Number(count));
  },
);

// Its games ------------------------------------------------------------------------

const firstGameOf = async (world: SpecWorld, id: string, website: string) => {
  const kept = await competitionKeptFor(world, id, website);
  const [first] = gamesInUse(kept.competition);
  assert.ok(first !== undefined, "The competition has no games.");
  return { ...kept, game: first };
};

Then(
  "the first game of the competition kept for {string} on {string} was won by {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const { tournament, competition, game } = await firstGameOf(
      this,
      id,
      website,
    );
    assert.equal(nameOf(tournament, competition, game.winner), name);
  },
);

Then(
  "the first game of the competition kept for {string} on {string} has the winner's score {string}",
  async function (this: SpecWorld, id: string, website: string, score: string) {
    const { game } = await firstGameOf(this, id, website);
    assert.equal(game.winnerScore.toString(), score);
  },
);

Then(
  "the first game of the competition kept for {string} on {string} has the loser's score {string}",
  async function (this: SpecWorld, id: string, website: string, score: string) {
    const { game } = await firstGameOf(this, id, website);
    assert.equal(game.loserScore.toString(), score);
  },
);

Then(
  "the first game of the competition kept for {string} on {string} was added at {string}",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    moment: string,
  ) {
    assert.equal(
      await firstGameAddedAt(this, id, website),
      new Date(moment).toISOString(),
    );
  },
);
