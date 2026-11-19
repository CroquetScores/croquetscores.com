import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ApiKeyId } from "../../../../../../src/domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyRevoked } from "../../../../../../src/domain/aggregates/accounts/events/ApiKeyRevoked.js";
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

Given("the key was revoked", function (this: SpecWorld) {
  streamOf(this).push(new ApiKeyRevoked(A_KEY_ID, idOf(this), now(this)));
});

When("the account revokes the key", async function (this: SpecWorld) {
  await ask(this, (account) =>
    account.revokeApiKey(ApiKeyId.from(A_KEY_ID), now(this)),
  );
});

Then(
  "the first thing it recorded is a key being revoked",
  function (this: SpecWorld) {
    assertFirstRecorded(this, ApiKeyRevoked);
  },
);

Then(
  "the key being revoked says the key it was made as",
  function (this: SpecWorld) {
    assert.equal(assertFirstRecorded(this, ApiKeyRevoked).keyId, A_KEY_ID);
  },
);

Then("the key is revoked", function (this: SpecWorld) {
  const key = accountOf(this).apiKeys.find((each) => each.id === A_KEY_ID);
  assert.ok(key !== undefined, "The account has no such key.");
  assert.equal(key.revoked, true);
});
