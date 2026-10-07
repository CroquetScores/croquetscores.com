import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TeamPlayerAdded } from "../../../../../../src/domain/aggregates/tournaments/events/TeamPlayerAdded.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  teamNamed,
  teamPlayerNamed,
  teamScenarioOf,
} from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
  scenarioOf,
  tournamentOf,
} from "../aTournament.js";

Given(
  "the player {string} was added to the team {string} as {string}",
  function (this: SpecWorld, name: string, team: string, id: string) {
    happened(this, (tournament) =>
      tournament.addTeamPlayer(
        teamNamed(tournament, team).id,
        TeamPlayerId.from(id),
        { name },
        byOf(this),
        now(this),
      ),
    );
  },
);

Given("the team player id {string}", function (this: SpecWorld, id: string) {
  teamScenarioOf(this).teamPlayerId = id;
});

// The id the scenario gave the player to be added, or a new one.
const teamPlayerIdOf = (world: SpecWorld): TeamPlayerId => {
  const said = teamScenarioOf(world).teamPlayerId;
  return said === undefined ? TeamPlayerId.create() : TeamPlayerId.from(said);
};

// Making the player may be refused as well as adding them, and both are the
// scenario's to expect.
When(
  "the player {string} is added to the team {string}",
  function (this: SpecWorld, name: string, team: string) {
    ask(this, (tournament) =>
      tournament.addTeamPlayer(
        teamNamed(tournament, team).id,
        teamPlayerIdOf(this),
        { name, worldRankingName: scenarioOf(this).player.worldRankingName },
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the player {string} is added to the team {string} by its id",
  function (this: SpecWorld, name: string, team: string) {
    ask(this, (tournament) =>
      tournament.addTeamPlayer(
        TeamId.from(team),
        teamPlayerIdOf(this),
        { name },
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a player being added to a team",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TeamPlayerAdded);
  },
);

Then(
  "the player {string} of the team {string} is known by {string}",
  function (this: SpecWorld, name: string, team: string, id: string) {
    assert.equal(
      teamPlayerNamed(teamNamed(tournamentOf(this), team), name).id.value,
      id,
    );
  },
);
