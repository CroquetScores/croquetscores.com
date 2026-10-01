import { Given } from "@cucumber/cucumber";

import type { TeamPlayerInTest } from "../../../../../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import type { CompetitionShape } from "../../../../../../../src/domain/aggregates/tournaments/Tournament.js";
import { BestOf } from "../../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { ExpectedMatches } from "../../../../../../../src/domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { ReadOnlyDate } from "../../../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import { scenarioOf, teamNamed, teamPlayerNamed } from "../aCompetition.js";

// A test, as the tournament tells it of itself, and who plays for which of
// its teams, which is the tournament's to know too.

type TestShape = Extract<CompetitionShape, { readonly kind: "test" }>;

// A test the scenario says nothing more of is played on the one day, expected
// to have 1 match, each the best of 1.
const A_DAY = ReadOnlyDate.from(new Date("2026-10-03T00:00:00Z"));

const testOf = (world: SpecWorld): TestShape => {
  const { shape } = scenarioOf(world).told;
  if (shape.kind !== "test") throw new Error("The competition is not a test.");
  return shape;
};

const told = (world: SpecWorld, shape: TestShape): void => {
  const scenario = scenarioOf(world);
  scenario.told = { ...scenario.told, shape };
};

// Who plays for a team, in place of whatever was said of them before.
const playing = (world: SpecWorld, player: TeamPlayerInTest): void => {
  const scenario = scenarioOf(world);
  scenario.told = {
    ...scenario.told,
    teamPlayers: [
      ...(scenario.told.teamPlayers ?? []).filter(
        ({ id }) => !id.equals(player.id),
      ),
      player,
    ],
  };
};

Given(
  "a test between the teams {string} and {string}",
  function (this: SpecWorld, first: string, second: string) {
    told(this, {
      kind: "test",
      firstTeam: teamNamed(this, first),
      secondTeam: teamNamed(this, second),
      starts: A_DAY,
      finishes: A_DAY,
      expectedMatches: ExpectedMatches.from(1),
      bestOf: BestOf.from(1),
      group: undefined,
    });
  },
);

Given(
  "the test is now between the teams {string} and {string}",
  function (this: SpecWorld, first: string, second: string) {
    told(this, {
      ...testOf(this),
      firstTeam: teamNamed(this, first),
      secondTeam: teamNamed(this, second),
    });
  },
);

Given(
  "the test's matches are each the best of {int}",
  function (this: SpecWorld, games: number) {
    told(this, { ...testOf(this), bestOf: BestOf.from(games) });
  },
);

Given(
  "the test is expected to have {int} match(es)",
  function (this: SpecWorld, count: number) {
    told(this, {
      ...testOf(this),
      expectedMatches: ExpectedMatches.from(count),
    });
  },
);

Given(
  "{string} plays for {string}",
  function (this: SpecWorld, name: string, team: string) {
    playing(this, {
      id: teamPlayerNamed(this, name),
      team: teamNamed(this, team),
      archived: false,
    });
  },
);

Given(
  "{string} has been archived from {string}",
  function (this: SpecWorld, name: string, team: string) {
    playing(this, {
      id: teamPlayerNamed(this, name),
      team: teamNamed(this, team),
      archived: true,
    });
  },
);
