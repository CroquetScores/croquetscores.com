import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";

import { AccountForgotten } from "../../../../src/domain/aggregates/accounts/events/AccountForgotten.js";
import { AccountRegistered } from "../../../../src/domain/aggregates/accounts/events/AccountRegistered.js";
import { EmailAddressChanged } from "../../../../src/domain/aggregates/accounts/events/EmailAddressChanged.js";
import { EmailAddressConfirmed } from "../../../../src/domain/aggregates/accounts/events/EmailAddressConfirmed.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import type { StoredEvent } from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  accountsOf,
  aSiteKey,
  keepAccounts,
  keptAt,
  readBack,
} from "../../support/accounts.js";
import { rebuildsWith } from "../../support/projections.js";

const rowsAsText = async (world: SpecWorld): Promise<string[]> => {
  const { rows } = await world.database.query<{ row: string }>(
    `select t::text as row from accounts_by_email_address t`,
  );
  return rows.map(({ row }) => row);
};

// The first account's events, as its stream holds them, found by the kind the
// scenario asks for.
const firstAccounts = async <T extends DomainEvent>(
  world: SpecWorld,
  kind: abstract new (...parameters: never[]) => T,
): Promise<T> => {
  const { store } = accountsOf(world);
  const id = keptAt(world, 1);
  const events = await world.asARequest(() => store.getEvents(id));
  const event = events.find((each) => each instanceof kind);
  assert.ok(event instanceof kind, `The first account has no ${kind.name}.`);
  return event;
};

Given(
  "the accounts by email address read model, with its key",
  function (this: SpecWorld) {
    keepAccounts(this, aSiteKey());
    rebuildsWith(this, async () => {
      const { readModel, store } = accountsOf(this);
      await this.asARequest(async () =>
        readModel.rebuildFrom(await store.readAll()),
      );
    });
  },
);

// Its table ------------------------------------------------------------------

Then(
  "the read model holds {int} row(s)",
  async function (this: SpecWorld, count: number) {
    assert.equal((await rowsAsText(this)).length, count);
  },
);

Then(
  "no row of the read model contains {string}",
  async function (this: SpecWorld, words: string) {
    for (const row of await rowsAsText(this)) {
      assert.ok(!row.includes(words), `A row holds it: ${row}`);
    }
  },
);

Then(
  "no row of the read model contains the SHA-256 of {string}",
  async function (this: SpecWorld, words: string) {
    const plain = createHash("sha256").update(words).digest("hex");
    for (const row of await rowsAsText(this)) {
      assert.ok(!row.includes(plain), `A row holds it: ${row}`);
    }
  },
);

// Projecting again, and rebuilding ---------------------------------------------

When("its registering is projected again", async function (this: SpecWorld) {
  const registered = await firstAccounts(this, AccountRegistered);
  const { readModel } = accountsOf(this);
  const id = keptAt(this, 1);
  await this.asARequest(() => readModel.project(id, 1, [registered]));
});

// The confirming is the account's second event, after its registering.
When("its confirming is projected again", async function (this: SpecWorld) {
  const confirmed = await firstAccounts(this, EmailAddressConfirmed);
  const { readModel } = accountsOf(this);
  const id = keptAt(this, 1);
  await this.asARequest(() => readModel.project(id, 2, [confirmed]));
});

When("its forgetting is projected again", async function (this: SpecWorld) {
  const forgotten = await firstAccounts(this, AccountForgotten);
  const { readModel } = accountsOf(this);
  const id = keptAt(this, 1);
  await this.asARequest(() => readModel.project(id, 2, [forgotten]));
});

// Moving ----------------------------------------------------------------------

// Moved as an account is, through the account and kept by the projecting
// store, so that what the read model sees is what a move writes. The account
// is confirmed first where it is not yet, since only a confirmed account can be
// moved and these scenarios register accounts without confirming them: what
// they are about is the row, not who the account is. A refusal is kept for the
// scenario rather than thrown.
const moveTo = async (
  world: SpecWorld,
  from: string,
  to: string,
): Promise<void> => {
  const id = accountsOf(world)
    .byAddress.get(EmailAddress.from(from).comparable)
    ?.at(-1);
  assert.ok(id !== undefined, `No account was registered for ${from}.`);
  assert.ok(world.moment !== undefined, "No moment has been named.");
  const at = ReadOnlyDate.from(world.moment);
  const account = await readBack(world, id);
  if (!account.confirmed) {
    account.confirm(PersonName.from("Sam Someone"), "a password hash", at);
  }
  const hash = world.hashEmailAddress;
  assert.ok(hash !== undefined, "There is no way to hash an address.");
  account.changeEmailAddress(EmailAddress.from(to), hash(to), at);
  world.failure = undefined;
  try {
    await world.keepAccount?.(account);
  } catch (failure) {
    world.failure = failure;
  }
};

Given(
  "the account for {string} is moved to {string}",
  async function (this: SpecWorld, from: string, to: string) {
    await moveTo(this, from, to);
  },
);

When("its move is projected again", async function (this: SpecWorld) {
  const moved = await firstAccounts(this, EmailAddressChanged);
  const { readModel } = accountsOf(this);
  const id = keptAt(this, 1);
  await this.asARequest(() => readModel.project(id, 3, [moved]));
});

Given("every account's key is deleted", async function (this: SpecWorld) {
  await this.database.query(`delete from account_keys`);
});

// Rebuilding is refused as a scenario's own business rather than thrown, so
// that a scenario can say it did not fail — which every one of them does, since
// a rebuild that fails is rolled back and leaves the table as it was.
const rebuild = async (
  world: SpecWorld,
  inOrder: (events: readonly StoredEvent[]) => readonly StoredEvent[],
): Promise<void> => {
  const { readModel, store } = accountsOf(world);
  try {
    await world.asARequest(async () =>
      readModel.rebuildFrom(inOrder(await store.readAll())),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

// The event store reads stream by stream, and a stream is named by a random
// uuid, so which stream it hands over first is chance: a rebuild that depends
// on reading the older account first would be caught by the scenario above
// only half of the time. This hands the streams over newest account first,
// which is the order that catches it, every time.
When(
  "the read model is rebuilt from the events, the newest account first",
  async function (this: SpecWorld) {
    const newestFirst = [...accountsOf(this).kept].reverse();
    await rebuild(this, (events) =>
      newestFirst.flatMap((account) =>
        events.filter(({ stream }) => stream === account.value),
      ),
    );
  },
);
