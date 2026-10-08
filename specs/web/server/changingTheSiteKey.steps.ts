import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import {
  AccountKeys,
  AccountKeysRefused,
} from "../../../src/infrastructure/encryption/AccountKeys.js";
import type { SpecWorld } from "../../support/world.js";
import { applicationFor } from "../support/browser.js";

// What the scenario changed the key to, and what came of it.
const changes = new WeakMap<SpecWorld, { newKey: string; failure?: unknown }>();

const changeTo = async (world: SpecWorld, newKey: string): Promise<void> => {
  const change: { newKey: string; failure?: unknown } = { newKey };
  changes.set(world, change);
  try {
    await applicationFor(world).changeSiteKey(newKey);
  } catch (failure) {
    change.failure = failure;
  }
};

// The key a change is to, which is not the one the site has. Written out
// rather than made at random, so that a scenario that fails can be run again.
const A_NEW_KEY = "a-new-site-key-for-the-scenarios";

Given(
  "an email waiting with no account is altered where it is kept",
  async function (this: SpecWorld) {
    // Not an encryption anything made, so reading it with the site's key is
    // refused as having been changed.
    await this.database.query(
      `insert into email_queue (id, account_id, kind, language, sealed, due_at)
       values ('queued-by-the-scenario', null, 'Email.RegisterInstead', 'en', 'v1.bm90IGVuY3J5cHRlZA==', now())`,
    );
  },
);

When(
  "the application changes the site's key to a new one",
  async function (this: SpecWorld) {
    await changeTo(this, A_NEW_KEY);
  },
);

When(
  "the application changes the site's key to nothing",
  async function (this: SpecWorld) {
    await changeTo(this, "");
  },
);

Then(
  "the change is refused with {string}",
  function (this: SpecWorld, code: string) {
    const failure = changes.get(this)?.failure;
    assert.ok(
      failure instanceof AccountKeysRefused,
      `Expected a refusal, and got ${failure === undefined ? "none" : inspect(failure)}.`,
    );
    assert.equal(failure.code, code);
  },
);

// Whether the key `siteKey` reads the account's key, asked of a store made
// with it.
const asksWith = async (
  world: SpecWorld,
  address: string,
  siteKey: string,
): Promise<boolean> => {
  const application = applicationFor(world);
  const account = await application.unitOfWork.inReadOnlyTransaction(() =>
    application.accountsByEmailAddress.find(EmailAddress.from(address)),
  );
  assert.ok(account !== undefined, `No account is found for ${address}.`);
  const keys = new AccountKeys(application.unitOfWork, siteKey);
  return application.unitOfWork.inReadOnlyTransaction(() =>
    keys.hasKey(account),
  );
};

const newKey = (world: SpecWorld): string => {
  const change = changes.get(world);
  assert.ok(change !== undefined, "The site's key was not changed.");
  return change.newKey;
};

const oldKey = (world: SpecWorld): string => {
  const key = applicationFor(world).config.accountEncryptionKey;
  assert.ok(key !== undefined, "The site has no key.");
  return key;
};

Then(
  "the account for {string} has a key that the new site's key reads",
  async function (this: SpecWorld, address: string) {
    assert.ok(await asksWith(this, address, newKey(this)));
  },
);

Then(
  "the account for {string} has a key that the old site's key reads",
  async function (this: SpecWorld, address: string) {
    assert.ok(await asksWith(this, address, oldKey(this)));
  },
);

const refusedWith = async (
  world: SpecWorld,
  address: string,
  siteKey: string,
  code: string,
): Promise<void> => {
  try {
    await asksWith(world, address, siteKey);
  } catch (failure) {
    assert.ok(failure instanceof AccountKeysRefused, inspect(failure));
    assert.equal(failure.code, code);
    return;
  }
  assert.fail("The key was not refused.");
};

Then(
  "the account for {string} has a key that the old site's key refuses with {string}",
  async function (this: SpecWorld, address: string, code: string) {
    await refusedWith(this, address, oldKey(this), code);
  },
);

Then(
  "the account for {string} has a key that the new site's key refuses with {string}",
  async function (this: SpecWorld, address: string, code: string) {
    await refusedWith(this, address, newKey(this), code);
  },
);
