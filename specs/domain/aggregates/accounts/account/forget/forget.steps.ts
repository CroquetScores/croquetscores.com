import { Then, When } from "@cucumber/cucumber";

import { AccountForgotten } from "../../../../../../src/domain/aggregates/accounts/events/AccountForgotten.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, now } from "../anAccount.js";

When("the account is forgotten", async function (this: SpecWorld) {
  await ask(this, (account) => account.forget(now(this)));
});

Then(
  "the first thing it recorded is its being forgotten",
  function (this: SpecWorld) {
    assertFirstRecorded(this, AccountForgotten);
  },
);
