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
  function (this: SpecWorld, representing: string) {
    scenarioOf(this).player.representing = representing;
  },
);

// Said of a player added to a tournament or to a team alike, as their name is.
Given(
  "the player is to have the world ranking name {string}",
  function (this: SpecWorld, worldRankingName: string) {
    scenarioOf(this).player.worldRankingName = worldRankingName;
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
  const { id, representing, flag, worldRankingName } = scenarioOf(this).player;
  ask(this, (tournament) =>
    tournament.addPlayer(
      id === undefined
        ? TournamentPlayerId.create()
        : TournamentPlayerId.from(id),
      { name, representing, flag, worldRankingName },
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
