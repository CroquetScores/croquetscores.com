import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { FacebookAccountLinked } from "../../../../../../src/domain/aggregates/accounts/events/FacebookAccountLinked.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, now } from "../anAccount.js";

When(
  "the Facebook account {string} is linked to the account",
  async function (this: SpecWorld, facebookId: string) {
    await ask(this, (account) =>
      account.linkFacebookAccount(facebookId, now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a Facebook account being linked",
  function (this: SpecWorld) {
    assertFirstRecorded(this, FacebookAccountLinked);
  },
);

Then(
  "its Facebook account being linked says the id {string}",
  function (this: SpecWorld, facebookId: string) {
    assert.equal(
      assertFirstRecorded(this, FacebookAccountLinked).facebookId,
      facebookId,
    );
  },
);
