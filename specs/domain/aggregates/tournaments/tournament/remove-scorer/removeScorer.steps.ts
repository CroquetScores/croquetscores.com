import { Then, When } from "@cucumber/cucumber";

import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import { ScorerRemoved } from "../../../../../../src/domain/aggregates/tournaments/events/ScorerRemoved.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

When(
  "the account {string} is taken off the scorers",
  function (this: SpecWorld, account: string) {
    ask(this, (tournament) =>
      tournament.removeScorer(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a scorer being taken off",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ScorerRemoved);
  },
);
