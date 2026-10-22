import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AggregateRepository } from "../../../src/application/common/AggregateRepository.js";
import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { RoleAdded } from "../../../src/domain/aggregates/accounts/events/RoleAdded.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import {
  isRole,
  type Role,
} from "../../../src/domain/aggregates/accounts/value-objects/Role.js";
import {
  GiveRoles,
  type RoleHolders,
} from "../../../src/import-ravendb/GiveRoles.js";
import { accountsOf, readBack } from "../../infrastructure/support/accounts.js";
import { unitOfWorkOf } from "../../infrastructure/support/transactions.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";

const AT = ReadOnlyDate.from(new Date("2026-10-07T10:00:00Z"));

interface Giving {
  readonly giver: GiveRoles;
  readonly named: Partial<Record<Role, string[]>>;
  withNoAccount?: readonly string[];
}

const giving = new WeakMap<SpecWorld, Giving>();

const givingOf = (world: SpecWorld): Giving => {
  const found = giving.get(world);
  assert.ok(found !== undefined, "No roles are to be given.");
  return found;
};

// Into the same store the users were imported into, as the import does.
Given("the site's roles are to be given", function (this: SpecWorld) {
  const accounts = accountsOf(this);
  giving.set(this, {
    giver: new GiveRoles(
      unitOfWorkOf(this),
      new AggregateRepository(
        new ProjectingEventStore(accounts.store, [
          accounts.readModel,
          accounts.byGoogleAccount,
        ]),
        (id: AccountId, events) => Account.rebuiltFrom(id, events),
      ),
      importDatabaseOf(this),
    ),
    named: {},
  });
});

// A role as a feature names it, "Administrator" or "World Ranking Officer",
// and as the account keeps it.
const roleCalled = (name: string): Role => {
  const role = name.toLowerCase().replaceAll(" ", "-");
  assert.ok(isRole(role), `There is no role called ${name}.`);
  return role;
};

Given(
  "{string} is named to hold the role {string}",
  function (this: SpecWorld, address: string, role: string) {
    const { named } = givingOf(this);
    (named[roleCalled(role)] ??= []).push(address);
  },
);

// Said as a Given to set a scene and as a When to act, and matched as either.
When("the roles are given", async function (this: SpecWorld) {
  const state = givingOf(this);
  const holders: RoleHolders = state.named;
  state.withNoAccount = await state.giver.give(holders, AT);
});

const idAt = async (world: SpecWorld, address: string): Promise<AccountId> => {
  const found = await world.asARequest(() =>
    accountsOf(world).readModel.find(EmailAddress.from(address)),
  );
  assert.ok(found !== undefined, `No account is reached at ${address}.`);
  return found;
};

const rolesGivenTo = async (
  world: SpecWorld,
  address: string,
): Promise<readonly RoleAdded[]> => {
  const id = await idAt(world, address);
  const events = await world.asARequest(() =>
    accountsOf(world).store.getEvents(id),
  );
  return events.filter((event) => event instanceof RoleAdded);
};

// Asked through the account's own answer for each role, so that each is
// covered by name.
const holds = async (
  world: SpecWorld,
  address: string,
  role: string,
): Promise<boolean> => {
  const account = await readBack(world, await idAt(world, address));
  switch (roleCalled(role)) {
    case "administrator":
      return account.isAdministrator;
    case "ac-world-ranking-officer":
      return account.worldRankingSports.includes("ac");
    case "gc-world-ranking-officer":
      return account.worldRankingSports.includes("gc");
  }
};

Then(
  "the account at {string} holds the role {string}",
  async function (this: SpecWorld, address: string, role: string) {
    assert.equal(await holds(this, address, role), true);
  },
);

Then(
  "the account at {string} does not hold the role {string}",
  async function (this: SpecWorld, address: string, role: string) {
    assert.equal(await holds(this, address, role), false);
  },
);

Then(
  "the role given to the account at {string} was given by that account",
  async function (this: SpecWorld, address: string) {
    const id = await idAt(this, address);
    const [given] = await rolesGivenTo(this, address);
    assert.ok(given !== undefined, "No role was given.");
    assert.ok(
      given.createdBy.equals(id),
      `It was given by ${given.createdBy.value}.`,
    );
  },
);

Then(
  "the account at {string} was given a role once",
  async function (this: SpecWorld, address: string) {
    assert.equal((await rolesGivenTo(this, address)).length, 1);
  },
);

Then(
  "{string} is named as having no account",
  function (this: SpecWorld, address: string) {
    assert.ok(givingOf(this).withNoAccount?.includes(address));
  },
);

Then("no address is named as having no account", function (this: SpecWorld) {
  assert.deepEqual(givingOf(this).withNoAccount, []);
});
