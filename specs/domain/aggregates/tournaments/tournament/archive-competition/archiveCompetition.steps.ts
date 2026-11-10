import { Given, Then, When } from "@cucumber/cucumber";

import { CompetitionArchived } from "../../../../../../src/domain/aggregates/tournaments/events/CompetitionArchived.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionNamed,
  happenedAs,
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

// Not through the tournament, which now says the name a competition is given
// when it is archived: the event as it was kept before it did.
Given(
  "the competition {string} was archived before archiving renamed it",
  function (this: SpecWorld, name: string) {
    happenedAs(
      this,
      (tournament) =>
        new CompetitionArchived(
          competitionNamed(tournament, name).reference.id.value,
          // Past every order the tournament has, as archiving puts it.
          1_000_000,
          undefined,
          byOf(this),
          now(this),
        ),
    );
  },
);
