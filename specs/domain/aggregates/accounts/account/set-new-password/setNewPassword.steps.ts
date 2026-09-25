import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { PasswordSet } from "../../../../../../src/domain/aggregates/accounts/events/PasswordSet.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  A_NEW_PASSWORD_HASH,
  accountOf,
  ask,
  assertFirstRecorded,
  at,
  hashOf,
  now,
} from "../anAccount.js";

const setNewPassword = (
  world: SpecWorld,
  passwordHash: string,
): Promise<void> =>
  ask(world, (account) => account.setNewPassword(passwordHash, now(world)));

When("a new password is set on the account", async function (this: SpecWorld) {
  await setNewPassword(this, A_NEW_PASSWORD_HASH);
});

When(
  "the new password {string} is set on the account",
  async function (this: SpecWorld, password: string) {
    await setNewPassword(this, hashOf(password));
  },
);

Then(
  "the first thing it recorded is its password being set",
  function (this: SpecWorld) {
    assertFirstRecorded(this, PasswordSet);
  },
);

Then(
  "the account's password hash is the one it was set with",
  function (this: SpecWorld) {
    assert.equal(accountOf(this).passwordHash, A_NEW_PASSWORD_HASH);
  },
);

Then(
  "the account's password was set at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(
      accountOf(this).passwordSetAt?.toDate().toISOString(),
      at(moment).toDate().toISOString(),
    );
  },
);

Then("the account's password was never set", function (this: SpecWorld) {
  assert.equal(accountOf(this).passwordSetAt, undefined);
});
