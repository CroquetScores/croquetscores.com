import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { BlockAdded } from "../../../../../../src/domain/aggregates/tournaments/events/BlockAdded.js";
import { KnockoutAdded } from "../../../../../../src/domain/aggregates/tournaments/events/KnockoutAdded.js";
import { SwissAdded } from "../../../../../../src/domain/aggregates/tournaments/events/SwissAdded.js";
import { TestAdded } from "../../../../../../src/domain/aggregates/tournaments/events/TestAdded.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { TieBreak } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TieBreak.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { teamNamed } from "../aTeamTournament.js";
import {
  byOf,
  createdAs,
  competitionNamed,
  drawOfPlaces,
  happened,
  happenedAs,
  now,
  scenarioOf,
  tournamentOf,
} from "../aTournament.js";

// Whether a competition is played as Advantage Golf Croquet, said when it is
// added or updated (advantage.feature).

// A test is only in a tournament played by teams, and Advantage is only golf
// croquet, so a stream says both; saying one would leave the other unsaid.
Given(
  "a stream where a tournament was created in the format {string} and the sport {string}",
  function (this: SpecWorld, format: string, sport: string) {
    createdAs(this, { format, sport });
  },
);

Given("the competition is said to be Advantage", function (this: SpecWorld) {
  const { competition } = scenarioOf(this);
  competition.rules = { ...competition.rules, advantage: true };
});

// What an update says of the rules is all of them again, so saying it is not
// Advantage is saying it as an added competition's would be.
Given(
  /^the update says the competition is (not )?Advantage$/,
  function (this: SpecWorld, not: string | null) {
    const { competitionUpdate } = scenarioOf(this);
    competitionUpdate.rules = {
      ...competitionUpdate.rules,
      advantage: not === null,
    };
  },
);

// Whether a competition has any game kept is not the tournament's to know, so
// whatever asks for it to be updated says, archived games among them.
Given(
  "the competition {string} has a game kept",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).competitionsWithGamesKept.add(name);
  },
);

// Competitions already in the stream, added as Advantage.
Given(
  "the block {string} was added to it as Advantage",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addBlock(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(1),
        byOf(this),
        now(this),
        { advantage: true },
      ),
    );
  },
);

Given(
  "the knockout {string} was added to it as Advantage",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addKnockout(
        CompetitionId.create(),
        CompetitionName.from(name),
        drawOfPlaces(4),
        byOf(this),
        now(this),
        { advantage: true },
      ),
    );
  },
);

// Competitions added by the events kept before Advantage could be said, which
// say nothing of it. No request to the tournament records one of these, so the
// events are made as they were kept.
Given(
  /^the (block|knockout|Swiss) "([^"]*)" was added to it by an event that says nothing of Advantage$/,
  function (this: SpecWorld, kind: string, name: string) {
    const id = CompetitionId.create().value;
    const slug = "competition-a";
    const order = 10_000;
    happenedAs(this, () => {
      if (kind === "block") {
        return new BlockAdded(
          id,
          name,
          slug,
          order,
          1,
          1,
          false,
          false,
          false,
          13,
          undefined,
          TieBreak.unlessTold.code,
          byOf(this),
          now(this),
        );
      }
      if (kind === "knockout") {
        return new KnockoutAdded(
          id,
          name,
          slug,
          order,
          4,
          [1, 1],
          false,
          false,
          false,
          13,
          undefined,
          byOf(this),
          now(this),
        );
      }
      return new SwissAdded(
        id,
        name,
        slug,
        order,
        1,
        false,
        false,
        false,
        13,
        undefined,
        byOf(this),
        now(this),
      );
    });
  },
);

Given(
  "the test between {string} and {string} was added to it by an event that says nothing of Advantage",
  function (this: SpecWorld, first: string, second: string) {
    happenedAs(
      this,
      (tournament) =>
        new TestAdded(
          CompetitionId.create().value,
          teamNamed(tournament, first).id.value,
          teamNamed(tournament, second).id.value,
          "aus-v-eng",
          10_000,
          tournament.starts.toISOString().slice(0, 10),
          tournament.starts.toISOString().slice(0, 10),
          1,
          1,
          undefined,
          false,
          false,
          false,
          13,
          undefined,
          byOf(this),
          now(this),
        ),
    );
  },
);

Then(
  /^the tournament's competition "([^"]*)" (is|is not) Advantage$/,
  function (this: SpecWorld, name: string, is: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).rules.advantage,
      is === "is",
    );
  },
);
