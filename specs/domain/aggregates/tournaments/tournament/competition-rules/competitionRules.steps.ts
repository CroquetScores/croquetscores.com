import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  byOf,
  competitionNamed,
  happened,
  now,
  scenarioOf,
  tournamentOf,
} from "../aTournament.js";

// How a competition is to be played and counted when it is added, said a thing
// at a time and left unsaid otherwise (competitionRules.feature).

// The rules stay as they were said for the competitions added after, until
// they are told otherwise.
Given(
  "nothing is said of how the competition is played and counted",
  function (this: SpecWorld) {
    delete scenarioOf(this).competition.rules;
  },
);

Given(
  "the competition is to be played under handicap",
  function (this: SpecWorld) {
    const { competition } = scenarioOf(this);
    competition.rules = { ...competition.rules, handicap: true };
  },
);

Given("the competition is to allow drawn results", function (this: SpecWorld) {
  const { competition } = scenarioOf(this);
  competition.rules = { ...competition.rules, drawsAllowed: true };
});

Given(
  /^the competition is said (not )?to count towards the world rankings$/,
  function (this: SpecWorld, not: string | null) {
    const { competition } = scenarioOf(this);
    competition.rules = { ...competition.rules, worldRankings: not === null };
  },
);

// A block already in the stream, added saying one thing of its rules.
Given(
  "the block {string} was added to it played under handicap",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addBlock(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(1),
        byOf(this),
        now(this),
        { handicap: true },
      ),
    );
  },
);

Given(
  "the block {string} was added to it allowing drawn results",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addBlock(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(1),
        byOf(this),
        now(this),
        { drawsAllowed: true },
      ),
    );
  },
);

// What an update says of them, which is all of them again, or none.
Given(
  "the update plays the competition under handicap",
  function (this: SpecWorld) {
    const { competitionUpdate } = scenarioOf(this);
    competitionUpdate.rules = { ...competitionUpdate.rules, handicap: true };
  },
);

Given(
  "the update allows drawn results in the competition",
  function (this: SpecWorld) {
    const { competitionUpdate } = scenarioOf(this);
    competitionUpdate.rules = {
      ...competitionUpdate.rules,
      drawsAllowed: true,
    };
  },
);

Given(
  "the update says the competition counts towards the world rankings",
  function (this: SpecWorld) {
    const { competitionUpdate } = scenarioOf(this);
    competitionUpdate.rules = {
      ...competitionUpdate.rules,
      worldRankings: true,
    };
  },
);

Then(
  /^the tournament's competition "([^"]*)" (is|is not) played under handicap$/,
  function (this: SpecWorld, name: string, is: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).rules.handicap,
      is === "is",
    );
  },
);

Then(
  /^the tournament's competition "([^"]*)" (allows|does not allow) drawn results$/,
  function (this: SpecWorld, name: string, allows: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).rules.drawsAllowed,
      allows === "allows",
    );
  },
);

Then(
  /^the tournament's competition "([^"]*)" (counts|does not count) towards the world rankings$/,
  function (this: SpecWorld, name: string, counts: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).rules.worldRankings,
      counts === "counts",
    );
  },
);
