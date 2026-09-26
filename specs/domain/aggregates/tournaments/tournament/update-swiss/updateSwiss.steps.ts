import { Given, Then, When } from "@cucumber/cucumber";

import { SwissUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/SwissUpdated.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionNamed,
  happened,
  nameAndBestOf,
  now,
} from "../aTournament.js";

Given(
  "the Swiss {string} was added to it as the best of {int}",
  function (this: SpecWorld, name: string, games: number) {
    happened(this, (tournament) =>
      tournament.addSwiss(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(games),
        byOf(this),
        now(this),
      ),
    );
  },
);

When("the Swiss {string} is updated", function (this: SpecWorld, name: string) {
  ask(this, (tournament) => {
    const found = competitionNamed(tournament, name);
    const { name: called, bestOf } = nameAndBestOf(this, found);
    tournament.updateSwiss(
      found.reference.id,
      called,
      bestOf,
      byOf(this),
      now(this),
    );
  });
});

Then(
  "the first thing it recorded is a Swiss being updated",
  function (this: SpecWorld) {
    assertFirstRecorded(this, SwissUpdated);
  },
);
