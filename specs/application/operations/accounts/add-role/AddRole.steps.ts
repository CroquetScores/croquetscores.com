import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AddRole } from "../../../../../src/application/operations/accounts/AddRole.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountAt,
  keepingWhatCameOf,
  momentOf,
  registeringOf,
  roleWritten,
} from "../roleRequests.js";

// The reader is signed in to the account the scenario names, and what the
// command carries is the account they are signed in to.
When(
  "the reader signed in to the account for {string} gives {string} the role {string}",
  async function (
    this: SpecWorld,
    reader: string,
    address: string,
    role: string,
  ) {
    const asking = await accountAt(this, reader);
    await keepingWhatCameOf(this, () =>
      registeringOf(this).addRole(
        new AddRole(
          asking.id.value,
          roleWritten(role),
          address,
          momentOf(this),
        ),
      ),
    );
  },
);

// Asked of the account as its stream reads now, since what matters is what it
// holds once everything recorded of it is read back.
const holds = async (
  world: SpecWorld,
  address: string,
  role: string,
): Promise<boolean> => {
  const account = await accountAt(world, address);
  switch (roleWritten(role)) {
    case "administrator":
      return account.isAdministrator;
    case "world-ranking-officer":
      return account.isWorldRankingOfficer;
    default:
      throw new Error(`There is no role called ${role}.`);
  }
};

Then(
  "the account for {string} holds the role {string}",
  async function (this: SpecWorld, address: string, role: string) {
    assert.equal(this.failure, undefined, "Asking was refused.");
    assert.equal(await holds(this, address, role), true);
  },
);

Then(
  "the account for {string} does not hold the role {string}",
  async function (this: SpecWorld, address: string, role: string) {
    assert.equal(this.failure, undefined, "Asking was refused.");
    assert.equal(await holds(this, address, role), false);
  },
);

Then(
  "the last thing the account for {string} recorded was caused by the account for {string}",
  async function (this: SpecWorld, address: string, by: string) {
    const caused = await registeringOf(this).lastCausedBy(address);
    assert.ok(caused !== undefined, "The account recorded nothing.");
    assert.ok(caused.equals((await accountAt(this, by)).id));
  },
);
