import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { StoredEvent } from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  accountsOf,
  aSiteKey,
  keepAccounts,
  readBack,
} from "../../support/accounts.js";
import { rebuildsWith } from "../../support/projections.js";
import { rebuildFromEvents } from "../../support/rebuild.js";

// What the last look for a name found, and the rows noted to be compared.
interface Scenario {
  found: string | undefined;
  noted: string[];
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let found = scenarios.get(world);
  if (found === undefined) {
    found = { found: undefined, noted: [] };
    scenarios.set(world, found);
  }
  return found;
};

const accountFor = (world: SpecWorld, address: string): AccountId => {
  const id = accountsOf(world).byAddress.get(
    EmailAddress.from(address).comparable,
  )?.[0];
  assert.ok(id !== undefined, `No account was registered for ${address}.`);
  return id;
};

const rowsAsText = async (world: SpecWorld): Promise<string[]> => {
  const { rows } = await world.database.query<{ row: string }>(
    `select t::text as row from account_names t order by account_id`,
  );
  return rows.map(({ row }) => row);
};

Given("the account names read model", function (this: SpecWorld) {
  keepAccounts(this, aSiteKey());
  rebuildsWith(this, async () => {
    const { byName, store } = accountsOf(this);
    await this.asARequest(async () =>
      rebuildFromEvents(byName, await store.readAll()),
    );
  });
});

Given(
  "the account for {string} changes its name to {string}",
  async function (this: SpecWorld, address: string, name: string) {
    assert.ok(this.moment !== undefined, "No moment has been named.");
    const account = await readBack(this, accountFor(this, address));
    account.changeName(PersonName.from(name), ReadOnlyDate.from(this.moment));
    await this.keepAccount?.(account);
  },
);

When(
  "the name of the account for {string} is looked for",
  async function (this: SpecWorld, address: string) {
    const id = accountFor(this, address);
    const names = await this.asARequest(() =>
      accountsOf(this).byName.of([id.value]),
    );
    scenarioOf(this).found = names.get(id.value);
  },
);

Then("the name found is {string}", function (this: SpecWorld, name: string) {
  assert.equal(scenarioOf(this).found, name);
});

Then("no name is found", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).found, undefined);
});

Then(
  "the row of the account for {string} was last changed at {string}",
  async function (this: SpecWorld, address: string, at: string) {
    const { rows } = await this.database.query<{ changed_at: Date }>(
      `select changed_at from account_names where account_id = $1`,
      [accountFor(this, address).value],
    );
    const [row] = rows;
    assert.ok(row !== undefined, `The table has no row for ${address}.`);
    assert.equal(row.changed_at.toISOString(), new Date(at).toISOString());
  },
);

Given(
  "the rows of the table of names are noted",
  async function (this: SpecWorld) {
    scenarioOf(this).noted = await rowsAsText(this);
  },
);

Then(
  "the rows of the table of names are as they were noted",
  async function (this: SpecWorld) {
    const noted = scenarioOf(this).noted;
    assert.ok(noted.length > 0, "No rows were noted.");
    assert.deepEqual(await rowsAsText(this), noted);
  },
);

// The event store reads stream by stream, and a stream is named by a random
// uuid, so which it hands over first is chance. Handing over the newest
// account first is the order that catches a rebuild that needs the older one
// read first, every time.
When(
  "the table of names is made again with the newest account first",
  async function (this: SpecWorld) {
    const { byName, store, kept } = accountsOf(this);
    const newestFirst = [...kept].reverse();
    this.failure = undefined;
    try {
      await this.asARequest(async () => {
        const events: readonly StoredEvent[] = await store.readAll();
        await rebuildFromEvents(
          byName,
          newestFirst.flatMap((account) =>
            events.filter(({ stream }) => stream === account.value),
          ),
        );
      });
    } catch (failure) {
      this.failure = failure;
    }
  },
);
