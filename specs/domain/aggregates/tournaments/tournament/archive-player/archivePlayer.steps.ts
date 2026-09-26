import { Given, Then, When } from "@cucumber/cucumber";

import { TournamentPlayerArchived } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerArchived.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  now,
  playerNamed,
  scenarioOf,
} from "../aTournament.js";

// Whatever asks for the player to be archived says whether they have played
// any games, since the games are not the tournament's to know.
Given(
  "the player {string} has played games",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).playersWithGames.add(name);
  },
);

Given(
  "the player {string} has played no games",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).playersWithGames.delete(name);
  },
);

When(
  "the player {string} is archived",
  function (this: SpecWorld, name: string) {
    ask(this, (tournament) =>
      tournament.archivePlayer(
        playerNamed(tournament, name).id,
        scenarioOf(this).playersWithGames.has(name),
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} is archived by their id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.archivePlayer(
        TournamentPlayerId.from(id),
        false,
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a player being archived",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TournamentPlayerArchived);
  },
);
