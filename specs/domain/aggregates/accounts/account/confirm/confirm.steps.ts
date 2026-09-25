import { Then, When } from "@cucumber/cucumber";

import { EmailAddressConfirmed } from "../../../../../../src/domain/aggregates/accounts/events/EmailAddressConfirmed.js";
import { PersonName } from "../../../../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  A_NAME,
  A_PASSWORD_HASH,
  ask,
  assertFirstRecorded,
  hashOf,
  now,
} from "../anAccount.js";

const confirm = (
  world: SpecWorld,
  name: string,
  passwordHash: string | undefined,
): Promise<void> =>
  ask(world, (account) =>
    account.confirm(PersonName.from(name), passwordHash, now(world)),
  );

When(
  "the account's email address is confirmed as {string}",
  async function (this: SpecWorld, name: string) {
    await confirm(this, name, A_PASSWORD_HASH);
  },
);

When(
  "the account's email address is confirmed with the password hash {string}",
  async function (this: SpecWorld, passwordHash: string) {
    await confirm(this, A_NAME, passwordHash);
  },
);

When(
  "the account's email address is confirmed with no password",
  async function (this: SpecWorld) {
    await confirm(this, A_NAME, undefined);
  },
);

When(
  "the account's email address is confirmed with the password {string}",
  async function (this: SpecWorld, password: string) {
    await confirm(this, A_NAME, hashOf(password));
  },
);

Then(
  "the first thing it recorded is its email address being confirmed",
  function (this: SpecWorld) {
    assertFirstRecorded(this, EmailAddressConfirmed);
  },
);
