import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TestAdded } from "../../../../../../src/domain/aggregates/tournaments/events/TestAdded.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  teamIdNamed,
  teamNamed,
  teamScenarioOf,
  testNamed,
  testToAdd,
} from "../aTeamTournament.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionIdOf,
  happened,
  now,
  tournamentOf,
} from "../aTournament.js";

Given(
  "the test is to start on {string}",
  function (this: SpecWorld, day: string) {
    teamScenarioOf(this).test.starts = day;
  },
);

Given(
  "the test is to finish on {string}",
  function (this: SpecWorld, day: string) {
    teamScenarioOf(this).test.finishes = day;
  },
);

Given(
  "the test is to be expected to have {int} matches",
  function (this: SpecWorld, count: number) {
    teamScenarioOf(this).test.expectedMatches = count;
  },
);

Given(
  "each match of the test is to be the best of {int}",
  function (this: SpecWorld, games: number) {
    teamScenarioOf(this).test.bestOf = games;
  },
);

Given(
  "the test is to be in the group {string}",
  function (this: SpecWorld, group: string) {
    teamScenarioOf(this).test.group = group;
  },
);

Given(
  "the test is to be in a group of {int} characters",
  function (this: SpecWorld, length: number) {
    teamScenarioOf(this).test.group = "a".repeat(length);
  },
);

Given(
  "the test between {string} and {string} was added to it as {string}",
  function (this: SpecWorld, first: string, second: string, id: string) {
    happened(this, (tournament) =>
      tournament.addTest(
        CompetitionId.from(id),
        testToAdd(
          this,
          tournament,
          teamNamed(tournament, first).id,
          teamNamed(tournament, second).id,
        ),
        byOf(this),
        now(this),
      ),
    );
  },
);

// What is asked of the test's own values may be refused as well as adding
// it, and both are the scenario's to expect.
const added = (world: SpecWorld, first: string, second: string): void => {
  ask(world, (tournament) =>
    tournament.addTest(
      competitionIdOf(world),
      testToAdd(
        world,
        tournament,
        teamIdNamed(tournament, first),
        teamIdNamed(tournament, second),
      ),
      byOf(world),
      now(world),
    ),
  );
};

When(
  "the test between {string} and {string} is added",
  function (this: SpecWorld, first: string, second: string) {
    added(this, first, second);
  },
);

// Named by its id where the tournament has no team to name it by.
When(
  /^the test between "([^"]*)" and "([^"]*)" is added by the (?:first|second) team's id$/,
  function (this: SpecWorld, first: string, second: string) {
    added(this, first, second);
  },
);

// A tournament that is not played by teams has none to name.
When("a test between two teams is added", function (this: SpecWorld) {
  ask(this, (tournament) =>
    tournament.addTest(
      competitionIdOf(this),
      testToAdd(this, tournament, TeamId.create(), TeamId.create()),
      byOf(this),
      now(this),
    ),
  );
});

Then(
  "the first thing it recorded is a test being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TestAdded);
  },
);

Then(
  "the second test {string} has the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(
      testNamed(tournamentOf(this), name, 1).reference.slug.toString(),
      slug,
    );
  },
);
