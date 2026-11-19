import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ChangeApiKeyLimits } from "../../../../../src/application/operations/accounts/ChangeApiKeyLimits.js";
import { ApiKeyId } from "../../../../../src/domain/aggregates/accounts/ApiKeyId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  keepingWhatCameOf,
  keyMadeAt,
  lastKeyMade,
} from "../apiKeyRequests.js";
import { accountAt, momentOf, registeringOf } from "../roleRequests.js";

const change = async (
  world: SpecWorld,
  address: string,
  keyId: string,
  perMinute: number,
  perDay: number,
): Promise<void> => {
  const account = await accountAt(world, address);
  await keepingWhatCameOf(world, async () =>
    registeringOf(world).changeApiKeyLimits(
      new ChangeApiKeyLimits(
        account.id.value,
        keyId,
        perMinute,
        perDay,
        momentOf(world),
      ),
    ),
  );
};

// The administrator and the reader who is not one ask in the same words but
// for who they are; which of them it is, is the address's.
When(
  "the administrator {string} changes that key to {int} requests a minute and {int} a day",
  async function (
    this: SpecWorld,
    address: string,
    perMinute: number,
    perDay: number,
  ) {
    await change(this, address, lastKeyMade(this).id, perMinute, perDay);
  },
);

When(
  "the administrator {string} changes the {word} key to {int} requests a minute and {int} a day",
  async function (
    this: SpecWorld,
    address: string,
    place: string,
    perMinute: number,
    perDay: number,
  ) {
    await change(this, address, keyMadeAt(this, place).id, perMinute, perDay);
  },
);

When(
  "the reader signed in to the account for {string} changes that key to {int} requests a minute and {int} a day",
  async function (
    this: SpecWorld,
    address: string,
    perMinute: number,
    perDay: number,
  ) {
    await change(this, address, lastKeyMade(this).id, perMinute, perDay);
  },
);

When(
  "the administrator {string} changes a key that was never made to {int} requests a minute and {int} a day",
  async function (
    this: SpecWorld,
    address: string,
    perMinute: number,
    perDay: number,
  ) {
    await change(this, address, ApiKeyId.create().value, perMinute, perDay);
  },
);

Then(
  "the last thing the account for {string} recorded is the limits of a key being changed",
  async function (this: SpecWorld, address: string) {
    const last =
      (await registeringOf(this).everythingKeptFor(address))
        .trim()
        .split("\n")
        .at(-1) ?? "";
    assert.ok(
      last.includes("account-api-key-limits-changed"),
      `The last is ${last}.`,
    );
  },
);

Then(
  "the account for {string} has recorded no change of the limits of a key",
  async function (this: SpecWorld, address: string) {
    assert.ok(
      !(await registeringOf(this).everythingKeptFor(address)).includes(
        "account-api-key-limits-changed",
      ),
      "A change of the limits was recorded.",
    );
  },
);
