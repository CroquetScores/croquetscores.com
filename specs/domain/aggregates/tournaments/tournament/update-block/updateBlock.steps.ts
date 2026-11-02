import { Given, Then, When } from "@cucumber/cucumber";

import { BlockUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/BlockUpdated.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { TieBreak } from "../../../../../../src/domain/aggregates/tournaments/value-objects/TieBreak.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionNamed,
  happened,
  nameAndBestOf,
  now,
  scenarioOf,
} from "../aTournament.js";

// The rounds the scenario's update says a block is played in, and otherwise
// the rounds `found` already is.
const roundsOf = (
  world: SpecWorld,
  found: ReturnType<typeof competitionNamed> | undefined,
): Rounds => {
  const said = scenarioOf(world).competitionUpdate.rounds;
  if (said !== undefined) return Rounds.from(said);
  return found?.shape.kind === "block" ? found.shape.rounds : Rounds.from(1);
};

// The tie break the scenario's update says a block goes by, and otherwise
// none, which leaves the block going by what it went by.
const tieBreakOf = (world: SpecWorld): TieBreak | undefined => {
  const said = scenarioOf(world).competitionUpdate.tieBreak;
  return said === undefined ? undefined : TieBreak.from(said);
};

Given(
  "the block {string} was added to it as the best of {int}",
  function (this: SpecWorld, name: string, games: number) {
    happened(this, (tournament) =>
      tournament.addBlock(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(games),
        Rounds.from(1),
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the update makes the block go by the tie break {string}",
  function (this: SpecWorld, code: string) {
    scenarioOf(this).competitionUpdate.tieBreak = code;
  },
);

Given(
  "the block {string} was updated",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) => {
      const found = competitionNamed(tournament, name);
      tournament.updateBlock(
        found.reference.id,
        found.reference.name,
        found.shape.kind === "block" ? found.shape.bestOf : BestOf.from(1),
        roundsOf(this, found),
        byOf(this),
        now(this),
        undefined,
        tieBreakOf(this),
      );
    });
  },
);

Given(
  "the block {string} was updated to be called {string}",
  function (this: SpecWorld, name: string, called: string) {
    happened(this, (tournament) => {
      const found = competitionNamed(tournament, name);
      const bestOf =
        found.shape.kind === "block" ? found.shape.bestOf : BestOf.from(1);
      tournament.updateBlock(
        found.reference.id,
        CompetitionName.from(called),
        bestOf,
        roundsOf(this, found),
        byOf(this),
        now(this),
      );
    });
  },
);

When("the block {string} is updated", function (this: SpecWorld, name: string) {
  ask(this, (tournament) => {
    const found = competitionNamed(tournament, name);
    const { name: called, bestOf } = nameAndBestOf(this, found);
    tournament.updateBlock(
      found.reference.id,
      called,
      bestOf,
      roundsOf(this, found),
      byOf(this),
      now(this),
      scenarioOf(this).competitionUpdate.rules,
      tieBreakOf(this),
    );
  });
});

When(
  "the block {string} is updated by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) => {
      const { name, bestOf } = nameAndBestOf(this, undefined);
      tournament.updateBlock(
        CompetitionId.from(id),
        name,
        bestOf,
        roundsOf(this, undefined),
        byOf(this),
        now(this),
        scenarioOf(this).competitionUpdate.rules,
        tieBreakOf(this),
      );
    });
  },
);

Then(
  "the first thing it recorded is a block being updated",
  function (this: SpecWorld) {
    assertFirstRecorded(this, BlockUpdated);
  },
);
