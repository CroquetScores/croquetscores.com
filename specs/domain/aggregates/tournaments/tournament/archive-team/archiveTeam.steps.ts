import { Then, When } from "@cucumber/cucumber";

import { TeamArchived } from "../../../../../../src/domain/aggregates/tournaments/events/TeamArchived.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed } from "../aTeamTournament.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

When("the team {string} is archived", function (this: SpecWorld, name: string) {
  ask(this, (tournament) =>
    tournament.archiveTeam(
      teamNamed(tournament, name).id,
      byOf(this),
      now(this),
    ),
  );
});

When(
  "the team {string} is archived by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.archiveTeam(TeamId.from(id), byOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a team being archived",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamArchived);
  },
);
