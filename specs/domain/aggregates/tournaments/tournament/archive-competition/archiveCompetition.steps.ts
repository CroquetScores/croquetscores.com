import { Then, When } from "@cucumber/cucumber";

import { CompetitionArchived } from "../../../../../../src/domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionNamed,
  now,
} from "../aTournament.js";
import { playedIn } from "../aTeamTournament.js";

When(
  "the competition {string} is archived",
  function (this: SpecWorld, name: string) {
    ask(this, (tournament) =>
      tournament.archiveCompetition(
        competitionNamed(tournament, name).reference.id,
        byOf(this),
        now(this),
        // What whatever asks says has been played, were it a test.
        playedIn(this, name),
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
