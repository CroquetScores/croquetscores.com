import { Then, When } from "@cucumber/cucumber";

import { TournamentRestored } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentRestored.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

When("the tournament is restored", function (this: SpecWorld) {
  ask(this, (tournament) => tournament.restore(byOf(this), now(this)));
});

Then(
  "the first thing it recorded is its restoring",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TournamentRestored);
  },
);
