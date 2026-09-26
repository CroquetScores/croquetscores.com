import { Given, Then, When } from "@cucumber/cucumber";

import { TournamentPlayerRestored } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentPlayerRestored.js";
import { TournamentPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
  playerNamed,
} from "../aTournament.js";

Given(
  "the player {string} was restored",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.restorePlayer(
        playerNamed(tournament, name).id,
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} is restored",
  function (this: SpecWorld, name: string) {
    ask(this, (tournament) =>
      tournament.restorePlayer(
        playerNamed(tournament, name).id,
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} is restored by their id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.restorePlayer(
        TournamentPlayerId.from(id),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a player being restored",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TournamentPlayerRestored);
  },
);
