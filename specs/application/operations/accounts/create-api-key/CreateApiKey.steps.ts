import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ApiKeysOfAccount } from "../../../../../src/application/operations/accounts/ApiKeysOfAccount.js";
import { CreateApiKey } from "../../../../../src/application/operations/accounts/CreateApiKey.js";
import { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  apiKeysOf,
  keepingWhatCameOf,
  keyListedAt,
  keyMadeAt,
  lastKeyMade,
} from "../apiKeyRequests.js";
import { accountAt, momentOf, registeringOf } from "../roleRequests.js";

// Made for the account the reader is signed in to, which is all a key is ever
// made for. What came of it is kept, since some scenarios are about how it is
// refused, and the key made is kept for the steps that ask what became of it.
const makeFor = async (
  world: SpecWorld,
  account: string,
  address: string,
  label: string,
  scope: string,
  tournament: string | undefined,
): Promise<void> => {
  await keepingWhatCameOf(world, async () =>
    registeringOf(world).createApiKey(
      new CreateApiKey(account, label, scope, tournament, momentOf(world)),
    ),
  );
  const made = world.answer as { id: string; key: string } | undefined;
  if (made !== undefined) {
    apiKeysOf(world).made.push({ address, key: made });
  }
};

const make = async (
  world: SpecWorld,
  address: string,
  label: string,
  scope: string,
  tournament: string | undefined,
): Promise<void> => {
  const account = await accountAt(world, address);
  await makeFor(world, account.id.value, address, label, scope, tournament);
};

// A tournament the key is limited to, remembered so that steps can say it.
const limitedToATournament = (world: SpecWorld): string => {
  const tournament = TournamentId.create().value;
  apiKeysOf(world).tournament = tournament;
  return tournament;
};

When(
  "the reader signed in to the account for {string} makes a key labelled {string} that may read",
  async function (this: SpecWorld, address: string, label: string) {
    await make(this, address, label, "read", undefined);
  },
);

When(
  "the reader signed in to the account for {string} makes a key labelled {string} that may read and write",
  async function (this: SpecWorld, address: string, label: string) {
    await make(this, address, label, "read-and-write", undefined);
  },
);

When(
  "the reader signed in to the account for {string} makes a key labelled {string} that may read and write, for a tournament",
  async function (this: SpecWorld, address: string, label: string) {
    await make(
      this,
      address,
      label,
      "read-and-write",
      limitedToATournament(this),
    );
  },
);

When(
  "the reader signed in to the account for {string} makes a key labelled {string} that may read, for the tournament {string}",
  async function (
    this: SpecWorld,
    address: string,
    label: string,
    tournament: string,
  ) {
    await make(this, address, label, "read", tournament);
  },
);

When(
  "the reader signed in to the account for {string} makes a key with a label of {int} letters that may read",
  async function (this: SpecWorld, address: string, letters: number) {
    await make(this, address, "k".repeat(letters), "read", undefined);
  },
);

When(
  "the reader signed in to the account for {string} makes a key labelled {string} with the scope {string}",
  async function (
    this: SpecWorld,
    address: string,
    label: string,
    scope: string,
  ) {
    await make(this, address, label, scope, undefined);
  },
);

// For an account no longer found by its address, as a forgotten one is not.
When(
  "the reader signed in to that account makes a key labelled {string} that may read",
  async function (this: SpecWorld, label: string) {
    assert.ok(this.accountHeld !== undefined, "The scenario holds no account.");
    await makeFor(this, this.accountHeld, "", label, "read", undefined);
  },
);

// A key an account already had, made before the scenario's own request. Made
// as the reader would make it, so that what is kept is what a reader's making
// keeps.
const hasAKey = async (
  world: SpecWorld,
  address: string,
  label: string,
  scope: string,
  tournament: string | undefined,
): Promise<void> => {
  await make(world, address, label, scope, tournament);
  assert.equal(world.failure, undefined, "The key was refused.");
};

Given(
  "the account for {string} has the key labelled {string}",
  async function (this: SpecWorld, address: string, label: string) {
    await hasAKey(this, address, label, "read", undefined);
  },
);

Given(
  "the account for {string} has the key labelled {string} that may read",
  async function (this: SpecWorld, address: string, label: string) {
    await hasAKey(this, address, label, "read", undefined);
  },
);

Given(
  "the account for {string} has the key labelled {string} that may read and write",
  async function (this: SpecWorld, address: string, label: string) {
    await hasAKey(this, address, label, "read-and-write", undefined);
  },
);

Given(
  "the account for {string} has the key labelled {string} that may read and write, for a tournament",
  async function (this: SpecWorld, address: string, label: string) {
    await hasAKey(
      this,
      address,
      label,
      "read-and-write",
      limitedToATournament(this),
    );
  },
);

When(
  "the keys of the account for {string} are listed",
  async function (this: SpecWorld, address: string) {
    const account = await accountAt(this, address);
    apiKeysOf(this).listed = await registeringOf(this).apiKeysOf(
      new ApiKeysOfAccount(account.id.value),
    );
  },
);

Then("the answer carries a key", function (this: SpecWorld) {
  const key = (this.answer as { key?: unknown } | undefined)?.key;
  assert.ok(
    typeof key === "string" && key.startsWith("cs_") && key.length > 40,
    `The answer carries no key: ${JSON.stringify(this.answer)}.`,
  );
});

Then("the account has {int} key", function (this: SpecWorld, count: number) {
  assert.equal(apiKeysOf(this).listed.length, count);
});

Then("the account has no keys", function (this: SpecWorld) {
  assert.equal(apiKeysOf(this).listed.length, 0);
});

Then(
  "the list does not carry the key that was made",
  function (this: SpecWorld) {
    const { key } = lastKeyMade(this);
    assert.ok(!JSON.stringify(apiKeysOf(this).listed).includes(key));
  },
);

Then(
  "nothing kept for the account for {string} holds the key that was made",
  async function (this: SpecWorld, address: string) {
    const { key } = lastKeyMade(this);
    const kept = await registeringOf(this).everythingKeptFor(address);
    assert.ok(kept.length > 0, "Nothing is kept for the account.");
    assert.ok(!kept.includes(key), "The key is kept as it was made.");
  },
);

Then(
  "the last thing the account for {string} recorded is a key being made",
  async function (this: SpecWorld, address: string) {
    const last =
      (await registeringOf(this).everythingKeptFor(address))
        .trim()
        .split("\n")
        .at(-1) ?? "";
    assert.ok(last.includes("account-api-key-created"), `The last is ${last}.`);
  },
);

Then("the second key made is not the first", function (this: SpecWorld) {
  const first = keyMadeAt(this, "first");
  const second = keyMadeAt(this, "second");
  assert.notEqual(first.key, second.key);
  assert.notEqual(first.id, second.id);
});

// What a key listed says of itself.

Then(
  "the {word} key is labelled {string}",
  function (this: SpecWorld, place: string, label: string) {
    assert.equal(keyListedAt(this, place).label, label);
  },
);

Then("the {word} key may read", function (this: SpecWorld, place: string) {
  assert.equal(keyListedAt(this, place).mayRead, true);
});

Then("the {word} key may not write", function (this: SpecWorld, place: string) {
  assert.equal(keyListedAt(this, place).mayWrite, false);
});

Then("the {word} key may write", function (this: SpecWorld, place: string) {
  assert.equal(keyListedAt(this, place).mayWrite, true);
});

Then(
  "the {word} key is not limited to a tournament",
  function (this: SpecWorld, place: string) {
    assert.equal(keyListedAt(this, place).tournament, undefined);
  },
);

Then(
  "the {word} key is limited to that tournament",
  function (this: SpecWorld, place: string) {
    const expected = apiKeysOf(this).tournament;
    assert.ok(expected !== undefined, "No tournament was named.");
    assert.equal(keyListedAt(this, place).tournament, expected);
  },
);

Then(
  "the {word} key may make {int} requests a minute",
  function (this: SpecWorld, place: string, count: number) {
    assert.equal(keyListedAt(this, place).perMinute, count);
  },
);

Then(
  "the {word} key may make {int} requests a day",
  function (this: SpecWorld, place: string, count: number) {
    assert.equal(keyListedAt(this, place).perDay, count);
  },
);

Then(
  "the {word} key was made at {string}",
  function (this: SpecWorld, place: string, moment: string) {
    assert.equal(
      keyListedAt(this, place).madeAt,
      ReadOnlyDate.from(new Date(moment)).toISOString(),
    );
  },
);

Then(
  "the {word} key is not revoked",
  function (this: SpecWorld, place: string) {
    assert.equal(keyListedAt(this, place).revoked, false);
  },
);

Then("the {word} key is revoked", function (this: SpecWorld, place: string) {
  assert.equal(keyListedAt(this, place).revoked, true);
});
