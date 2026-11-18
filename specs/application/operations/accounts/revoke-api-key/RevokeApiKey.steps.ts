import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RevokeApiKey } from "../../../../../src/application/operations/accounts/RevokeApiKey.js";
import { ApiKeyId } from "../../../../../src/domain/aggregates/accounts/ApiKeyId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  apiKeysOf,
  keepingWhatCameOf,
  keyMadeAt,
  lastKeyMade,
} from "../apiKeyRequests.js";
import { accountAt, momentOf, registeringOf } from "../roleRequests.js";

const revokeAs = async (
  world: SpecWorld,
  account: string,
  keyId: string,
): Promise<void> => {
  await keepingWhatCameOf(world, async () =>
    registeringOf(world).revokeApiKey(
      new RevokeApiKey(account, keyId, momentOf(world)),
    ),
  );
};

When(
  "the reader signed in to the account for {string} revokes that key",
  async function (this: SpecWorld, address: string) {
    const account = await accountAt(this, address);
    await revokeAs(this, account.id.value, lastKeyMade(this).id);
  },
);

When(
  "the reader signed in to the account for {string} revokes the {word} key",
  async function (this: SpecWorld, address: string, place: string) {
    const account = await accountAt(this, address);
    await revokeAs(this, account.id.value, keyMadeAt(this, place).id);
  },
);

// A well-formed id of a key nobody made.
When(
  "the reader signed in to the account for {string} revokes a key that was never made",
  async function (this: SpecWorld, address: string) {
    const account = await accountAt(this, address);
    await revokeAs(this, account.id.value, ApiKeyId.create().value);
  },
);

// The key of another account, named by the id its own account's list carries.
When(
  "the reader signed in to the account for {string} revokes the key of the account for {string}",
  async function (this: SpecWorld, address: string, other: string) {
    const account = await accountAt(this, address);
    const theirs = apiKeysOf(this).made.find((each) => each.address === other);
    assert.ok(theirs !== undefined, `${other} has made no key.`);
    await revokeAs(this, account.id.value, theirs.key.id);
  },
);

When(
  "the reader signed in to the account for {string} revokes the key {string}",
  async function (this: SpecWorld, address: string, written: string) {
    const account = await accountAt(this, address);
    await revokeAs(this, account.id.value, written);
  },
);

// For an account no longer found by its address, as a forgotten one is not.
When(
  "the reader signed in to that account revokes that key",
  async function (this: SpecWorld) {
    assert.ok(this.accountHeld !== undefined, "The scenario holds no account.");
    await revokeAs(this, this.accountHeld, lastKeyMade(this).id);
  },
);

Then(
  "the last thing the account for {string} recorded is a key being revoked",
  async function (this: SpecWorld, address: string) {
    const last =
      (await registeringOf(this).everythingKeptFor(address))
        .trim()
        .split("\n")
        .at(-1) ?? "";
    assert.ok(last.includes("account-api-key-revoked"), `The last is ${last}.`);
  },
);

Then(
  "the account for {string} has recorded {int} revoking of a key",
  async function (this: SpecWorld, address: string, times: number) {
    const kept = await registeringOf(this).everythingKeptFor(address);
    assert.equal(kept.split("account-api-key-revoked").length - 1, times);
  },
);
