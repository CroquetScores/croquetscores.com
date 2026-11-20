import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";

import type { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import { ApiKeyId } from "../../../../src/domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyCreated } from "../../../../src/domain/aggregates/accounts/events/ApiKeyCreated.js";
import { ApiKeyLimitsChanged } from "../../../../src/domain/aggregates/accounts/events/ApiKeyLimitsChanged.js";
import { ApiKeyRevoked } from "../../../../src/domain/aggregates/accounts/events/ApiKeyRevoked.js";
import { ApiKeyLabel } from "../../../../src/domain/aggregates/accounts/value-objects/ApiKeyLabel.js";
import { ApiKeyLimits } from "../../../../src/domain/aggregates/accounts/value-objects/ApiKeyLimits.js";
import { ApiKeyScope } from "../../../../src/domain/aggregates/accounts/value-objects/ApiKeyScope.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import type { StoredEvent } from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  accountsOf,
  aSiteKey,
  keepAccounts,
  readBack,
} from "../../support/accounts.js";
import { rebuildFromEvents } from "../../support/rebuild.js";
import { rebuildsWith } from "../../support/projections.js";

// What a scenario is saying of the key it is about to make, and of the keys it
// has made. A key is made with what the last steps said of it, and then what
// was said is forgotten, so that each key says everything about itself.
interface Scenario {
  scope: "read" | "read-and-write";
  tournament: string | undefined;
  /** What the next key is made with, each said by a step of its own. */
  perMinute: number;
  perDay: number;
  /** What the next change of limits sets, each said by a step of its own. */
  newPerMinute: number | undefined;
  newPerDay: number | undefined;
  /** Every key made, by what the scenario calls it. */
  readonly made: Map<string, { account: AccountId; id: ApiKeyId }>;
  /** What the last look for a key found. */
  found: Awaited<ReturnType<typeof look>>;
  noted: string[];
}

// Not a tournament that exists: the read model keeps the id it is told and
// asks nothing of it.
const aTournament = "tournament-a";

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let found = scenarios.get(world);
  if (found === undefined) {
    found = {
      scope: "read",
      tournament: undefined,
      perMinute: ApiKeyLimits.usual().perMinute,
      perDay: ApiKeyLimits.usual().perDay,
      newPerMinute: undefined,
      newPerDay: undefined,
      made: new Map(),
      found: undefined,
      noted: [],
    };
    scenarios.set(world, found);
  }
  return found;
};

// A key is never kept, only its hash, so a scenario's key is a name and the
// hash is made of it.
const hashOf = (name: string): string =>
  createHash("sha256").update(`a key called ${name}`).digest("hex");

const moment = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const accountFor = (world: SpecWorld, address: string): AccountId => {
  const id = accountsOf(world).byAddress.get(
    EmailAddress.from(address).comparable,
  )?.[0];
  assert.ok(id !== undefined, `No account was registered for ${address}.`);
  return id;
};

const keyNamed = (world: SpecWorld, name: string) => {
  const found = scenarioOf(world).made.get(name);
  assert.ok(found !== undefined, `No key called ${name} was made.`);
  return found;
};

const look = (world: SpecWorld, name: string) =>
  world.asARequest(() => accountsOf(world).byApiKey.findByHash(hashOf(name)));

const rowsAsText = async (world: SpecWorld): Promise<string[]> => {
  const { rows } = await world.database.query<{ row: string }>(
    `select t::text as row from accounts_by_api_key t order by key_id`,
  );
  return rows.map(({ row }) => row);
};

const keepingFailure = async (
  world: SpecWorld,
  change: () => Promise<void>,
): Promise<void> => {
  world.failure = undefined;
  try {
    await change();
  } catch (failure) {
    world.failure = failure;
  }
};

Given("the accounts by API key read model", function (this: SpecWorld) {
  keepAccounts(this, aSiteKey());
  rebuildsWith(this, async () => {
    const { byApiKey, store } = accountsOf(this);
    await this.asARequest(async () =>
      rebuildFromEvents(byApiKey, await store.readAll()),
    );
  });
});

// Saying what the next key is like -----------------------------------------

Given("the next key may read and write", function (this: SpecWorld) {
  scenarioOf(this).scope = "read-and-write";
});

Given("the next key is limited to a tournament", function (this: SpecWorld) {
  scenarioOf(this).tournament = aTournament;
});

Given(
  "the next key is to make {int} requests a minute",
  function (this: SpecWorld, perMinute: number) {
    scenarioOf(this).perMinute = perMinute;
  },
);

Given(
  "the next key is to make {int} requests a day",
  function (this: SpecWorld, perDay: number) {
    scenarioOf(this).perDay = perDay;
  },
);

Given(
  "the new limit is {int} requests a minute",
  function (this: SpecWorld, perMinute: number) {
    scenarioOf(this).newPerMinute = perMinute;
  },
);

Given(
  "the new limit is {int} requests a day",
  function (this: SpecWorld, perDay: number) {
    scenarioOf(this).newPerDay = perDay;
  },
);

// Changing keys ---------------------------------------------------------------

// Made as an account makes one and kept by the projecting store, so that what
// the read model sees is what making a key writes. A refusal is kept for the
// scenario rather than thrown.
Given(
  "the account for {string} makes the key {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const scenario = scenarioOf(this);
    const id = ApiKeyId.create();
    const account = await readBack(this, accountFor(this, address));
    await keepingFailure(this, async () => {
      account.createApiKey(
        id,
        hashOf(name),
        ApiKeyLabel.from(name),
        ApiKeyScope.from(scenario.scope),
        scenario.tournament,
        ApiKeyLimits.from(scenario.perMinute, scenario.perDay),
        moment(this),
      );
      await this.keepAccount?.(account);
      scenario.made.set(name, { account: account.id, id });
    });
    scenario.scope = "read";
    scenario.tournament = undefined;
    scenario.perMinute = ApiKeyLimits.usual().perMinute;
    scenario.perDay = ApiKeyLimits.usual().perDay;
  },
);

When(
  "the account for {string} revokes the key {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const { id } = keyNamed(this, name);
    const account = await readBack(this, accountFor(this, address));
    account.revokeApiKey(id, moment(this));
    await this.keepAccount?.(account);
  },
);

// Changed through the account that owns the key. The read model does not ask
// who changed the limits, only that they changed, so which account did it
// would make no difference to the row, and the scenarios do not claim one.
When(
  "the limits of the key {string} are changed",
  async function (this: SpecWorld, name: string) {
    const scenario = scenarioOf(this);
    const { newPerMinute, newPerDay } = scenario;
    assert.ok(
      newPerMinute !== undefined && newPerDay !== undefined,
      "Both new limits have to be said first.",
    );
    const { account: owner, id } = keyNamed(this, name);
    const account = await readBack(this, owner);
    account.changeApiKeyLimits(
      id,
      ApiKeyLimits.from(newPerMinute, newPerDay),
      owner,
      moment(this),
    );
    await this.keepAccount?.(account);
    scenario.newPerMinute = undefined;
    scenario.newPerDay = undefined;
  },
);

// Asking ----------------------------------------------------------------------

When(
  "the key {string} is looked for",
  async function (this: SpecWorld, name: string) {
    scenarioOf(this).found = await look(this, name);
  },
);

const found = (world: SpecWorld) => {
  const key = scenarioOf(world).found;
  assert.ok(key !== undefined, "No key was found.");
  return key;
};

Then("a key is found", function (this: SpecWorld) {
  found(this);
});

Then("no key is found", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).found, undefined);
});

Then(
  "the key found belongs to the account for {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(found(this).account.value, accountFor(this, address).value);
  },
);

Then("the key found may read", function (this: SpecWorld) {
  assert.equal(found(this).mayRead, true);
});

Then("the key found may write", function (this: SpecWorld) {
  assert.equal(found(this).mayWrite, true);
});

Then("the key found may not write", function (this: SpecWorld) {
  assert.equal(found(this).mayWrite, false);
});

Then("the key found is limited to that tournament", function (this: SpecWorld) {
  assert.equal(found(this).tournament, aTournament);
});

Then("the key found is limited to no tournament", function (this: SpecWorld) {
  assert.equal(found(this).tournament, undefined);
});

Then(
  "the key found may make {int} requests a minute",
  function (this: SpecWorld, perMinute: number) {
    assert.equal(found(this).perMinute, perMinute);
  },
);

Then(
  "the key found may make {int} requests a day",
  function (this: SpecWorld, perDay: number) {
    assert.equal(found(this).perDay, perDay);
  },
);

// Its table ---------------------------------------------------------------------

Then(
  "the table of keys holds {int} row(s)",
  async function (this: SpecWorld, count: number) {
    assert.equal((await rowsAsText(this)).length, count);
  },
);

Then(
  "no row of the table of keys contains {string}",
  async function (this: SpecWorld, words: string) {
    for (const row of await rowsAsText(this)) {
      assert.ok(!row.includes(words), `A row holds it: ${row}`);
    }
  },
);

Then(
  "the row of the key {string} was last changed at {string}",
  async function (this: SpecWorld, name: string, at: string) {
    const { rows } = await this.database.query<{ changed_at: Date }>(
      `select changed_at from accounts_by_api_key where key_hash = $1`,
      [hashOf(name)],
    );
    const [row] = rows;
    assert.ok(row !== undefined, `The table has no row for ${name}.`);
    assert.equal(row.changed_at.toISOString(), new Date(at).toISOString());
  },
);

// Projecting again, and making it again ----------------------------------------

// The account's events as its stream holds them, with the version of each,
// found by the kind and the key the scenario names.
const projectAgain = async (
  world: SpecWorld,
  name: string,
  isOne: (event: DomainEvent, keyId: string) => boolean,
): Promise<void> => {
  const { account, id } = keyNamed(world, name);
  const { byApiKey, store } = accountsOf(world);
  const events = await world.asARequest(() => store.getEvents(account));
  const at = events.findIndex((event) => isOne(event, id.value));
  assert.ok(at >= 0, `The account kept no such event for ${name}.`);
  const event = events[at];
  assert.ok(event !== undefined);
  await world.asARequest(() => byApiKey.project(account, at + 1, [event]));
};

When(
  "the making of the key {string} is projected again",
  async function (this: SpecWorld, name: string) {
    await projectAgain(
      this,
      name,
      (event, keyId) => event instanceof ApiKeyCreated && event.keyId === keyId,
    );
  },
);

When(
  "the limits of the key {string} are projected again",
  async function (this: SpecWorld, name: string) {
    await projectAgain(
      this,
      name,
      (event, keyId) =>
        event instanceof ApiKeyLimitsChanged && event.keyId === keyId,
    );
  },
);

When(
  "the revoking of the key {string} is projected again",
  async function (this: SpecWorld, name: string) {
    await projectAgain(
      this,
      name,
      (event, keyId) => event instanceof ApiKeyRevoked && event.keyId === keyId,
    );
  },
);

Given(
  "the rows of the table of keys are noted",
  async function (this: SpecWorld) {
    scenarioOf(this).noted = await rowsAsText(this);
  },
);

Then(
  "the rows of the table of keys are as they were noted",
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
  "the table of keys is made again with the newest account first",
  async function (this: SpecWorld) {
    const { byApiKey, store, kept } = accountsOf(this);
    const newestFirst = [...kept].reverse();
    await keepingFailure(this, async () => {
      await this.asARequest(async () => {
        const events: readonly StoredEvent[] = await store.readAll();
        await rebuildFromEvents(
          byApiKey,
          newestFirst.flatMap((account) =>
            events.filter(({ stream }) => stream === account.value),
          ),
        );
      });
    });
  },
);
