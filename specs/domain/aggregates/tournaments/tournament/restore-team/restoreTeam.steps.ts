import { Given, Then, When } from "@cucumber/cucumber";

import { TeamRestored } from "../../../../../../src/domain/aggregates/tournaments/events/TeamRestored.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed } from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
} from "../aTournament.js";

Given(
  "the team {string} was restored",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.restoreTeam(
        teamNamed(tournament, name).id,
        byOf(this),
        now(this),
      ),
    );
  },
);

When("the team {string} is restored", function (this: SpecWorld, name: string) {
  ask(this, (tournament) =>
    tournament.restoreTeam(
      teamNamed(tournament, name).id,
      byOf(this),
      now(this),
    ),
  );
});

When(
  "the team {string} is restored by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.restoreTeam(TeamId.from(id), byOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a team being restored",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamRestored);
  },
);
