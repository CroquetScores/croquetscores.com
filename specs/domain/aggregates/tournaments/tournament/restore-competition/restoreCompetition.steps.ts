import { Given, Then, When } from "@cucumber/cucumber";

import { CompetitionRestored } from "../../../../../../src/domain/aggregates/tournaments/events/CompetitionRestored.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionNamed,
  happened,
  now,
} from "../aTournament.js";

Given(
  "the competition {string} was restored",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.restoreCompetition(
        competitionNamed(tournament, name).reference.id,
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the competition {string} is restored",
  function (this: SpecWorld, name: string) {
    ask(this, (tournament) =>
      tournament.restoreCompetition(
        competitionNamed(tournament, name).reference.id,
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the competition {string} is restored by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.restoreCompetition(
        CompetitionId.from(id),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a competition being restored",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CompetitionRestored);
  },
);
