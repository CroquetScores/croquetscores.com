import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { PasswordHashedAgain } from "../../../../../../src/domain/aggregates/accounts/events/PasswordHashedAgain.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  A_BETTER_HASH,
  accountOf,
  ask,
  assertFirstRecorded,
  hashOf,
  now,
} from "../anAccount.js";

const hashAgain = (world: SpecWorld, passwordHash: string): Promise<void> =>
  ask(world, (account) => account.hashPasswordAgain(passwordHash, now(world)));

When("its password is hashed again", async function (this: SpecWorld) {
  await hashAgain(this, A_BETTER_HASH);
});

When(
  "its password {string} is hashed again",
  async function (this: SpecWorld, password: string) {
    await hashAgain(this, hashOf(password));
  },
);

Then(
  "the first thing it recorded is its password being hashed again",
  function (this: SpecWorld) {
    assertFirstRecorded(this, PasswordHashedAgain);
  },
);

Then(
  "the account's password hash is the one it was hashed again with",
  function (this: SpecWorld) {
    assert.equal(accountOf(this).passwordHash, A_BETTER_HASH);
  },
);
