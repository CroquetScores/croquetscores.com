import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TournamentPlayerAdded } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerAdded.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
  playerNamed,
  scenarioOf,
  tournamentOf,
} from "../aTournament.js";

Given(
  "the player {string} was added to it as {string}",
  function (this: SpecWorld, name: string, id: string) {
    happened(this, (tournament) =>
      tournament.addPlayer(
        TournamentPlayerId.from(id),
        { name },
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the tournament player id {string}",
  function (this: SpecWorld, id: string) {
    scenarioOf(this).player.id = id;
  },
);

Given(
  "the player is to represent {string}",
  function (this: SpecWorld, represents: string) {
    scenarioOf(this).player.represents = represents;
  },
);

Given(
  "the player is to fly the flag {string}",
  function (this: SpecWorld, flag: string) {
    scenarioOf(this).player.flag = flag;
  },
);

// Making the player may be refused as well as adding them, and both are the
// scenario's to expect.
When("the player {string} is added", function (this: SpecWorld, name: string) {
  const { id, represents, flag } = scenarioOf(this).player;
  ask(this, (tournament) =>
    tournament.addPlayer(
      id === undefined
        ? TournamentPlayerId.create()
        : TournamentPlayerId.from(id),
      { name, represents, flag },
      byOf(this),
      now(this),
    ),
  );
});

Then(
  "the first thing it recorded is a player being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TournamentPlayerAdded);
  },
);

Then(
  "the tournament's player {string} is known by {string}",
  function (this: SpecWorld, name: string, id: string) {
    assert.equal(playerNamed(tournamentOf(this), name).id.value, id);
  },
);
