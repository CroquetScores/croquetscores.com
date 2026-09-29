import { Given, Then, When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { competitionPlayerMoves } from "../competitions/competition/move-player/playerMoves.js";
import { tournamentPlayerMoves } from "../tournament/move-player/playerMoves.js";
import type { PlayerMoves } from "./movingPlayers.js";
import { isAboutATournament } from "../tournament/aTournament.js";

// A tournament's players and a competition's are moved in the same words
// (`movePlayer.feature` of each), and a step can be defined once, so these are
// the steps of both, each doing it to whichever the scenario is about.
const movesOf = (world: SpecWorld): PlayerMoves =>
  isAboutATournament(world) ? tournamentPlayerMoves : competitionPlayerMoves;

When(
  /^the player "([^"]*)" is moved (up|down)$/,
  function (this: SpecWorld, name: string, direction: "up" | "down") {
    movesOf(this).moved(this, name, direction);
  },
);

When(
  "the player {string} is moved up by their id",
  function (this: SpecWorld, id: string) {
    movesOf(this).movedById(this, id);
  },
);

Given(
  "the player {string} was moved to the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    movesOf(this).movedTo(this, name, order);
  },
);

Given("the players were spaced out", function (this: SpecWorld) {
  movesOf(this).spacedOut(this);
});

Then(
  "the first thing it recorded is a player being moved",
  function (this: SpecWorld) {
    movesOf(this).assertMovedAt(this, 0);
  },
);

Then(
  "the second thing it recorded is a player being moved",
  function (this: SpecWorld) {
    movesOf(this).assertMovedAt(this, 1);
  },
);

Then(
  "the first thing it recorded is the players being spaced out",
  function (this: SpecWorld) {
    movesOf(this).assertSpacedOutAt(this, 0);
  },
);
