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

// The most hoops a game is played to, said when a competition is added or
// updated (maximumHoops.feature). A number is taken as written, so that one
// that is not a whole number reaches the tournament to be refused there.

// A pattern rather than {int}, since a maximum of -1 or 13.5 is said too.
const HOOPS = "(-?\\d+(?:\\.\\d+)?)";

Given(
  new RegExp(`^the competition is said to have a maximum of ${HOOPS} hoops$`),
  function (this: SpecWorld, hoops: string) {
    const { competition } = scenarioOf(this);
    competition.rules = { ...competition.rules, maximumHoops: Number(hoops) };
  },
);

Given(
  "the competition is said to have no maximum number of hoops",
  function (this: SpecWorld) {
    const { competition } = scenarioOf(this);
    competition.rules = { ...competition.rules, maximumHoops: null };
  },
);

// A block already in the stream, added saying one thing of its rules.
Given(
  new RegExp(
    `^the block "([^"]*)" was added to it with a maximum of ${HOOPS} hoops$`,
  ),
  function (this: SpecWorld, name: string, hoops: string) {
    addedWith(this, name, Number(hoops));
  },
);

Given(
  "the block {string} was added to it with no maximum number of hoops",
  function (this: SpecWorld, name: string) {
    addedWith(this, name, null);
  },
);

Given(
  new RegExp(
    `^the update says the competition has a maximum of ${HOOPS} hoops$`,
  ),
  function (this: SpecWorld, hoops: string) {
    const { competitionUpdate } = scenarioOf(this);
    competitionUpdate.rules = {
      ...competitionUpdate.rules,
      maximumHoops: Number(hoops),
    };
  },
);

Then(
  new RegExp(
    `^the tournament's competition "([^"]*)" has a maximum of ${HOOPS} hoops$`,
  ),
  function (this: SpecWorld, name: string, hoops: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).rules.maximumHoops,
      Number(hoops),
    );
  },
);

Then(
  "the tournament's competition {string} has no maximum number of hoops",
  function (this: SpecWorld, name: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).rules.maximumHoops,
      null,
    );
  },
);

function addedWith(
  world: SpecWorld,
  name: string,
  maximumHoops: number | null,
): void {
  happened(world, (tournament) =>
    tournament.addBlock(
      CompetitionId.create(),
      CompetitionName.from(name),
      BestOf.from(1),
      Rounds.from(1),
      byOf(world),
      now(world),
      { maximumHoops },
    ),
  );
}
