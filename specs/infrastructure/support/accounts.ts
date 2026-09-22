// What stands behind a scenario that keeps accounts: the account key store with
// a site's key, the Postgres event store sealing what is personal in an
// account's events with it, and the accounts by email address read model kept
// in step with every append. And the steps the account keys' feature and the
// read model's feature share: registering, forgetting and looking accounts up.
//
// Here rather than in specs/support/ because it names infrastructure, and
// specs/support/ is loaded by every spec in the repository and so may not.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomBytes } from "node:crypto";

import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import { nameAccountEvents } from "../../../src/domain/aggregates/accounts/events/accountEvents.js";
import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import { EventRegistry } from "../../../src/domain/common/EventRegistry.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { AccountEventSealing } from "../../../src/infrastructure/encryption/AccountEventSealing.js";
import { AccountKeys } from "../../../src/infrastructure/encryption/AccountKeys.js";
import { KeyedEmailAddressHasher } from "../../../src/infrastructure/encryption/KeyedEmailAddressHasher.js";
import { PostgresEventStore } from "../../../src/infrastructure/event-store/PostgresEventStore.js";
import { AccountsByEmailAddress } from "../../../src/infrastructure/read-models/AccountsByEmailAddress.js";
import type { SpecWorld } from "../../support/world.js";
import { unitOfWorkOf } from "./transactions.js";

export interface Accounts {
  siteKey: string;
  keys: AccountKeys;
  store: PostgresEventStore;
  readModel: AccountsByEmailAddress;
  hasher: KeyedEmailAddressHasher;
  /** Every account kept, in the order they were first kept. */
  readonly kept: AccountId[];
  /** Every account registered for an address, in order, by the address. */
  readonly byAddress: Map<string, AccountId[]>;
}

const accounts = new WeakMap<SpecWorld, Accounts>();

export const accountsOf = (world: SpecWorld): Accounts => {
  const found = accounts.get(world);
  assert.ok(found !== undefined, "The scenario keeps no accounts.");
  return found;
};

/** A site's key as dev-setup makes one: 32 random bytes. */
export const aSiteKey = (): string => randomBytes(32).toString("base64");

// The store and the key store the scenario reads and writes through, made with
// `siteKey`. Made again, over the same database, when a scenario changes the
// site's key, as the application would be when started with the new one.
export const storesFor = (
  world: SpecWorld,
  siteKey: string,
): { keys: AccountKeys; store: PostgresEventStore } => {
  const keys = new AccountKeys(unitOfWorkOf(world), siteKey);
  const store = new PostgresEventStore(
    unitOfWorkOf(world),
    nameAccountEvents(new EventRegistry()),
    new AccountEventSealing(keys),
  );
  return { keys, store };
};

/**
 * Puts together what a scenario keeps accounts with, with `siteKey`, and has
 * every account the scenario registers or changes kept through it.
 */
export const keepAccounts = (world: SpecWorld, siteKey: string): Accounts => {
  const unitOfWork = unitOfWorkOf(world);
  const hasher = new KeyedEmailAddressHasher(aSiteKey());
  const readModel = new AccountsByEmailAddress(unitOfWork, hasher);
  const { keys, store } = storesFor(world, siteKey);
  const kept: Accounts = {
    siteKey,
    keys,
    store,
    readModel,
    hasher,
    kept: [],
    byAddress: new Map(),
  };
  accounts.set(world, kept);

  world.asARequest = (work) => unitOfWork.inTransaction(work);
  world.account ??= AccountId.create();
  world.moment ??= new Date("2026-09-19T10:00:00Z");
  world.hashEmailAddress = (address) => hasher.hash(EmailAddress.from(address));
  world.keepAccount = async (account) => {
    const expected = account.expectedVersion;
    const events = account.handOver();
    if (events.length === 0) return;
    const projecting = new ProjectingEventStore(kept.store, [readModel]);
    await world.asARequest(() =>
      projecting.appendEvents(account.id, expected, events),
    );
    // An account kept for the first time is registered, whichever step
    // registered it, and is found afterwards by the address it was kept at.
    if (!kept.kept.some((id) => id.equals(account.id))) {
      kept.kept.push(account.id);
      const address = account.emailAddress.comparable;
      kept.byAddress.set(address, [
        ...(kept.byAddress.get(address) ?? []),
        account.id,
      ]);
    }
  };
  return kept;
};

/** The account kept `position`th, counting from 1. */
export const keptAt = (world: SpecWorld, position: number): AccountId => {
  const id = accountsOf(world).kept[position - 1];
  assert.ok(id !== undefined, `No account was kept ${position}th.`);
  return id;
};

/** The account `id`, as its stream reads back now. */
export const readBack = async (
  world: SpecWorld,
  id: AccountId,
  store = accountsOf(world).store,
): Promise<Account> =>
  Account.rebuiltFrom(id, await world.asARequest(() => store.getEvents(id)));

/**
 * Registers a new account for `address`, and keeps it. A registering refused
 * is the scenario's to judge, so it is kept as the failure rather than thrown.
 */
export const registerFor = async (
  world: SpecWorld,
  address: string,
  id = AccountId.create(),
): Promise<void> => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  const account = Account.register(
    id,
    EmailAddress.from(address),
    world.hashEmailAddress?.(address) ?? "",
    ReadOnlyDate.from(world.moment),
  );
  world.aggregate = account;
  try {
    await world.keepAccount?.(account);
  } catch (failure) {
    world.failure = failure;
  }
};

const registeredFor = (world: SpecWorld, address: string): AccountId[] =>
  accountsOf(world).byAddress.get(EmailAddress.from(address).comparable) ?? [];

// Registering and forgetting -----------------------------------------------

// Brought over rather than registered: the account was somebody's on the old
// site, and arrives with the name, the address and the password hash it had
// there.
Given(
  "an account for {string} is brought over from the old site",
  async function (this: SpecWorld, address: string) {
    assert.ok(this.moment !== undefined, "No moment has been named.");
    const account = Account.bringOver(
      AccountId.create(),
      PersonName.from("Sam Someone"),
      EmailAddress.from(address),
      this.hashEmailAddress?.(address) ?? "",
      "the old site's hash",
      ReadOnlyDate.from(this.moment),
    );
    this.aggregate = account;
    try {
      await this.keepAccount?.(account);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Given(
  "an account for {string} is registered",
  async function (this: SpecWorld, address: string) {
    await registerFor(this, address);
  },
);

When(
  "another account for {string} is registered",
  async function (this: SpecWorld, address: string) {
    await registerFor(this, address);
  },
);

When(
  "the account for {string} is forgotten",
  async function (this: SpecWorld, address: string) {
    const id = registeredFor(this, address).at(-1);
    assert.ok(id !== undefined, `No account was registered for ${address}.`);
    assert.ok(this.moment !== undefined, "No moment has been named.");
    const account = await readBack(this, id);
    account.forget(ReadOnlyDate.from(this.moment));
    await this.keepAccount?.(account);
  },
);

// Looking accounts up ----------------------------------------------------------

When(
  "the account for {string} is looked for",
  async function (this: SpecWorld, address: string) {
    const { readModel } = accountsOf(this);
    const found = await this.asARequest(() =>
      readModel.find(EmailAddress.from(address)),
    );
    this.lookup = { found };
  },
);

Then("it is found", function (this: SpecWorld) {
  const found = this.lookup?.found;
  assert.ok(found !== undefined, "Nothing was found.");
  const first = [...accountsOf(this).byAddress.values()][0]?.[0];
  assert.ok(found.equals(first), `It found ${found.value}.`);
});

Then("the other account is found", function (this: SpecWorld) {
  const found = this.lookup?.found;
  assert.ok(found !== undefined, "Nothing was found.");
  const other = [...accountsOf(this).byAddress.values()][0]?.[1];
  assert.ok(found.equals(other), `It found ${found.value}.`);
});
