import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AskForEmergencyAccess } from "../../../../../src/application/operations/emergency/AskForEmergencyAccess.js";
import type { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

// What the scenario has named so far: the address each account it made is
// reached at, since the feature says who asks by name and the account is found
// by its address, and what was said.
interface Named {
  readonly addresses: Map<string, string>;
  // Ids of accounts forgotten since, which cannot be found by address again.
  readonly forgotten: Map<string, AccountId>;
  message: string;
}

const named = new WeakMap<SpecWorld, Named>();

const namedOf = (world: SpecWorld): Named => {
  let found = named.get(world);
  if (found === undefined) {
    found = { addresses: new Map(), forgotten: new Map(), message: "" };
    named.set(world, found);
  }
  return found;
};

Given(
  "an account {string} at {string}",
  async function (this: SpecWorld, name: string, address: string) {
    namedOf(this).addresses.set(name, address);
    await registeringOf(this).giveAnAccount(address, { confirmed: true, name });
  },
);

Given(
  "an account {string} at {string} begun {int} day(s) ago",
  async function (
    this: SpecWorld,
    name: string,
    address: string,
    days: number,
  ) {
    namedOf(this).addresses.set(name, address);
    await registeringOf(this).giveAnAccount(address, {
      confirmed: true,
      name,
      registeredDaysAgo: days,
    });
  },
);

Given(
  "an account {string} at {string} brought over from the old site",
  async function (this: SpecWorld, name: string, address: string) {
    namedOf(this).addresses.set(name, address);
    await registeringOf(this).giveAnAccount(address, {
      confirmed: true,
      name,
      fromTheOldSite: true,
    });
  },
);

Given("no emergency contacts are set", function (this: SpecWorld) {
  registeringOf(this).emergencyContactsAre([]);
});

Given("the message {string}", function (this: SpecWorld, message: string) {
  namedOf(this).message = message;
});

Given(
  "a message of {int} characters",
  function (this: SpecWorld, characters: number) {
    namedOf(this).message = "x".repeat(characters);
  },
);

// Whatever came of it is kept for the scenario rather than thrown, since some
// of these scenarios are about how it is refused.
const ask = async (
  world: SpecWorld,
  who: AccountId | undefined,
): Promise<void> => {
  world.failure = undefined;
  try {
    await registeringOf(world).askForEmergencyAccess(
      new AskForEmergencyAccess(
        namedOf(world).message,
        "croquetscores.com",
        momentOf(world),
        who,
      ),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const accountCalled = async (
  world: SpecWorld,
  name: string,
): Promise<AccountId> => {
  const gone = namedOf(world).forgotten.get(name);
  if (gone !== undefined) return gone;
  const address = namedOf(world).addresses.get(name);
  assert.ok(address !== undefined, `There is no account called ${name}.`);
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account.id;
};

When(
  "{string} asks for emergency access",
  async function (this: SpecWorld, name: string) {
    await ask(this, await accountCalled(this, name));
  },
);

Given(
  "{string} has asked for emergency access",
  async function (this: SpecWorld, name: string) {
    await ask(this, await accountCalled(this, name));
    assert.equal(this.failure, undefined, "Asking was refused.");
  },
);

Given("{string} is forgotten", async function (this: SpecWorld, name: string) {
  const address = namedOf(this).addresses.get(name);
  assert.ok(address !== undefined, `There is no account called ${name}.`);
  namedOf(this).forgotten.set(name, await accountCalled(this, name));
  await registeringOf(this).forget(address);
});

When(
  "somebody signed in as no one asks for emergency access",
  async function (this: SpecWorld) {
    await ask(this, undefined);
  },
);

// What was queued ----------------------------------------------------------------

const queuedFor = async (world: SpecWorld, address: string) =>
  (await registeringOf(world).queued()).filter((email) => email.to === address);

Then(
  "{int} emails are queued",
  async function (this: SpecWorld, count: number) {
    assert.equal((await registeringOf(this).queued()).length, count);
  },
);

// Read from the email as the writer writes it, since what it says is the
// writer's to put from the filling the queue holds.
const writtenFor = (world: SpecWorld, address: string): Promise<string> =>
  registeringOf(world).writtenFor(address);

Then(
  "the email queued for {string} says {string}",
  async function (this: SpecWorld, address: string, said: string) {
    assert.ok((await writtenFor(this, address)).includes(said));
  },
);

Then(
  "the email queued for {string} names the sender {string}",
  async function (this: SpecWorld, address: string, name: string) {
    assert.ok((await writtenFor(this, address)).includes(name));
  },
);

Then(
  "the email queued for {string} gives the sender's address {string}",
  async function (this: SpecWorld, address: string, sender: string) {
    assert.ok((await writtenFor(this, address)).includes(sender));
  },
);

Then(
  "the email queued for {string} gives the moment {string}",
  async function (this: SpecWorld, address: string, moment: string) {
    assert.ok(
      (await writtenFor(this, address)).includes(
        new Date(moment).toISOString(),
      ),
    );
  },
);

Then(
  "a reply to the email queued for {string} goes to {string}",
  async function (this: SpecWorld, address: string, replyTo: string) {
    const queued = await queuedFor(this, address);
    assert.equal(queued.length, 1, `${queued.length} emails are queued.`);
    assert.equal(queued[0]?.replyTo, replyTo);
  },
);
