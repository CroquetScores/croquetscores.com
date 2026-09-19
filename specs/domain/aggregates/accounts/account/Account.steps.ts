import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { inspect } from "node:util";

import { Account } from "../../../../../src/domain/aggregates/accounts/Account.js";
import { AccountForgotten } from "../../../../../src/domain/aggregates/accounts/events/AccountForgotten.js";
import { AccountRegistered } from "../../../../../src/domain/aggregates/accounts/events/AccountRegistered.js";
import { EmailAddressConfirmed } from "../../../../../src/domain/aggregates/accounts/events/EmailAddressConfirmed.js";
import { PasswordHashedAgain } from "../../../../../src/domain/aggregates/accounts/events/PasswordHashedAgain.js";
import { SignedIn } from "../../../../../src/domain/aggregates/accounts/events/SignedIn.js";
import type { AccountId } from "../../../../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { EmailAddress } from "../../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import type { DomainEvent } from "../../../../../src/domain/common/DomainEvent.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";

// The stream an account is rebuilt from. Kept here rather than on the world,
// which has no business knowing what an account's events are.
const streams = new WeakMap<SpecWorld, DomainEvent[]>();

const streamOf = (world: SpecWorld): DomainEvent[] => {
  let stream = streams.get(world);
  if (stream === undefined) {
    stream = [];
    streams.set(world, stream);
  }
  return stream;
};

// The account the scenario names in its Background is the one registered, and
// so, as every account event is, the cause of what it records.
const idOf = (world: SpecWorld): AccountId => {
  assert.ok(world.account !== undefined, "No account has been named.");
  return world.account;
};

const now = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const accountOf = (world: SpecWorld): Account => {
  assert.ok(
    world.aggregate instanceof Account,
    `There is no account: ${inspect(world.failure)}`,
  );
  return world.aggregate;
};

// A hash stands in for the password's. The account is only ever given a hash,
// so what matters is that it is not the password; how it was made does not.
const hashOf = (password: string): string =>
  `stand-in$${createHash("sha256").update(password).digest("hex")}`;

// The hash registering is given of an email address: the one the scenario
// keeps accounts with, when it keeps them, so that they can be found by it; a
// stand-in otherwise, since the account only carries it.
const addressHashOf = (world: SpecWorld, address: string): string =>
  world.hashEmailAddress?.(address) ?? `stand-in$${address.toLowerCase()}`;

// Asking an account something may be refused, and the scenario says which it
// expects. What it recorded is kept, when the scenario keeps accounts.
const tryTo = async (
  world: SpecWorld,
  ask: (account: Account) => void,
): Promise<void> => {
  try {
    ask(accountOf(world));
  } catch (failure) {
    world.failure = failure;
    return;
  }
  await world.keepAccount?.(accountOf(world));
};

const firstRecorded = (world: SpecWorld): DomainEvent => {
  const event = accountOf(world).recorded[0];
  assert.ok(event !== undefined, "It recorded nothing.");
  return event;
};

// Registering --------------------------------------------------------------

const register = async (
  world: SpecWorld,
  name: string,
  address: string,
  password: string,
  addressHash = addressHashOf(world, address),
): Promise<void> => {
  const account = Account.register(
    idOf(world),
    PersonName.from(name),
    EmailAddress.from(address),
    addressHash,
    hashOf(password),
    now(world),
  );
  world.aggregate = account;
  await world.keepAccount?.(account);
};

When(
  "an account is registered as {string} at {string}",
  async function (this: SpecWorld, name: string, address: string) {
    await register(this, name, address, "correct horse battery staple");
  },
);

When(
  "an account is registered as {string} at {string} with the password {string}",
  async function (
    this: SpecWorld,
    name: string,
    address: string,
    password: string,
  ) {
    await register(this, name, address, password);
  },
);

When(
  "an account is registered as {string} at {string} with the email address hash {string}",
  async function (
    this: SpecWorld,
    name: string,
    address: string,
    addressHash: string,
  ) {
    await register(
      this,
      name,
      address,
      "correct horse battery staple",
      addressHash,
    );
  },
);

// The stream an account is rebuilt from -------------------------------------

const registered = (
  world: SpecWorld,
  name: string,
  address: string,
  imported: boolean,
): AccountRegistered =>
  new AccountRegistered(
    name,
    address,
    addressHashOf(world, address),
    imported ? "$old-site$stand-in" : hashOf("correct horse battery staple"),
    imported,
    idOf(world),
    now(world),
  );

Given(
  "a stream where an account was registered as {string} at {string}",
  function (this: SpecWorld, name: string, address: string) {
    streamOf(this).push(registered(this, name, address, false));
  },
);

Given(
  "a stream where an account was registered as {string} at {string} with an imported password",
  function (this: SpecWorld, name: string, address: string) {
    streamOf(this).push(registered(this, name, address, true));
  },
);

Given("its email address was confirmed", function (this: SpecWorld) {
  streamOf(this).push(new EmailAddressConfirmed(idOf(this), now(this)));
});

// The hash a password was hashed again with, when the stream says it was.
const NEW_HASH = hashOf("a new hash");

Given("its password was hashed again", function (this: SpecWorld) {
  streamOf(this).push(new PasswordHashedAgain(NEW_HASH, idOf(this), now(this)));
});

Given("it was forgotten", function (this: SpecWorld) {
  streamOf(this).push(new AccountForgotten(idOf(this), now(this)));
});

When("the account is rebuilt from the stream", function (this: SpecWorld) {
  this.aggregate = Account.rebuiltFrom(idOf(this), streamOf(this));
});

// What is asked of it ------------------------------------------------------

When(
  "the account's email address is confirmed",
  async function (this: SpecWorld) {
    await tryTo(this, (account) => account.confirm(now(this)));
  },
);

When("the account is signed in to", async function (this: SpecWorld) {
  await tryTo(this, (account) => account.signIn(now(this)));
});

When("its password is hashed again", async function (this: SpecWorld) {
  await tryTo(this, (account) =>
    account.hashPasswordAgain(
      hashOf("correct horse battery staple"),
      now(this),
    ),
  );
});

When(
  "its password {string} is hashed again",
  async function (this: SpecWorld, password: string) {
    await tryTo(this, (account) =>
      account.hashPasswordAgain(hashOf(password), now(this)),
    );
  },
);

When("the account is forgotten", async function (this: SpecWorld) {
  await tryTo(this, (account) => account.forget(now(this)));
});

// What it recorded -----------------------------------------------------------

Then(
  "the first thing it recorded is its registering",
  function (this: SpecWorld) {
    const event = firstRecorded(this);
    assert.ok(
      event instanceof AccountRegistered,
      `It recorded ${inspect(event)}.`,
    );
  },
);

Then(
  "the first thing it recorded is its email address being confirmed",
  function (this: SpecWorld) {
    const event = firstRecorded(this);
    assert.ok(
      event instanceof EmailAddressConfirmed,
      `It recorded ${inspect(event)}.`,
    );
  },
);

Then(
  "the first thing it recorded is its signing in",
  function (this: SpecWorld) {
    const event = firstRecorded(this);
    assert.ok(event instanceof SignedIn, `It recorded ${inspect(event)}.`);
  },
);

Then(
  "the first thing it recorded is its password being hashed again",
  function (this: SpecWorld) {
    const event = firstRecorded(this);
    assert.ok(
      event instanceof PasswordHashedAgain,
      `It recorded ${inspect(event)}.`,
    );
  },
);

Then(
  "the first thing it recorded is its being forgotten",
  function (this: SpecWorld) {
    const event = firstRecorded(this);
    assert.ok(
      event instanceof AccountForgotten,
      `It recorded ${inspect(event)}.`,
    );
  },
);

// Every way what it recorded is written down: as JSON, which is how an event
// is kept, and as console.log shows it.
Then(
  "what it recorded does not contain {string}",
  function (this: SpecWorld, words: string) {
    const recorded = accountOf(this).recorded;
    assert.ok(recorded.length > 0, "It recorded nothing.");
    for (const written of [JSON.stringify(recorded), inspect(recorded)]) {
      assert.ok(!written.includes(words), `It recorded ${written}.`);
    }
  },
);

// What it is -----------------------------------------------------------------

Then(
  "its registering says the email address hash {string}",
  function (this: SpecWorld, addressHash: string) {
    const event = firstRecorded(this);
    assert.ok(
      event instanceof AccountRegistered,
      `It recorded ${inspect(event)}.`,
    );
    assert.equal(event.emailAddressHash, addressHash);
  },
);

Then(
  "the account is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(accountOf(this).name.toString(), name);
  },
);

Then(
  "the account is reached at {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(accountOf(this).emailAddress.toString(), address);
  },
);

Then("the account is confirmed", function (this: SpecWorld) {
  assert.equal(accountOf(this).confirmed, true);
});

Then("the account is not confirmed", function (this: SpecWorld) {
  assert.equal(accountOf(this).confirmed, false);
});

Then(
  "the account's password hash is the one it was hashed again with",
  function (this: SpecWorld) {
    assert.equal(accountOf(this).passwordHash, NEW_HASH);
  },
);

Then("the account's password is not imported", function (this: SpecWorld) {
  assert.equal(accountOf(this).passwordImported, false);
});
