import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createDecipheriv, createHash } from "node:crypto";
import { inspect } from "node:util";

import { Account } from "../../../../src/domain/aggregates/accounts/Account.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { AccountId } from "../../../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { AccountKeys } from "../../../../src/infrastructure/encryption/AccountKeys.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  accountsOf,
  aSiteKey,
  keepAccounts,
  keptAt,
  readBack,
  registerFor,
  storesFor,
} from "../../support/accounts.js";
import { aQueue, queueingOf } from "../../support/emailQueue.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What a scenario has besides what keeps its accounts: the site's key it names
// before there is a store, a new one it changes to, what was kept before it
// changed anything, the accounts it read back, and two encryptions to compare.
interface Keys {
  siteKey?: string;
  newSiteKey?: string;
  eventsBefore?: string[];
  eventCount?: number;
  readBack: Account[];
  encryptions: string[];
}

const scenarios = new WeakMap<SpecWorld, Keys>();

const keysOf = (world: SpecWorld): Keys => {
  let found = scenarios.get(world);
  if (found === undefined) {
    found = { readBack: [], encryptions: [] };
    scenarios.set(world, found);
  }
  return found;
};

// What an account's key is, read the way the store reads it: from its row,
// with the site's key. Only a scenario that has to see the key itself does
// this, to show it is kept nowhere as it is.
const keyOf = async (world: SpecWorld, id: AccountId): Promise<Buffer> => {
  const { rows } = await world.database.query<{ key: Buffer }>(
    `select key from account_keys where account_id = $1`,
    [id.value],
  );
  const kept = rows[0]?.key;
  assert.ok(kept !== undefined, `${id.value} has no key.`);
  const siteKey = createHash("sha256")
    .update(accountsOf(world).siteKey)
    .digest();
  const decipher = createDecipheriv(
    "aes-256-gcm",
    siteKey,
    kept.subarray(0, 12),
  );
  decipher.setAAD(Buffer.from(id.value));
  decipher.setAuthTag(kept.subarray(12, 28));
  return Buffer.concat([decipher.update(kept.subarray(28)), decipher.final()]);
};

const eventsAsText = async (world: SpecWorld): Promise<string[]> => {
  const { rows } = await world.database.query<{ row: string }>(
    `select stream_id || ':' || version || ':' || data::text as row
       from events order by stream_id, version`,
  );
  return rows.map(({ row }) => row);
};

// The name is kept with the confirming, which is where it is given: an
// account's registering holds its email address and nothing else.
const keptNameOf = async (world: SpecWorld, id: AccountId): Promise<string> => {
  const { rows } = await world.database.query<{ name: string }>(
    `select data->>'name' as name from events
      where stream_id = $1 and name = 'account-email-address-confirmed'`,
    [id.value],
  );
  const name = rows[0]?.name;
  assert.ok(name !== undefined, `${id.value} kept no name.`);
  return name;
};

const replaceKeptName = async (
  world: SpecWorld,
  id: AccountId,
  kept: string,
): Promise<void> => {
  await world.database.query(
    `update events set data = jsonb_set(data, '{name}', to_jsonb($2::text))
      where stream_id = $1 and name = 'account-email-address-confirmed'`,
    [id.value, kept],
  );
};

const readBackAs = async (
  world: SpecWorld,
  id: AccountId,
  store = accountsOf(world).store,
): Promise<void> => {
  // Whatever account the scenario had is not what was read back, so it is let
  // go first: a reading that fails leaves nothing to be asked about.
  world.aggregate = undefined;
  try {
    const account = await readBack(world, id, store);
    world.aggregate = account;
    keysOf(world).readBack.push(account);
  } catch (failure) {
    world.failure = failure;
  }
};

// The site's key and the store ---------------------------------------------

Given("the site's key", function (this: SpecWorld) {
  keysOf(this).siteKey = aSiteKey();
});

Given("an account key store", function (this: SpecWorld) {
  keepAccounts(this, keysOf(this).siteKey ?? aSiteKey());
});

When(
  "an account key store is made with no site's key",
  function (this: SpecWorld) {
    try {
      new AccountKeys(unitOfWorkOf(this), undefined);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Given(
  "the account key store is made again with a different site's key",
  function (this: SpecWorld) {
    const { store } = storesFor(this, aSiteKey());
    accountsOf(this).store = store;
  },
);

When(
  "the site's key is changed to a new one",
  async function (this: SpecWorld) {
    const newSiteKey = aSiteKey();
    keysOf(this).newSiteKey = newSiteKey;
    keysOf(this).eventsBefore = await eventsAsText(this);
    const { keys } = accountsOf(this);
    await this.asARequest(() => keys.changeSiteKey(newSiteKey));
  },
);

// Accounts -----------------------------------------------------------------

When(
  "another account is registered at {string}",
  async function (this: SpecWorld, address: string) {
    await registerFor(this, address);
  },
);

Given(
  "an account {string} is registered at {string}",
  async function (this: SpecWorld, id: string, address: string) {
    await registerFor(this, address, AccountId.from(id));
  },
);

Then("the account has a key", async function (this: SpecWorld) {
  await keyOf(this, keptAt(this, 1));
});

// A stream nobody has added to is at version 0, so an append expecting it at
// 1 is one whose writer read the stream before somebody else added to it.
When(
  "an account is registered expecting its stream to have been added to",
  async function (this: SpecWorld) {
    assert.ok(this.moment !== undefined, "No moment has been named.");
    const account = Account.register(
      AccountId.create(),
      EmailAddress.from("someone@example.com"),
      "stand-in$hash",
      ReadOnlyDate.from(this.moment),
    );
    const { store } = accountsOf(this);
    try {
      await this.asARequest(() =>
        store.appendEvents(account.id, 1, account.handOver()),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then("no key was made", async function (this: SpecWorld) {
  const { rows } = await this.database.query(`select 1 from account_keys`);
  assert.equal(rows.length, 0, "A key was made.");
});

Then("the account has no key", async function (this: SpecWorld) {
  const { rows } = await this.database.query(
    `select 1 from account_keys where account_id = $1`,
    [keptAt(this, 1).value],
  );
  assert.equal(rows.length, 0, "The account still has a key.");
});

Then("the two accounts' keys differ", async function (this: SpecWorld) {
  const first = await keyOf(this, keptAt(this, 1));
  const second = await keyOf(this, keptAt(this, 2));
  assert.ok(!first.equals(second), "The two accounts have the same key.");
});

Then(
  "no row of the account key store contains the account's key",
  async function (this: SpecWorld) {
    const key = await keyOf(this, keptAt(this, 1));
    const { rows } = await this.database.query<{ row: string }>(
      `select encode(key, 'hex') || ':' || encode(key, 'base64') as row
         from account_keys`,
    );
    for (const { row } of rows) {
      assert.ok(!row.includes(key.toString("hex")), `A row holds it: ${row}`);
      assert.ok(
        !row.includes(key.toString("base64")),
        `A row holds it: ${row}`,
      );
    }
  },
);

// What is kept -------------------------------------------------------------

Then(
  "nothing kept of the account's events contains {string}",
  async function (this: SpecWorld, words: string) {
    for (const row of await eventsAsText(this)) {
      assert.ok(!row.includes(words), `An event holds it: ${row}`);
    }
  },
);

Then("what is kept of the two names differs", async function (this: SpecWorld) {
  const first = await keptNameOf(this, keptAt(this, 1));
  const second = await keptNameOf(this, keptAt(this, 2));
  assert.notEqual(first, second);
});

When(
  "{string} is encrypted for the account twice",
  async function (this: SpecWorld, text: string) {
    const { keys } = accountsOf(this);
    const id = keptAt(this, 1);
    for (let time = 0; time < 2; time++) {
      const encrypted = await this.asARequest(() => keys.encrypt(id, text));
      keysOf(this).encryptions.push(encrypted);
    }
  },
);

Then("the two encryptions differ", function (this: SpecWorld) {
  const [first, second] = keysOf(this).encryptions;
  assert.ok(first !== undefined && second !== undefined, "Nothing twice.");
  assert.notEqual(first, second);
});

Then(
  "every event is kept exactly as it was before",
  async function (this: SpecWorld) {
    assert.deepEqual(await eventsAsText(this), keysOf(this).eventsBefore);
  },
);

// Changing what is kept ------------------------------------------------------

Given(
  "what is kept of the account's name has been altered in the database",
  async function (this: SpecWorld) {
    const id = keptAt(this, 1);
    const kept = await keptNameOf(this, id);
    // One character of what was encrypted, changed to another.
    const at = kept.length - 5;
    const changed = kept[at] === "A" ? "B" : "A";
    await replaceKeptName(
      this,
      id,
      kept.slice(0, at) + changed + kept.slice(at + 1),
    );
  },
);

Given(
  "what is kept of the first account's name has been copied over the second account's in the database",
  async function (this: SpecWorld) {
    const first = await keptNameOf(this, keptAt(this, 1));
    await replaceKeptName(this, keptAt(this, 2), first);
  },
);

// Deleting keys --------------------------------------------------------------

When("the account's key is deleted", async function (this: SpecWorld) {
  const { keys } = accountsOf(this);
  const id = keptAt(this, 1);
  keysOf(this).eventCount = (await eventsAsText(this)).length;
  await this.asARequest(() => keys.forget(id));
});

When("the first account's key is deleted", async function (this: SpecWorld) {
  const { keys } = accountsOf(this);
  const id = keptAt(this, 1);
  await this.asARequest(() => keys.forget(id));
});

Then(
  "the account's events are all still kept",
  async function (this: SpecWorld) {
    const before = keysOf(this).eventCount;
    assert.ok(before !== undefined, "No key has been deleted.");
    assert.equal((await eventsAsText(this)).length, before);
  },
);

// Reading back ---------------------------------------------------------------

When("the account is read back", async function (this: SpecWorld) {
  await readBackAs(this, keptAt(this, 1));
});

When("the second account is read back", async function (this: SpecWorld) {
  await readBackAs(this, keptAt(this, 2));
});

When("the account is read back twice", async function (this: SpecWorld) {
  await readBackAs(this, keptAt(this, 1));
  await readBackAs(this, keptAt(this, 1));
});

When(
  "the account is read back with the new site's key",
  async function (this: SpecWorld) {
    const newSiteKey = keysOf(this).newSiteKey;
    assert.ok(newSiteKey !== undefined, "The site's key has not been changed.");
    const { store } = storesFor(this, newSiteKey);
    await readBackAs(this, keptAt(this, 1), store);
  },
);

When(
  "what is queued is sent with the new site's key",
  async function (this: SpecWorld) {
    const newSiteKey = keysOf(this).newSiteKey;
    assert.ok(newSiteKey !== undefined, "The site's key has not been changed.");
    const { writer, sender } = queueingOf(this);
    const { keys } = storesFor(this, newSiteKey);
    assert.ok(this.moment !== undefined, "No moment has been named.");
    await aQueue(this, keys, writer, sender).sendDue(
      ReadOnlyDate.from(this.moment),
    );
  },
);

Then(
  "reading it is refused with {string}",
  function (this: SpecWorld, code: string) {
    const said = (this.failure as { code?: unknown } | undefined)?.code;
    assert.equal(said, code, `It was refused with ${inspect(this.failure)}.`);
  },
);

Then("it is called the same both times", function (this: SpecWorld) {
  const [first, second] = keysOf(this).readBack;
  assert.ok(first !== undefined && second !== undefined, "Not read twice.");
  assert.ok(first.name !== undefined, "It is called nothing.");
  assert.equal(first.name.toString(), second.name?.toString());
});

Then(
  "it is reached at the same address both times",
  function (this: SpecWorld) {
    const [first, second] = keysOf(this).readBack;
    assert.ok(first !== undefined && second !== undefined, "Not read twice.");
    assert.equal(first.emailAddress.toString(), second.emailAddress.toString());
  },
);
