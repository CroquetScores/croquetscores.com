import { Then, When } from "@cucumber/cucumber";

import { SignedIn } from "../../../../../../src/domain/aggregates/accounts/events/SignedIn.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, now } from "../anAccount.js";

When("the account is signed in to", async function (this: SpecWorld) {
  await ask(this, (account) => account.signIn(now(this)));
});

Then(
  "the first thing it recorded is its signing in",
  function (this: SpecWorld) {
    assertFirstRecorded(this, SignedIn);
  },
);
