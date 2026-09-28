import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../../support/world.js";
import {
  byOf,
  competitionOf,
  happened,
  now,
  playerNamed,
  rebuild,
  scenarioOf,
  tournamentOrderOf,
  tournamentPlayerNamed,
  toldOf,
} from "./aCompetition.js";

// What a competition's features all say: what its stream already holds, and
// what the competition has afterwards. Each feature's own request is in its
// own steps.

// Said of the competition and of a list of its players alike
// (CompetitionPlayer.feature), so it begins both empty.
Given("a competition with no players", function (this: SpecWorld) {
  this.competitionPlayers = [];
  scenarioOf(this);
  rebuild(this);
});

Given(
  "the tournament player {string} has the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    tournamentPlayerNamed(this, name);
    scenarioOf(this).tournamentOrders.set(name, order);
  },
);

Given("the competition is rebuilt from its stream", function (this: SpecWorld) {
  rebuild(this);
});

Given(
  "the tournament player {string} was entered in it",
  function (this: SpecWorld, name: string) {
    happened(this, (competition) =>
      competition.enterPlayer(
        tournamentPlayerNamed(this, name),
        tournamentOrderOf(this, name),
        toldOf(this),
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the player {string} withdrew from it",
  function (this: SpecWorld, name: string) {
    happened(this, (competition) => {
      competition.withdrawPlayer(
        playerNamed(this, competition, name).id,
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  "the withdrawal of the player {string} was reversed",
  function (this: SpecWorld, name: string) {
    happened(this, (competition) => {
      competition.reverseWithdrawal(
        playerNamed(this, competition, name).id,
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  "the player {string} was removed from it",
  function (this: SpecWorld, name: string) {
    happened(this, (competition) => {
      competition.removePlayer(
        playerNamed(this, competition, name).id,
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

const hasTournamentPlayer = (world: SpecWorld, name: string): boolean => {
  const tournamentPlayer = tournamentPlayerNamed(world, name);
  return competitionOf(world).players.some((player) =>
    player.tournamentPlayerId.equals(tournamentPlayer),
  );
};

Then(
  "the competition has the tournament player {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(hasTournamentPlayer(this, name), true);
  },
);

Then(
  "the competition does not have the tournament player {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(hasTournamentPlayer(this, name), false);
  },
);

Then(
  /^the competition has (\d+) players?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(competitionOf(this).players.length, Number(count));
  },
);

Then(
  "the competition's player {string} has withdrawn",
  function (this: SpecWorld, name: string) {
    assert.equal(playerNamed(this, competitionOf(this), name).withdrawn, true);
  },
);

Then(
  "the competition's player {string} has not withdrawn",
  function (this: SpecWorld, name: string) {
    assert.equal(playerNamed(this, competitionOf(this), name).withdrawn, false);
  },
);

Then(
  "the competition's player {string} has the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    assert.equal(playerNamed(this, competitionOf(this), name).order, order);
  },
);

const places = ["first", "second", "third", "fourth"];

Then(
  /^the competition's (first|second|third|fourth) player is "([^"]*)"$/,
  function (this: SpecWorld, place: string, name: string) {
    const player = competitionOf(this).players[places.indexOf(place)];
    assert.ok(player !== undefined, `The competition has no ${place} player.`);
    assert.ok(
      player.tournamentPlayerId.equals(tournamentPlayerNamed(this, name)),
      `The ${place} player is not ${name}.`,
    );
  },
);
