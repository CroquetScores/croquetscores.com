import { Given, When, Then } from "@cucumber/cucumber";

import { CompetitionPlayerId } from "../../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  happened,
  now,
  playerNamed,
  toldOf,
} from "../aCompetition.js";
import { CompetitionPlayerRemoved } from "../../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerRemoved.js";

When(
  "the player {string} is removed",
  function (this: SpecWorld, name: string) {
    ask(this, (competition) => {
      competition.removePlayer(
        playerNamed(this, competition, name).id,
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} is removed by their id",
  function (this: SpecWorld, id: string) {
    ask(this, (competition) => {
      competition.removePlayer(
        CompetitionPlayerId.from(id),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

// Named by its order, since every bye has the same id.
When(
  "the bye with the order {int} is removed",
  function (this: SpecWorld, order: number) {
    ask(this, (competition) => {
      competition.removeBye(order, toldOf(this), byOf(this), now(this));
    });
  },
);

// Before the scenario's own request, as the draw a knockout's game was added
// to is freed of a place.
Given(
  "the bye with the order {int} was removed from it",
  function (this: SpecWorld, order: number) {
    happened(this, (competition) => {
      competition.removeBye(order, toldOf(this), byOf(this), now(this));
    });
  },
);

Then(
  "the first thing it recorded is a player being removed",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, CompetitionPlayerRemoved);
  },
);
