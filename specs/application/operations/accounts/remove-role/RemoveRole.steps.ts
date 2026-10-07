import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RemoveRole } from "../../../../../src/application/operations/accounts/RemoveRole.js";
import { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
import type { SpecWorld } from "../../../../support/world.js";
import { toBeAsked } from "../../tournaments/askedAtOnce.js";
import {
  accountAt,
  holds,
  keepingWhatCameOf,
  momentOf,
  registeringOf,
  roleWritten,
} from "../roleRequests.js";

const takeAs = async (
  world: SpecWorld,
  reader: string,
  role: string,
  holder: AccountId,
): Promise<void> => {
  const asking = await accountAt(world, reader);
  await keepingWhatCameOf(world, () =>
    registeringOf(world).removeRole(
      new RemoveRole(
        asking.id.value,
        roleWritten(role),
        holder.value,
        momentOf(world),
      ),
    ),
  );
};

When(
  "the reader signed in to the account for {string} takes the role {string} from {string}",
  async function (
    this: SpecWorld,
    reader: string,
    role: string,
    address: string,
  ) {
    await takeAs(this, reader, role, (await accountAt(this, address)).id);
  },
);

When(
  "the reader signed in to the account for {string} takes the role {string} from an account there is not",
  async function (this: SpecWorld, reader: string, role: string) {
    await takeAs(this, reader, role, AccountId.create());
  },
);

// Asked for with another at once (askedAtOnce.ts), its answer kept there.
Given(
  "the reader signed in to the account for {string} is to take the role {string} from {string}",
  async function (
    this: SpecWorld,
    reader: string,
    role: string,
    address: string,
  ) {
    const asking = await accountAt(this, reader);
    const holder = await accountAt(this, address);
    const at = momentOf(this);
    toBeAsked(this, () =>
      registeringOf(this).removeRole(
        new RemoveRole(asking.id.value, roleWritten(role), holder.id.value, at),
      ),
    );
  },
);

Then(
  "{int} of {string} and {string} holds the role {string}",
  async function (
    this: SpecWorld,
    count: number,
    one: string,
    other: string,
    role: string,
  ) {
    const holding = await Promise.all(
      [one, other].map((address) => holds(this, address, role)),
    );
    assert.equal(holding.filter(Boolean).length, count);
  },
);
