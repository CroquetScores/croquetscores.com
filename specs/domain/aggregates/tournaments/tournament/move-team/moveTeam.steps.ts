import { Given, Then, When } from "@cucumber/cucumber";

import { TeamMoved } from "../../../../../../src/domain/aggregates/tournaments/events/TeamMoved.js";
import { TeamsSpacedOut } from "../../../../../../src/domain/aggregates/tournaments/events/TeamsSpacedOut.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed } from "../aTeamTournament.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  creatorOf,
  happenedAs,
  now,
} from "../aTournament.js";

When(
  /^the team "([^"]*)" is moved (up|down)$/,
  function (this: SpecWorld, name: string, direction: "up" | "down") {
    ask(this, (tournament) =>
      tournament.moveTeam(
        teamNamed(tournament, name).id,
        direction,
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the team {string} is moved up by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.moveTeam(TeamId.from(id), "up", byOf(this), now(this)),
    );
  },
);

// An order no move would give just so, to bring two orders together.
Given(
  "the team {string} was moved to the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    happenedAs(
      this,
      (tournament) =>
        new TeamMoved(
          teamNamed(tournament, name).id.value,
          order,
          creatorOf(this),
          now(this),
        ),
    );
  },
);

// Every team, in the order the stream leaves them, as the tournament says
// them when it spaces them out.
Given("the teams were spaced out", function (this: SpecWorld) {
  happenedAs(
    this,
    (tournament) =>
      new TeamsSpacedOut(
        [...tournament.teams]
          .sort((one, other) => one.order - other.order)
          .map((team) => team.id.value),
        creatorOf(this),
        now(this),
      ),
  );
});

Then(
  "the first thing it recorded is a team being moved",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, TeamMoved);
  },
);

Then(
  "the second thing it recorded is a team being moved",
  function (this: SpecWorld) {
    assertRecordedAt(this, 1, TeamMoved);
  },
);

Then(
  "the first thing it recorded is the teams being spaced out",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, TeamsSpacedOut);
  },
);
