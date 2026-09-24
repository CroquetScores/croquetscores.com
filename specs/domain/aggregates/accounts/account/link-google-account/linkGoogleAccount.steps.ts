import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { GoogleAccountLinked } from "../../../../../../src/domain/aggregates/accounts/events/GoogleAccountLinked.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, now } from "../anAccount.js";

When(
  "the Google account {string} is linked to the account",
  async function (this: SpecWorld, subject: string) {
    await ask(this, (account) => account.linkGoogleAccount(subject, now(this)));
  },
);

Then(
  "the first thing it recorded is a Google account being linked",
  function (this: SpecWorld) {
    assertFirstRecorded(this, GoogleAccountLinked);
  },
);

Then(
  "its Google account being linked says the subject {string}",
  function (this: SpecWorld, subject: string) {
    assert.equal(
      assertFirstRecorded(this, GoogleAccountLinked).subject,
      subject,
    );
  },
);
