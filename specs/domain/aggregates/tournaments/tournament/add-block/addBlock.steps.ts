import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { BlockAdded } from "../../../../../../src/domain/aggregates/tournaments/events/BlockAdded.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { BestOf } from "../../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Rounds } from "../../../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionIdOf,
  competitionNamed,
  happened,
  now,
  scenarioOf,
  tournamentOf,
} from "../aTournament.js";

Given(
  "the block {string} was added to it as {string}",
  function (this: SpecWorld, name: string, id: string) {
    happened(this, (tournament) =>
      tournament.addBlock(
        CompetitionId.from(id),
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(1),
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the block {string} was added to it to be played in {int} rounds",
  function (this: SpecWorld, name: string, rounds: number) {
    happened(this, (tournament) =>
      tournament.addBlock(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(rounds),
        byOf(this),
        now(this),
      ),
    );
  },
);

// Competitions with every slug from `from` to `to`, each with a name of its
// own that makes none of them, so that the next competition is refused each
// of those slugs and nothing else. They are recorded as they would have been
// had the tournament given them those slugs, since no name it could be given
// would make them all.
Given(
  "a competition was added to it with every slug from {string} to {string}",
  function (this: SpecWorld, from: string, to: string) {
    const last = /^(.*)-(\d{2})$/.exec(to);
    assert.ok(
      last !== null && last[1] === from,
      `${to} is not ${from} numbered.`,
    );
    const slugs = [
      from,
      ...Array.from(
        { length: Number(last[2]) },
        (_, at) => `${from}-${String(at + 1).padStart(2, "0")}`,
      ),
    ];
    const scenario = scenarioOf(this);
    slugs.forEach((slug, at) => {
      scenario.later.push(
        new BlockAdded(
          CompetitionId.create().value,
          `Taken ${at + 1}`,
          slug,
          (at + 1) * 10_000,
          1,
          1,
          false,
          false,
          true,
          undefined,
          byOf(this),
          now(this),
        ),
      );
    });
  },
);

Given("the competition id {string}", function (this: SpecWorld, id: string) {
  scenarioOf(this).competition.id = id;
});

Given(
  "the block is to be the best of {int}",
  function (this: SpecWorld, games: number) {
    scenarioOf(this).competition.bestOf = games;
  },
);

Given(
  "the block is to be played in {int} rounds",
  function (this: SpecWorld, rounds: number) {
    scenarioOf(this).competition.rounds = rounds;
  },
);

When("the block {string} is added", function (this: SpecWorld, name: string) {
  const { bestOf, rounds } = scenarioOf(this).competition;
  ask(this, (tournament) =>
    tournament.addBlock(
      competitionIdOf(this),
      CompetitionName.from(name),
      BestOf.from(bestOf ?? 1),
      // Played once, where the scenario says nothing else.
      Rounds.from(rounds ?? 1),
      byOf(this),
      now(this),
      scenarioOf(this).competition.rules,
    ),
  );
});

Then(
  "the first thing it recorded is a block being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, BlockAdded);
  },
);

Then(
  "the tournament's competition {string} is known by {string}",
  function (this: SpecWorld, name: string, id: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).reference.id.value,
      id,
    );
  },
);
