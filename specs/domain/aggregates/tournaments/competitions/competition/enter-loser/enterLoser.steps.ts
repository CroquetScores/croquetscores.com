import { strict as assert } from "node:assert";

import { Given, Then, When } from "@cucumber/cucumber";

import type { Competition } from "../../../../../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import type { Match } from "../../../../../../../src/domain/aggregates/tournaments/competitions/KnockoutPlay.js";
import { CompetitionId } from "../../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { KnockoutDraw } from "../../../../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import { positionOf } from "../../../ordinals.js";
import {
  ask,
  byOf,
  competitionOf,
  happened,
  now,
  scenarioOf,
  toldOf,
  tournamentPlayerNamed,
} from "../aCompetition.js";

Given(
  "the competition is a losers knockout of {int} places, each round the best of {int}",
  function (this: SpecWorld, places: number, games: number) {
    const scenario = scenarioOf(this);
    scenario.told = {
      ...scenario.told,
      shape: {
        kind: "knockout",
        draw: KnockoutDraw.from(
          places,
          Array.from({ length: Math.log2(places) }, () => games),
        ),
        losersOf: { competitionId: CompetitionId.create(), round: 0 },
      },
    };
  },
);

const enter = (
  world: SpecWorld,
  competition: Competition,
  name: string | undefined,
  ordinal: string,
): void =>
  competition.enterLoser(
    name === undefined ? undefined : tournamentPlayerNamed(world, name),
    positionOf(ordinal),
    toldOf(world),
    byOf(world),
    now(world),
  );

Given(
  "the loser {string} was entered in the {word} place",
  function (this: SpecWorld, name: string, ordinal: string) {
    happened(this, (competition) => enter(this, competition, name, ordinal));
  },
);

Given(
  "a bye was entered as the loser in the {word} place",
  function (this: SpecWorld, ordinal: string) {
    happened(this, (competition) =>
      enter(this, competition, undefined, ordinal),
    );
  },
);

When(
  "the loser {string} is entered in the {word} place",
  function (this: SpecWorld, name: string, ordinal: string) {
    ask(this, (competition) => enter(this, competition, name, ordinal));
  },
);

When(
  "a bye is entered as the loser in the {word} place",
  function (this: SpecWorld, ordinal: string) {
    ask(this, (competition) => enter(this, competition, undefined, ordinal));
  },
);

// Kept here rather than on the world, which has no business knowing what a
// knockout's match is.
const worked = new WeakMap<SpecWorld, readonly Match[]>();

When("the competition's matches are worked out", function (this: SpecWorld) {
  worked.set(this, competitionOf(this).knockoutMatches(toldOf(this)));
});

const sideOf = (world: SpecWorld, which: string, match: string) => {
  const found = worked.get(world)?.[positionOf(match)];
  assert.ok(found !== undefined, "The competition has no such match.");
  return found.sides[positionOf(which)] as Match["sides"][number];
};

Then(
  /^the (first|second) side of the (first|second) match is (nobody|not yet known)$/,
  function (this: SpecWorld, which: string, match: string, kind: string) {
    assert.equal(sideOf(this, which, match).is, kind);
  },
);

Then(
  /^the (first|second) side of the (first|second) match is "([^"]*)"$/,
  function (this: SpecWorld, which: string, match: string, name: string) {
    const side = sideOf(this, which, match);
    assert.ok(side.is === "player", `The side is ${side.is}.`);
    assert.ok(
      side.player.tournamentPlayerId.equals(tournamentPlayerNamed(this, name)),
      `The side is another player than ${name}.`,
    );
  },
);

When(
  "the {word} place is cleared",
  function (this: SpecWorld, ordinal: string) {
    ask(this, (competition) =>
      competition.clearLoser(
        positionOf(ordinal),
        toldOf(this),
        byOf(this),
        now(this),
      ),
    );
  },
);
