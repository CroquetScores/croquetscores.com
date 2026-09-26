import { Then, When } from "@cucumber/cucumber";

import { TournamentArchived } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentArchived.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

When("somebody archives the tournament", function (this: SpecWorld) {
  ask(this, (tournament) => tournament.archive(byOf(this), now(this)));
});

Then(
  "the first thing it recorded is its archiving",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TournamentArchived);
  },
);
