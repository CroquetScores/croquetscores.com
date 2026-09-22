import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Account } from "../../../../../../src/domain/aggregates/accounts/Account.js";
import { AccountBroughtOver } from "../../../../../../src/domain/aggregates/accounts/events/AccountBroughtOver.js";
import { EmailAddress } from "../../../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  AN_OLD_SITE_HASH,
  addressHashOf,
  assertFirstRecorded,
  begin,
  idOf,
  now,
} from "../anAccount.js";

const bringOver = (
  world: SpecWorld,
  name: string,
  address: string,
  {
    passwordHash = AN_OLD_SITE_HASH,
    addressHash = addressHashOf(world, address),
  }: { passwordHash?: string; addressHash?: string } = {},
): Promise<void> =>
  begin(
    world,
    Account.bringOver(
      idOf(world),
      PersonName.from(name),
      EmailAddress.from(address),
      addressHash,
      passwordHash,
      now(world),
    ),
  );

When(
  "an account is brought over as {string} at {string}",
  async function (this: SpecWorld, name: string, address: string) {
    await bringOver(this, name, address);
  },
);

When(
  "an account is brought over as {string} at {string} with the password hash {string}",
  async function (
    this: SpecWorld,
    name: string,
    address: string,
    passwordHash: string,
  ) {
    await bringOver(this, name, address, { passwordHash });
  },
);

When(
  "an account is brought over as {string} at {string} with the email address hash {string}",
  async function (
    this: SpecWorld,
    name: string,
    address: string,
    addressHash: string,
  ) {
    await bringOver(this, name, address, { addressHash });
  },
);

Then(
  "the first thing it recorded is its being brought over",
  function (this: SpecWorld) {
    assertFirstRecorded(this, AccountBroughtOver);
  },
);

Then(
  "its being brought over says the email address hash {string}",
  function (this: SpecWorld, addressHash: string) {
    assert.equal(
      assertFirstRecorded(this, AccountBroughtOver).emailAddressHash,
      addressHash,
    );
  },
);
