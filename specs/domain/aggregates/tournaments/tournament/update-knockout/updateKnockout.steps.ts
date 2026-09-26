import { Given, Then, When } from "@cucumber/cucumber";

import { KnockoutUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/KnockoutUpdated.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { CompetitionName } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  competitionNamed,
  drawOf,
  drawOfPlaces,
  happened,
  now,
  scenarioOf,
} from "../aTournament.js";

Given(
  "the knockout {string} was added to it with a draw of {int} places",
  function (this: SpecWorld, name: string, places: number) {
    happened(this, (tournament) =>
      tournament.addKnockout(
        CompetitionId.create(),
        CompetitionName.from(name),
        drawOfPlaces(places),
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the update gives the knockout a draw of {int} places",
  function (this: SpecWorld, places: number) {
    scenarioOf(this).drawPlaces = places;
  },
);

// Whatever asks for the draw to be changed says whether the change moves a
// player who has games, since where each player is in the draw is not the
// tournament's to know. It can only move one when the knockout has games.
Given(
  "the knockout {string} has games",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).competitionsWithGames.add(name);
  },
);

Given("the update moves no player who has games", function (this: SpecWorld) {
  scenarioOf(this).updateMovesAPlayerWithGames = false;
});

Given("the update moves a player who has games", function (this: SpecWorld) {
  scenarioOf(this).updateMovesAPlayerWithGames = true;
});

When(
  "the knockout {string} is updated",
  function (this: SpecWorld, name: string) {
    const scenario = scenarioOf(this);
    ask(this, (tournament) => {
      const found = competitionNamed(tournament, name);
      const draw =
        found.shape.kind === "knockout"
          ? drawOf(this, found.shape.draw)
          : drawOf(this);
      tournament.updateKnockout(
        found.reference.id,
        CompetitionName.from(
          scenario.competitionUpdate.name ?? found.reference.name.toString(),
        ),
        draw,
        scenario.competitionsWithGames.has(name) &&
          scenario.updateMovesAPlayerWithGames,
        byOf(this),
        now(this),
      );
    });
  },
);

Then(
  "the first thing it recorded is a knockout being updated",
  function (this: SpecWorld) {
    assertFirstRecorded(this, KnockoutUpdated);
  },
);
