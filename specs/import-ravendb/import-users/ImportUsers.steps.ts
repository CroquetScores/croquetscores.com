import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AggregateRepository } from "../../../src/application/common/AggregateRepository.js";
import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ImportUsers } from "../../../src/import-ravendb/ImportUsers.js";
import type { User } from "../../../src/import-ravendb/ravendb-models/User.js";
import { Argon2id } from "../../../src/infrastructure/identity/Argon2id.js";
import { ImportedPasswordHasher } from "../../../src/infrastructure/identity/ImportedPasswordHasher.js";
import { OldSitePasswordHasher } from "../../../src/infrastructure/identity/OldSitePasswordHasher.js";
import {
  accountsOf,
  aSiteKey,
  keepAccounts,
  readBack,
} from "../../infrastructure/support/accounts.js";
import { unitOfWorkOf } from "../../infrastructure/support/transactions.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";

// Any salt will do, so long as the hashes a scenario makes and the hasher that
// checks them share it.
const theOldSite = new OldSitePasswordHasher("the old sites' salt");

// Sixteen bytes of salt, as the old sites made them.
const ITS_SALT = Buffer.alloc(16, 7).toString("base64");

/** `password` as the old sites kept it: its salt and its hash, in one. */
const asTheOldSitesKeptIt = (password: string): string => {
  const hash = theOldSite.hashOf(password, ITS_SALT);
  return `${ITS_SALT.slice(0, 4)}${hash}${ITS_SALT.slice(4)}`;
};

interface Importing {
  readonly importer: ImportUsers;
  readonly passwords: ImportedPasswordHasher;
  user?: { website: string; id: string; document: User };
  refused?: unknown;
}

const importing = new WeakMap<SpecWorld, Importing>();

const importingOf = (world: SpecWorld): Importing => {
  const found = importing.get(world);
  assert.ok(found !== undefined, "Users are not being imported.");
  return found;
};

// The user being written, changed a field at a time.
const change = (world: SpecWorld, fields: Partial<User>): void => {
  const state = importingOf(world);
  assert.ok(state.user !== undefined, "No user has been named.");
  state.user = {
    ...state.user,
    document: { ...state.user.document, ...fields },
  };
};

const accountAt = async (world: SpecWorld, address: string): Promise<Account> =>
  readBack(world, await idAt(world, address));

const idAt = async (world: SpecWorld, address: string): Promise<AccountId> => {
  const { readModel } = accountsOf(world);
  const found = await world.asARequest(() =>
    readModel.find(EmailAddress.from(address)),
  );
  // Said with whatever importing was refused with, which is nearly always why.
  const refused = importing.get(world)?.refused;
  assert.ok(
    found !== undefined,
    `No account is reached at ${address}.` +
      (refused === undefined
        ? ""
        : ` Importing was refused: ${inspect(refused)}`),
  );
  return found;
};

Given("the users are imported", async function (this: SpecWorld) {
  const accounts = keepAccounts(this, aSiteKey());
  const database = importDatabaseOf(this);
  await database.reset();

  // Today's cost, as the import pays it: what an imported hash costs is the
  // password hasher's to specify, and a cheaper one here would specify it
  // differently.
  const passwords = new ImportedPasswordHasher(new Argon2id(), theOldSite);
  const repository = new AggregateRepository(
    new ProjectingEventStore(accounts.store, [
      accounts.readModel,
      accounts.byGoogleAccount,
    ]),
    (id: AccountId, events) => Account.rebuiltFrom(id, events),
  );

  importing.set(this, {
    importer: new ImportUsers(
      unitOfWorkOf(this),
      repository,
      accounts.hasher,
      passwords,
      database,
    ),
    passwords,
  });
});

Given(
  "a user {string} on {string}",
  function (this: SpecWorld, id: string, website: string) {
    importingOf(this).user = {
      website,
      id,
      document: {
        Name: "Sam Someone",
        EmailAddress: "someone@example.com",
        Password: asTheOldSitesKeptIt("a password nobody gave"),
        ConfirmedAt: null,
      },
    };
  },
);

// Users brought over to set a scene, which other features' scenarios name by
// their documents: a user who confirmed their email address, and became an
// account, and one who never did, and became none.

Given(
  "a user {string} on {string} is imported as {string}",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    address: string,
  ) {
    const state = importingOf(this);
    state.user = {
      website,
      id,
      document: {
        Name: "Sam Someone",
        EmailAddress: address,
        Password: asTheOldSitesKeptIt("a password nobody gave"),
        ConfirmedAt: "2014-01-01T09:00:00Z",
      },
    };
    await state.importer.importDocument(state.user);
  },
);

Given(
  "a user {string} on {string} who never confirmed their email address",
  async function (this: SpecWorld, id: string, website: string) {
    const state = importingOf(this);
    state.user = {
      website,
      id,
      document: {
        Name: "Sam Someone",
        EmailAddress: `${id.replace("/", "-")}@example.com`,
        Password: asTheOldSitesKeptIt("a password nobody gave"),
        ConfirmedAt: null,
      },
    };
    await state.importer.importDocument(state.user);
  },
);

Given("the user is called {string}", function (this: SpecWorld, name: string) {
  change(this, { Name: name });
});

Given(
  "the user's email address is {string}",
  function (this: SpecWorld, address: string) {
    change(this, { EmailAddress: address });
  },
);

Given(
  "the user's password was {string}",
  function (this: SpecWorld, password: string) {
    change(this, { Password: asTheOldSitesKeptIt(password) });
  },
);

Given(
  "the user's password hash is {string}",
  function (this: SpecWorld, hash: string) {
    change(this, { Password: hash });
  },
);

Given(
  "the user confirmed their email address at {string}",
  function (this: SpecWorld, moment: string) {
    change(this, { ConfirmedAt: moment });
  },
);

Given(
  "the user never confirmed their email address",
  function (this: SpecWorld) {
    change(this, { ConfirmedAt: null });
  },
);

When("the user is imported", async function (this: SpecWorld) {
  const state = importingOf(this);
  assert.ok(state.user !== undefined, "No user has been named.");
  state.refused = undefined;
  try {
    await state.importer.importDocument(state.user);
  } catch (failure) {
    state.refused = failure;
  }
});

Then(
  "the account at {string} is called {string}",
  async function (this: SpecWorld, address: string, name: string) {
    assert.equal((await accountAt(this, address)).name?.toString(), name);
  },
);

Then(
  "the account at {string} is confirmed",
  async function (this: SpecWorld, address: string) {
    assert.equal((await accountAt(this, address)).confirmed, true);
  },
);

Then(
  "the account at {string} was brought over at {string}",
  async function (this: SpecWorld, address: string, moment: string) {
    const id = await idAt(this, address);
    const { store } = accountsOf(this);
    const [first] = await this.asARequest(() => store.getEvents(id));
    assert.ok(first !== undefined, `The account ${id.value} has no events.`);
    assert.equal(
      first.occurredAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "{string} is the password of the account at {string}",
  async function (this: SpecWorld, password: string, address: string) {
    const account = await accountAt(this, address);
    const { matches } = await importingOf(this).passwords.check(
      password,
      account.passwordHash,
    );
    assert.equal(matches, true, `${password} does not match.`);
  },
);

Then(
  "{string} on {string} is kept as the account at {string}",
  async function (
    this: SpecWorld,
    documentId: string,
    website: string,
    address: string,
  ) {
    const kept = await importDatabaseOf(this).findAccountOf(
      website,
      documentId,
    );
    assert.ok(kept !== undefined, `${documentId} is not kept as any account.`);
    assert.equal(kept.accountId, (await idAt(this, address)).value);
  },
);

Then(
  "{string} on {string} is kept with the email address {string}",
  async function (
    this: SpecWorld,
    documentId: string,
    website: string,
    address: string,
  ) {
    const kept = await importDatabaseOf(this).findAccountOf(
      website,
      documentId,
    );
    assert.ok(kept !== undefined, `${documentId} is not kept as any account.`);
    assert.equal(kept.emailAddress, address);
  },
);

Then("importing the user is not refused", function (this: SpecWorld) {
  assert.equal(importingOf(this).refused, undefined);
});

Then(
  "importing the user is refused with {string}",
  function (this: SpecWorld, code: string) {
    const { refused } = importingOf(this);
    assert.ok(refused !== undefined, "Importing the user was not refused.");
    assert.equal((refused as { code?: unknown }).code, code);
  },
);
