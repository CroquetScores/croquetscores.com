import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RoleRemoved } from "../../../../../../src/domain/aggregates/accounts/events/RoleRemoved.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  askerOf,
  assertFirstRecorded,
  now,
  roleNamed,
} from "../anAccount.js";

When(
  "the role {string} is removed from the account",
  async function (this: SpecWorld, role: string) {
    await ask(this, (account) =>
      account.removeRole(roleNamed(role), askerOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is its losing a role",
  function (this: SpecWorld) {
    assertFirstRecorded(this, RoleRemoved);
  },
);

Then(
  "its losing a role says the role {string}",
  function (this: SpecWorld, role: string) {
    assert.equal(assertFirstRecorded(this, RoleRemoved).role, roleNamed(role));
  },
);
