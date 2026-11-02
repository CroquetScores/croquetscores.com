import { strict as assert } from "node:assert";

import { Given, Then, When } from "@cucumber/cucumber";

import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Tournament } from "../../../../../../src/domain/aggregates/tournaments/Tournament.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { positionOf } from "../../ordinals.js";
import {
  ask,
  byOf,
  competitionNamed,
  happened,
  now,
  tournamentOf,
} from "../aTournament.js";

// "Nowhere" is a name no competition has, so that a scenario can ask for
// losers from a competition the tournament does not have.
const sourceNamed = (tournament: Tournament, name: string): CompetitionId =>
  tournament.competitions.find(({ reference }) =>
    reference.name.equals(CompetitionName.from(name)),
  )?.reference.id ?? CompetitionId.create();

const LOSERS_OF =
  'the losers knockout "([^"]*)" (?:was )?added for the losers of the (\\w+) round of "([^"]*)"';

Given(
  new RegExp(`^${LOSERS_OF}$`),
  function (this: SpecWorld, name: string, ordinal: string, from: string) {
    happened(this, (tournament) =>
      tournament.addLosersKnockout(
        CompetitionId.create(),
        CompetitionName.from(name),
        sourceNamed(tournament, from),
        positionOf(ordinal),
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  new RegExp(
    `^the losers knockout "([^"]*)" is added for the losers of the (\\w+) round of "([^"]*)"$`,
  ),
  function (this: SpecWorld, name: string, ordinal: string, from: string) {
    ask(this, (tournament) =>
      tournament.addLosersKnockout(
        CompetitionId.create(),
        CompetitionName.from(name),
        sourceNamed(tournament, from),
        positionOf(ordinal),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the tournament's competition {string} takes the losers of the {word} round of {string}",
  function (this: SpecWorld, name: string, ordinal: string, from: string) {
    const tournament = tournamentOf(this);
    const { shape } = competitionNamed(tournament, name);
    assert.ok(shape.kind === "knockout", `${name} is a ${shape.kind}.`);
    assert.ok(shape.losersOf !== undefined, `${name} takes no losers.`);
    assert.ok(
      shape.losersOf.competitionId.equals(sourceNamed(tournament, from)),
      `${name} takes the losers of another knockout.`,
    );
    assert.equal(shape.losersOf.round, positionOf(ordinal));
  },
);

Then(
  "the tournament's competition {string} takes the losers of nothing",
  function (this: SpecWorld, name: string) {
    const { shape } = competitionNamed(tournamentOf(this), name);
    assert.ok(shape.kind === "knockout", `${name} is a ${shape.kind}.`);
    assert.equal(shape.losersOf, undefined);
  },
);
