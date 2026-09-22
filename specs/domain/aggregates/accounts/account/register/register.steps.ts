import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Account } from "../../../../../../src/domain/aggregates/accounts/Account.js";
import { AccountRegistered } from "../../../../../../src/domain/aggregates/accounts/events/AccountRegistered.js";
import { EmailAddress } from "../../../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  addressHashOf,
  assertFirstRecorded,
  begin,
  idOf,
  now,
} from "../anAccount.js";

const register = (
  world: SpecWorld,
  address: string,
  addressHash: string,
): Promise<void> =>
  begin(
    world,
    Account.register(
      idOf(world),
      EmailAddress.from(address),
      addressHash,
      now(world),
    ),
  );

When(
  "an account is registered at {string}",
  async function (this: SpecWorld, address: string) {
    await register(this, address, addressHashOf(this, address));
  },
);

When(
  "an account is registered at {string} with the email address hash {string}",
  async function (this: SpecWorld, address: string, addressHash: string) {
    await register(this, address, addressHash);
  },
);

Then(
  "the first thing it recorded is its registering",
  function (this: SpecWorld) {
    assertFirstRecorded(this, AccountRegistered);
  },
);

Then(
  "its registering says the email address hash {string}",
  function (this: SpecWorld, addressHash: string) {
    assert.equal(
      assertFirstRecorded(this, AccountRegistered).emailAddressHash,
      addressHash,
    );
  },
);
