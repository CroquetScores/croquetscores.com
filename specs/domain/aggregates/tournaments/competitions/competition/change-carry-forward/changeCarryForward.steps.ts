import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CompetitionPlayerCarryForwardChanged } from "../../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerCarryForwardChanged.js";
import { CompetitionPlayerId } from "../../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import {
  COUNT,
  NUMBER,
  countCalled,
  pendingCounts,
} from "../../value-objects/carry-forward/aCarryForward.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  competitionOf,
  happened,
  now,
  playerNamed,
  toldOf,
} from "../aCompetition.js";

Given(
  new RegExp(
    `^the player "([^"]*)" was given a carry forward of ${COUNT} of ${NUMBER}$`,
  ),
  function (this: SpecWorld, name: string, count: string, value: string) {
    happened(this, (competition) => {
      competition.changeCarryForward(
        playerNamed(this, competition, name).id,
        { [countCalled(count)]: Number(value) },
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} is given the carry forward",
  function (this: SpecWorld, name: string) {
    ask(this, (competition) => {
      competition.changeCarryForward(
        playerNamed(this, competition, name).id,
        pendingCounts(this),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} is given the carry forward by their id",
  function (this: SpecWorld, id: string) {
    ask(this, (competition) => {
      competition.changeCarryForward(
        CompetitionPlayerId.from(id),
        pendingCounts(this),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

Then(
  "the first thing it recorded is a player's carry forward being changed",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, CompetitionPlayerCarryForwardChanged);
  },
);

const carryForwardOf = (world: SpecWorld, name: string) =>
  playerNamed(world, competitionOf(world), name).carryForward;

Then(
  new RegExp(
    `^the competition's player "([^"]*)" carries forward ${COUNT} of ${NUMBER}$`,
  ),
  function (this: SpecWorld, name: string, count: string, value: string) {
    assert.equal(
      carryForwardOf(this, name).of(countCalled(count)),
      Number(value),
    );
  },
);

Then(
  new RegExp(
    `^the competition's player "([^"]*)" carries forward nothing in ${COUNT}$`,
  ),
  function (this: SpecWorld, name: string, count: string) {
    assert.equal(carryForwardOf(this, name).of(countCalled(count)), undefined);
  },
);

Then(
  "the competition's player {string} carries nothing forward",
  function (this: SpecWorld, name: string) {
    assert.equal(carryForwardOf(this, name).carriesAnything, false);
  },
);
