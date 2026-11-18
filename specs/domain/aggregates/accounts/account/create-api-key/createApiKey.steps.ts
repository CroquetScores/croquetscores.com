import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ApiKeyId } from "../../../../../../src/domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyCreated } from "../../../../../../src/domain/aggregates/accounts/events/ApiKeyCreated.js";
import { ApiKeyLabel } from "../../../../../../src/domain/aggregates/accounts/value-objects/ApiKeyLabel.js";
import { ApiKeyLimits } from "../../../../../../src/domain/aggregates/accounts/value-objects/ApiKeyLimits.js";
import { ApiKeyScope } from "../../../../../../src/domain/aggregates/accounts/value-objects/ApiKeyScope.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  A_KEY_ID,
  accountOf,
  ask,
  assertFirstRecorded,
  idOf,
  now,
  streamOf,
} from "../anAccount.js";

Given(
  "a key labelled {string} was made",
  function (this: SpecWorld, label: string) {
    streamOf(this).push(
      new ApiKeyCreated(
        A_KEY_ID,
        "the-hash-of-a-key",
        label,
        "read-and-write",
        undefined,
        60,
        10_000,
        idOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the account makes a key labelled {string}",
  async function (this: SpecWorld, label: string) {
    await ask(this, (account) =>
      account.createApiKey(
        ApiKeyId.from(A_KEY_ID),
        "the-hash-of-a-key",
        ApiKeyLabel.from(label),
        ApiKeyScope.from("read-and-write"),
        undefined,
        ApiKeyLimits.usual(),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a key being made",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ApiKeyCreated);
  },
);

Then(
  "the key being made says the label {string}",
  function (this: SpecWorld, label: string) {
    assert.equal(assertFirstRecorded(this, ApiKeyCreated).label, label);
  },
);

Then(
  "the key being made says the hash {string}",
  function (this: SpecWorld, hash: string) {
    assert.equal(assertFirstRecorded(this, ApiKeyCreated).keyHash, hash);
  },
);

Then(
  "the key being made says the scope {string}",
  function (this: SpecWorld, scope: string) {
    assert.equal(assertFirstRecorded(this, ApiKeyCreated).scope, scope);
  },
);

Then(
  "the key being made says {int} requests a minute and {int} a day",
  function (this: SpecWorld, perMinute: number, perDay: number) {
    const made = assertFirstRecorded(this, ApiKeyCreated);
    assert.equal(made.perMinute, perMinute);
    assert.equal(made.perDay, perDay);
  },
);

Then(
  "the key being made was caused by the account",
  function (this: SpecWorld) {
    assert.ok(
      assertFirstRecorded(this, ApiKeyCreated).createdBy.equals(idOf(this)),
    );
  },
);

Then("the account holds {int} key", function (this: SpecWorld, count: number) {
  assert.equal(accountOf(this).apiKeys.length, count);
});

Then("the account holds no keys", function (this: SpecWorld) {
  assert.equal(accountOf(this).apiKeys.length, 0);
});
