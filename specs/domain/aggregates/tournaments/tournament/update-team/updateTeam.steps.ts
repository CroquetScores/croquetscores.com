import { Given, Then, When } from "@cucumber/cucumber";

import { TeamUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/TeamUpdated.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed, teamScenarioOf, teamUpdateOf } from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
} from "../aTournament.js";

Given(
  "the team {string} was updated to be called {string}",
  function (this: SpecWorld, name: string, called: string) {
    happened(this, (tournament) => {
      const team = teamNamed(tournament, name);
      tournament.updateTeam(
        team.id,
        { name: called, shortName: team.shortName.toString() },
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  "the update calls the team {string}",
  function (this: SpecWorld, name: string) {
    teamScenarioOf(this).teamUpdate.name = name;
  },
);

Given(
  "the update has the team known for short as {string}",
  function (this: SpecWorld, shortName: string) {
    teamScenarioOf(this).teamUpdate.shortName = shortName;
  },
);

Given(
  "the update has the team fly the flag {string}",
  function (this: SpecWorld, flag: string) {
    teamScenarioOf(this).teamUpdate.flag = flag;
  },
);

When("the team {string} is updated", function (this: SpecWorld, name: string) {
  ask(this, (tournament) => {
    const team = teamNamed(tournament, name);
    tournament.updateTeam(
      team.id,
      teamUpdateOf(this, team),
      byOf(this),
      now(this),
    );
  });
});

When(
  "the team {string} is updated by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.updateTeam(
        TeamId.from(id),
        teamUpdateOf(this, undefined),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a team being updated",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamUpdated);
  },
);
