import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TeamAdded } from "../../../../../../src/domain/aggregates/tournaments/events/TeamAdded.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed, teamScenarioOf, teamToAdd } from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
  tournamentOf,
} from "../aTournament.js";

Given(
  "the team {string} was added to it as {string}",
  function (this: SpecWorld, name: string, id: string) {
    const { details } = teamToAdd(this, name);
    happened(this, (tournament) =>
      tournament.addTeam(TeamId.from(id), details, byOf(this), now(this)),
    );
  },
);

Given("the team id {string}", function (this: SpecWorld, id: string) {
  teamScenarioOf(this).team.id = id;
});

// Making the team may be refused as well as adding it, and both are the
// scenario's to expect.
When("the team {string} is added", function (this: SpecWorld, name: string) {
  const { id, details } = teamToAdd(this, name);
  ask(this, (tournament) =>
    tournament.addTeam(id, details, byOf(this), now(this)),
  );
});

Then(
  "the first thing it recorded is a team being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamAdded);
  },
);

Then(
  "the tournament's team {string} is known by {string}",
  function (this: SpecWorld, name: string, id: string) {
    assert.equal(teamNamed(tournamentOf(this), name).id.value, id);
  },
);
