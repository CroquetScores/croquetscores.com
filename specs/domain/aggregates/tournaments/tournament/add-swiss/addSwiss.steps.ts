import { Given, Then, When } from "@cucumber/cucumber";

import { SwissAdded } from "../../../../../../src/domain/aggregates/tournaments/events/SwissAdded.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionIdOf,
  now,
  scenarioOf,
} from "../aTournament.js";

Given(
  "the Swiss is to be the best of {int}",
  function (this: SpecWorld, games: number) {
    scenarioOf(this).competition.bestOf = games;
  },
);

When("the Swiss {string} is added", function (this: SpecWorld, name: string) {
  ask(this, (tournament) =>
    tournament.addSwiss(
      competitionIdOf(this),
      CompetitionName.from(name),
      BestOf.from(scenarioOf(this).competition.bestOf ?? 1),
      byOf(this),
      now(this),
      scenarioOf(this).competition.rules,
    ),
  );
});

Then(
  "the first thing it recorded is a Swiss being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, SwissAdded);
  },
);
