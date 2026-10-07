import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TournamentPlayerUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerUpdated.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { TournamentPlayer } from "../../../../../../src/domain/aggregates/tournaments/TournamentPlayer.js";
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

// What `player` is, said again with what the scenario's update changes.
const updateOf = (
  world: SpecWorld,
  player: TournamentPlayer | undefined,
): {
  name: string;
  representing?: string;
  flag?: string;
  worldRankingName?: string;
} => {
  const changed = scenarioOf(world).playerUpdate;
  const representing = changed.representing ?? player?.representing;
  const worldRankingName =
    changed.worldRankingName ?? player?.worldRankingName?.toString();
  const flag =
    changed.flag ??
    (player?.flag === undefined ? undefined : String(player.flag));
  return {
    name: changed.name ?? player?.name.toString() ?? "Sam Someone",
    ...(representing === undefined ? {} : { representing }),
    ...(flag === undefined ? {} : { flag }),
    ...(worldRankingName === undefined ? {} : { worldRankingName }),
  };
};

Given(
  "the player {string} was updated to be called {string}",
  function (this: SpecWorld, name: string, called: string) {
    happened(this, (tournament) => {
      const player = playerNamed(tournament, name);
      tournament.updatePlayer(
        player.id,
        { name: called },
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  "the player {string} was updated to be known in the world rankings as {string}",
  function (this: SpecWorld, name: string, worldRankingName: string) {
    happened(this, (tournament) => {
      const player = playerNamed(tournament, name);
      tournament.updatePlayer(
        player.id,
        { name, worldRankingName },
        byOf(this),
        now(this),
      );
    });
  },
);

// Said of a player in a tournament or in a team alike, as their name is.
Given(
  "the update gives the player the world ranking name {string}",
  function (this: SpecWorld, worldRankingName: string) {
    scenarioOf(this).playerUpdate.worldRankingName = worldRankingName;
  },
);

Given(
  "the update calls the player {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).playerUpdate.name = name;
  },
);

Given(
  "the update has the player represent {string}",
  function (this: SpecWorld, representing: string) {
    scenarioOf(this).playerUpdate.representing = representing;
  },
);

Given(
  "the update has the player fly the flag {string}",
  function (this: SpecWorld, flag: string) {
    scenarioOf(this).playerUpdate.flag = flag;
  },
);

When(
  "the player {string} is updated",
  function (this: SpecWorld, name: string) {
    ask(this, (tournament) => {
      const player = playerNamed(tournament, name);
      tournament.updatePlayer(
        player.id,
        updateOf(this, player),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} is updated by their id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.updatePlayer(
        TournamentPlayerId.from(id),
        updateOf(this, undefined),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a player being updated",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TournamentPlayerUpdated);
  },
);

Then(
  "the tournament has no player {string}",
  function (this: SpecWorld, name: string) {
    const names = tournamentOf(this).players.map((player) =>
      player.name.toString(),
    );
    assert.ok(!names.includes(name), `It has ${names.join(", ")}.`);
  },
);
