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
import { CompetitionPlayerWithdrawalReversed } from "../../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerWithdrawalReversed.js";
import { CompetitionPlayerWithdrawn } from "../../../../../../../src/domain/aggregates/tournaments/competitions/events/CompetitionPlayerWithdrawn.js";

When(
  "the player {string} is withdrawn",
  function (this: SpecWorld, name: string) {
    ask(this, (competition) => {
      competition.withdrawPlayer(
        playerNamed(this, competition, name).id,
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the player {string} is withdrawn by their id",
  function (this: SpecWorld, id: string) {
    ask(this, (competition) => {
      competition.withdrawPlayer(
        CompetitionPlayerId.from(id),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the withdrawal of the player {string} is reversed",
  function (this: SpecWorld, name: string) {
    ask(this, (competition) => {
      competition.reverseWithdrawal(
        playerNamed(this, competition, name).id,
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

When(
  "the withdrawal of the player {string} is reversed by their id",
  function (this: SpecWorld, id: string) {
    ask(this, (competition) => {
      competition.reverseWithdrawal(
        CompetitionPlayerId.from(id),
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);

Then(
  "the first thing it recorded is a player withdrawing",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, CompetitionPlayerWithdrawn);
  },
);

Then(
  "the first thing it recorded is a player's withdrawal being reversed",
  function (this: SpecWorld) {
    assertRecordedAt(this, 0, CompetitionPlayerWithdrawalReversed);
  },
);
