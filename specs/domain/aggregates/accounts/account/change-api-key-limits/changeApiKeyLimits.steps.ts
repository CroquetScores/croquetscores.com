import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import { ApiKeyId } from "../../../../../../src/domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyLimitsChanged } from "../../../../../../src/domain/aggregates/accounts/events/ApiKeyLimitsChanged.js";
import { ApiKeyLimits } from "../../../../../../src/domain/aggregates/accounts/value-objects/ApiKeyLimits.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  A_KEY_ID,
  accountOf,
  ask,
  assertFirstRecorded,
  now,
  streamOf,
} from "../anAccount.js";

// An account that is not the one asked, as an administrator is.
const THE_ADMINISTRATOR = AccountId.from(
  "account/9b2f1c4e-6d3a-4e8b-a1c7-5f0e2d4b6a80",
);

Given(
  "the limits of the key were changed to {int} requests a minute and {int} a day",
  function (this: SpecWorld, perMinute: number, perDay: number) {
    streamOf(this).push(
      new ApiKeyLimitsChanged(
        A_KEY_ID,
        perMinute,
        perDay,
        THE_ADMINISTRATOR,
        now(this),
      ),
    );
  },
);

When(
  "the limits of the key are changed to {int} requests a minute and {int} a day",
  async function (this: SpecWorld, perMinute: number, perDay: number) {
    await ask(this, (account) =>
      account.changeApiKeyLimits(
        ApiKeyId.from(A_KEY_ID),
        ApiKeyLimits.from(perMinute, perDay),
        THE_ADMINISTRATOR,
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is the limits of a key being changed",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ApiKeyLimitsChanged);
  },
);

Then(
  "the limits being changed say {int} requests a minute and {int} a day",
  function (this: SpecWorld, perMinute: number, perDay: number) {
    const changed = assertFirstRecorded(this, ApiKeyLimitsChanged);
    assert.equal(changed.perMinute, perMinute);
    assert.equal(changed.perDay, perDay);
  },
);

Then(
  "the limits being changed were caused by whoever changed them",
  function (this: SpecWorld) {
    assert.ok(
      assertFirstRecorded(this, ApiKeyLimitsChanged).createdBy.equals(
        THE_ADMINISTRATOR,
      ),
    );
  },
);

Then(
  "the account's key is allowed {int} requests a minute",
  function (this: SpecWorld, count: number) {
    const key = accountOf(this).apiKeys.find((each) => each.id === A_KEY_ID);
    assert.equal(key?.limits.perMinute, count);
  },
);

Then(
  "the account's key is allowed {int} requests a day",
  function (this: SpecWorld, count: number) {
    const key = accountOf(this).apiKeys.find((each) => each.id === A_KEY_ID);
    assert.equal(key?.limits.perDay, count);
  },
);
