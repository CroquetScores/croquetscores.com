import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../../support/world.js";
import { playerNamed, tournamentOf } from "../aTournament.js";

// Moving a player is in the words a competition's features use too, so those
// steps are shared (movingPlayers.steps.ts).

Then(
  "the tournament's player {string} has the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    assert.equal(playerNamed(tournamentOf(this), name).order, order);
  },
);
