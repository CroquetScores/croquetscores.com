import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  ApiKeysOfEveryAccount,
  type ApiKeyOfAnAccount,
} from "../../../../../src/application/operations/accounts/ApiKeysOfEveryAccount.js";
import type { SpecWorld } from "../../../../support/world.js";
import { keepingWhatCameOf, ORDINALS } from "../apiKeyRequests.js";
import { accountAt, registeringOf } from "../roleRequests.js";

const list = async (world: SpecWorld, address: string): Promise<void> => {
  const account = await accountAt(world, address);
  await keepingWhatCameOf(world, async () =>
    registeringOf(world).apiKeysOfEveryAccount(
      new ApiKeysOfEveryAccount(account.id.value),
    ),
  );
};

// The administrator and the reader who is not one ask in the same words but
// for who they are; which of them it is, is the address's.
When(
  "the administrator {string} lists the keys of every account",
  async function (this: SpecWorld, address: string) {
    await list(this, address);
  },
);

When(
  "the reader signed in to the account for {string} lists the keys of every account",
  async function (this: SpecWorld, address: string) {
    await list(this, address);
  },
);

const listed = (world: SpecWorld): readonly ApiKeyOfAnAccount[] => {
  assert.ok(
    world.failure === undefined,
    `Asking failed: ${String(world.failure)}`,
  );
  return world.answer as readonly ApiKeyOfAnAccount[];
};

const listedAt = (world: SpecWorld, place: string): ApiKeyOfAnAccount => {
  const found = listed(world)[ORDINALS.indexOf(place)];
  assert.ok(found !== undefined, `No key is listed ${place}.`);
  return found;
};

Then(
  "{int} key is listed of every account",
  function (this: SpecWorld, count: number) {
    assert.equal(listed(this).length, count);
  },
);

Then(
  "{int} keys are listed of every account",
  function (this: SpecWorld, count: number) {
    assert.equal(listed(this).length, count);
  },
);

Then(
  "the {word} key of every account is labelled {string}",
  function (this: SpecWorld, place: string, label: string) {
    assert.equal(listedAt(this, place).label, label);
  },
);

Then(
  "the {word} key of every account belongs to {string}",
  function (this: SpecWorld, place: string, owner: string) {
    assert.equal(listedAt(this, place).owner, owner);
  },
);

Then(
  "the {word} key of every account may make {int} requests a minute",
  function (this: SpecWorld, place: string, count: number) {
    assert.equal(listedAt(this, place).perMinute, count);
  },
);

Then(
  "the {word} key of every account may make {int} requests a day",
  function (this: SpecWorld, place: string, count: number) {
    assert.equal(listedAt(this, place).perDay, count);
  },
);
