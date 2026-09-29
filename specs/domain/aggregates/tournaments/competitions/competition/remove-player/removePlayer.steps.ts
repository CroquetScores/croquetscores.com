import { When, Then } from "@cucumber/cucumber";

import { CompetitionPlayerId } from "../../../../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { SpecWorld } from "../../../../../../support/world.js";
import {
  ask,
  assertRecordedAt,
  byOf,
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

Then(
  "the first thing it recorded is a player being removed",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, CompetitionPlayerRemoved);
  },
);
