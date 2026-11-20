import { When, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ApiKeyId } from "../../../../src/domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyLabel } from "../../../../src/domain/aggregates/accounts/value-objects/ApiKeyLabel.js";
import { ApiKeyLimits } from "../../../../src/domain/aggregates/accounts/value-objects/ApiKeyLimits.js";
import { ApiKeyScope } from "../../../../src/domain/aggregates/accounts/value-objects/ApiKeyScope.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { isRole } from "../../../../src/domain/aggregates/accounts/value-objects/Role.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import { accountsOf, readBack } from "../../support/accounts.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What an account's read models keep of when a row changed is read straight
// from their tables, since nothing in the application asks it yet. Who is meant
// is said by the address the account was registered with.

const idOf = (world: SpecWorld, address: string) => {
  const id = accountsOf(world).byAddress.get(
    EmailAddress.from(address).comparable,
  )?.[0];
  assert.ok(id !== undefined, `No account was registered for ${address}.`);
  return id;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const done = async (
  world: SpecWorld,
  address: string,
  change: (account: Awaited<ReturnType<typeof readBack>>) => void,
): Promise<void> => {
  const account = await readBack(world, idOf(world, address));
  change(account);
  await world.keepAccount?.(account);
};

When(
  "the account for {string} has the Google account {string} linked",
  async function (this: SpecWorld, address: string, subject: string) {
    await done(this, address, (account) => {
      account.linkGoogleAccount(subject, momentOf(this));
    });
  },
);

When(
  "the account for {string} is given the role {string}",
  async function (this: SpecWorld, address: string, role: string) {
    assert.ok(isRole(role), `${role} is not a role.`);
    await done(this, address, (account) => {
      account.addRole(role, account.id, momentOf(this));
    });
  },
);

When(
  "the account for {string} makes an API key",
  async function (this: SpecWorld, address: string) {
    await done(this, address, (account) => {
      account.createApiKey(
        ApiKeyId.create(),
        `hash-of-a-key-${String(Math.random())}`,
        ApiKeyLabel.from("A key"),
        ApiKeyScope.from("read"),
        undefined,
        ApiKeyLimits.usual(),
        momentOf(this),
      );
    });
  },
);

const tables = {
  "email address": "accounts_by_email_address",
  "Google account": "accounts_by_google_account",
  role: "accounts_by_role",
  "API key": "accounts_by_api_key",
} as const;

Then(
  /^the (email address|Google account|role|API key) row of the account for "([^"]*)" was last changed at "([^"]*)"$/,
  async function (
    this: SpecWorld,
    which: keyof typeof tables,
    address: string,
    moment: string,
  ) {
    const id = idOf(this, address);
    const table = tables[which];
    const { rows } = await this.asARequest(() =>
      unitOfWorkOf(this)
        .connection()
        .query<{ changed_at: Date | null }>(
          `select changed_at from ${table} where account_id = $1`,
          [id.value],
        ),
    );
    const [row] = rows;
    assert.ok(row !== undefined, `The ${which} table has no row for it.`);
    assert.equal(row.changed_at?.toISOString(), new Date(moment).toISOString());
  },
);
