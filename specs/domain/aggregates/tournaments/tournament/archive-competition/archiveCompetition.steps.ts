import { Given, Then, When } from "@cucumber/cucumber";

import { CompetitionArchived } from "../../../../../../src/domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionNamed,
  now,
  scenarioOf,
} from "../aTournament.js";

// Whatever asks for the competition to be archived says whether it has any
// games, since the games are the competition's and not the tournament's.
Given(
  "the competition {string} has games",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).competitionsWithGames.add(name);
  },
);

Given(
  "the competition {string} has no games",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).competitionsWithGames.delete(name);
  },
);

When(
  "the competition {string} is archived",
  function (this: SpecWorld, name: string) {
    ask(this, (tournament) =>
      tournament.archiveCompetition(
        competitionNamed(tournament, name).reference.id,
        scenarioOf(this).competitionsWithGames.has(name),
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the competition {string} is archived by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.archiveCompetition(
        CompetitionId.from(id),
        false,
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a competition being archived",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CompetitionArchived);
  },
);
