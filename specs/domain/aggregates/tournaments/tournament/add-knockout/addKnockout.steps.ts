import { Given, Then, When } from "@cucumber/cucumber";

import { KnockoutAdded } from "../../../../../../src/domain/aggregates/tournaments/events/KnockoutAdded.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionIdOf,
  drawOf,
  now,
  scenarioOf,
} from "../aTournament.js";

Given(
  "the knockout is to have a draw of {int} places",
  function (this: SpecWorld, places: number) {
    scenarioOf(this).drawPlaces = places;
  },
);

When(
  "the knockout {string} is added",
  function (this: SpecWorld, name: string) {
    ask(this, (tournament) =>
      tournament.addKnockout(
        competitionIdOf(this),
        CompetitionName.from(name),
        drawOf(this),
        byOf(this),
        now(this),
        scenarioOf(this).competition.rules,
      ),
    );
  },
);

Then(
  "the first thing it recorded is a knockout being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, KnockoutAdded);
  },
);
