import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { IdentifyApiKey } from "../../../../../src/application/operations/accounts/IdentifyApiKey.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  apiKeysOf,
  keepingWhatCameOf,
  keyMadeAt,
  lastKeyMade,
} from "../apiKeyRequests.js";
import { accountAt, registeringOf } from "../roleRequests.js";

// What was last presented, kept with what came of it: who it acts as, or that
// it is known to nobody.
const present = async (world: SpecWorld, key: unknown): Promise<void> => {
  await keepingWhatCameOf(world, async () =>
    registeringOf(world).identifyApiKey(new IdentifyApiKey(key as string)),
  );
  const scenario = apiKeysOf(world);
  scenario.presented = world.failure === undefined;
  scenario.identified = world.answer as typeof scenario.identified;
};

const identified = (world: SpecWorld) => {
  const { identified: found } = apiKeysOf(world);
  assert.ok(found !== undefined, "The key is known to nobody.");
  return found;
};

When("that key is presented", async function (this: SpecWorld) {
  await present(this, lastKeyMade(this).key);
});

When(
  "the {word} key is presented",
  async function (this: SpecWorld, place: string) {
    await present(this, keyMadeAt(this, place).key);
  },
);

When(
  "the key {string} is presented",
  async function (this: SpecWorld, key: string) {
    await present(this, key);
  },
);

// Every letter of a key counts, so one that is nearly right is not.
When(
  "that key is presented with its last letter changed",
  async function (this: SpecWorld) {
    const { key } = lastKeyMade(this);
    const last = key.at(-1) === "a" ? "b" : "a";
    await present(this, `${key.slice(0, -1)}${last}`);
  },
);

When(
  "something that is not text is presented as a key",
  async function (this: SpecWorld) {
    await present(this, 42);
  },
);

Then(
  "the key belongs to the account for {string}",
  async function (this: SpecWorld, address: string) {
    const account = await accountAt(this, address);
    assert.equal(identified(this).account, account.id.value);
  },
);

Then("the key may read", function (this: SpecWorld) {
  assert.equal(identified(this).mayRead, true);
});

Then("the key may not write", function (this: SpecWorld) {
  assert.equal(identified(this).mayWrite, false);
});

Then("the key may write", function (this: SpecWorld) {
  assert.equal(identified(this).mayWrite, true);
});

Then("the key is limited to that tournament", function (this: SpecWorld) {
  const expected = apiKeysOf(this).tournament;
  assert.ok(expected !== undefined, "No tournament was named.");
  assert.equal(identified(this).tournament, expected);
});

Then("the key is not limited to a tournament", function (this: SpecWorld) {
  assert.equal(identified(this).tournament, undefined);
});

Then(
  "the key may make {int} requests a minute",
  function (this: SpecWorld, count: number) {
    assert.equal(identified(this).perMinute, count);
  },
);

Then("the key is the second key", function (this: SpecWorld) {
  assert.equal(identified(this).keyId, keyMadeAt(this, "second").id);
});

Then("the key is known to nobody", function (this: SpecWorld) {
  assert.equal(this.failure, undefined, "It was refused.");
  assert.equal(apiKeysOf(this).identified, undefined);
  assert.equal(apiKeysOf(this).presented, true);
});
