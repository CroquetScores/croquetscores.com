import { Then, When } from "@cucumber/cucumber";

import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import { ManagerRemoved } from "../../../../../../src/domain/aggregates/tournaments/events/ManagerRemoved.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, byOf, now } from "../aTournament.js";

When(
  "the account {string} is taken off the managers",
  function (this: SpecWorld, account: string) {
    ask(this, (tournament) =>
      tournament.removeManager(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a manager being taken off",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ManagerRemoved);
  },
);
