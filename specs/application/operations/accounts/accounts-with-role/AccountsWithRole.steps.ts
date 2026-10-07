import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  AccountsWithRole,
  type AccountWithRole,
} from "../../../../../src/application/operations/accounts/AccountsWithRole.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountAt,
  keepingWhatCameOf,
  registeringOf,
  roleWritten,
} from "../roleRequests.js";

When(
  "the reader signed in to the account for {string} lists the accounts with the role {string}",
  async function (this: SpecWorld, reader: string, role: string) {
    const asking = await accountAt(this, reader);
    await keepingWhatCameOf(this, () =>
      registeringOf(this).accountsWithRole(
        new AccountsWithRole(asking.id.value, roleWritten(role)),
      ),
    );
  },
);

const namesAnswered = (world: SpecWorld): string[] => {
  assert.equal(world.failure, undefined, "Listing was refused.");
  return (world.answer as readonly AccountWithRole[]).map(({ name }) => name);
};

Then(
  "the account {string} is answered",
  function (this: SpecWorld, name: string) {
    const names = namesAnswered(this);
    assert.ok(names.includes(name), `Answered ${JSON.stringify(names)}.`);
  },
);

Then(
  "the account {string} is not answered",
  function (this: SpecWorld, name: string) {
    const names = namesAnswered(this);
    assert.ok(!names.includes(name), `Answered ${JSON.stringify(names)}.`);
  },
);

Then(
  "the first account answered is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(namesAnswered(this)[0], name);
  },
);

Then("no account is answered", function (this: SpecWorld) {
  assert.deepEqual(namesAnswered(this), []);
});
