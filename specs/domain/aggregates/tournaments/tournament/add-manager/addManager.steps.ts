import { Then, When } from "@cucumber/cucumber";

import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import { ManagerAdded } from "../../../../../../src/domain/aggregates/tournaments/events/ManagerAdded.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

When(
  "the account {string} is made a manager",
  function (this: SpecWorld, account: string) {
    ask(this, (tournament) =>
      tournament.addManager(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a manager being made",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ManagerAdded);
  },
);
