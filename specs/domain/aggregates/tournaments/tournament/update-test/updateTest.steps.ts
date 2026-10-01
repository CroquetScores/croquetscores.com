import { Given, Then, When } from "@cucumber/cucumber";

import { TestUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/TestUpdated.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  playedIn,
  teamScenarioOf,
  testNamed,
  type TestUpdateSaid,
  testUpdateOf,
} from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  happened,
  now,
} from "../aTournament.js";

// What has been played in a test is not the tournament's to know, so whatever
// asks for the test to be updated says, and the scenario says what it says.
const said = (
  world: SpecWorld,
  name: string,
  played: { matchesStarted?: number; mostGamesBetweenTwo?: number },
): void => {
  const { played: kept } = teamScenarioOf(world);
  kept.set(name, { ...playedIn(world, name), ...played });
};

Given(
  "the test {string} has no games",
  function (this: SpecWorld, name: string) {
    said(this, name, { matchesStarted: 0, mostGamesBetweenTwo: 0 });
  },
);

Given(
  /^the test "([^"]*)" has (\d+) match(?:es)? started$/,
  function (this: SpecWorld, name: string, count: string) {
    said(this, name, { matchesStarted: Number(count) });
  },
);

Given(
  "the most games two players have played in the test {string} is {int}",
  function (this: SpecWorld, name: string, games: number) {
    said(this, name, { mostGamesBetweenTwo: games });
  },
);

Given(
  /^the update has the test's (first|second) team be "([^"]*)"(?: by its id)?$/,
  function (this: SpecWorld, which: string, team: string) {
    const update = teamScenarioOf(this).testUpdate;
    if (which === "first") update.firstTeam = team;
    else update.secondTeam = team;
  },
);

Given(
  "the update has the test start on {string}",
  function (this: SpecWorld, day: string) {
    teamScenarioOf(this).testUpdate.starts = day;
  },
);

Given(
  "the update has the test finish on {string}",
  function (this: SpecWorld, day: string) {
    teamScenarioOf(this).testUpdate.finishes = day;
  },
);

Given(
  "the update has the test expected to have {int} matches",
  function (this: SpecWorld, count: number) {
    teamScenarioOf(this).testUpdate.expectedMatches = count;
  },
);

Given(
  "the update has each match of the test be the best of {int}",
  function (this: SpecWorld, games: number) {
    teamScenarioOf(this).testUpdate.bestOf = games;
  },
);

Given(
  "the update has the test in the group {string}",
  function (this: SpecWorld, group: string) {
    teamScenarioOf(this).testUpdate.group = group;
  },
);

Given("the update has the test in no group", function (this: SpecWorld) {
  teamScenarioOf(this).testUpdate.group = null;
});

// A test updated in the stream as `changed` says, with nothing played in it
// to stop the update. What the scenario says its own update changes is left
// as it was.
const updatedInTheStream = (
  world: SpecWorld,
  name: string,
  changed: TestUpdateSaid,
): void => {
  const scenario = teamScenarioOf(world);
  const pending = scenario.testUpdate;
  scenario.testUpdate = changed;
  happened(world, (tournament) => {
    const { reference, shape } = testNamed(tournament, name);
    tournament.updateTest(
      reference.id,
      testUpdateOf(world, tournament, shape),
      { matchesStarted: 0, mostGamesBetweenTwo: 0 },
      byOf(world),
      now(world),
    );
  });
  scenario.testUpdate = pending;
};

Given(
  "the test {string} was updated to be between {string} and {string}",
  function (this: SpecWorld, name: string, first: string, second: string) {
    updatedInTheStream(this, name, { firstTeam: first, secondTeam: second });
  },
);

Given(
  "the test {string} was updated to be expected to have {int} matches",
  function (this: SpecWorld, name: string, count: number) {
    updatedInTheStream(this, name, { expectedMatches: count });
  },
);

Given(
  "the test {string} was updated to have each match the best of {int}",
  function (this: SpecWorld, name: string, games: number) {
    updatedInTheStream(this, name, { bestOf: games });
  },
);

Given(
  "the test {string} was updated to be in the group {string}",
  function (this: SpecWorld, name: string, group: string) {
    updatedInTheStream(this, name, { group });
  },
);

When("the test {string} is updated", function (this: SpecWorld, name: string) {
  ask(this, (tournament) => {
    const { reference, shape } = testNamed(tournament, name);
    tournament.updateTest(
      reference.id,
      testUpdateOf(this, tournament, shape),
      playedIn(this, name),
      byOf(this),
      now(this),
    );
  });
});

When(
  "the test {string} is updated by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.updateTest(
        CompetitionId.from(id),
        testUpdateOf(this, tournament, undefined),
        playedIn(this, id),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a test being updated",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TestUpdated);
  },
);
