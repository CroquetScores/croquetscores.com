import { When, Then } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../../../support/world.js";
import {
  ask,
  assertRecordedAt,
  byOf,
  now,
  tournamentOrderOf,
  tournamentPlayerNamed,
  toldOf,
} from "../aCompetition.js";
import { CompetitionPlayerEntered } from "../../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerEntered.js";

When(
  "the tournament player {string} is entered",
  function (this: SpecWorld, name: string) {
    ask(this, (competition) => {
      competition.enterPlayer(
        tournamentPlayerNamed(this, name),
        tournamentOrderOf(this, name),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

Then(
  "the first thing it recorded is a player being entered",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, CompetitionPlayerEntered);
  },
);

Then(
  "the second thing it recorded is a player being entered",
  function (this: SpecWorld) {
    assertRecordedAt(this, 1, CompetitionPlayerEntered);
  },
);
