import { Then, When } from "@cucumber/cucumber";

import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import { ScorerAdded } from "../../../../../../src/domain/aggregates/tournaments/events/ScorerAdded.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

When(
  "the account {string} is made a scorer",
  function (this: SpecWorld, account: string) {
    ask(this, (tournament) =>
      tournament.addScorer(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a scorer being made",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ScorerAdded);
  },
);
