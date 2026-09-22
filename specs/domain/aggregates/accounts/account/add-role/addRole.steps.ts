import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RoleAdded } from "../../../../../../src/domain/aggregates/accounts/events/RoleAdded.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  askerOf,
  assertFirstRecorded,
  now,
  roleNamed,
} from "../anAccount.js";

When(
  "the role {string} is added to the account",
  async function (this: SpecWorld, role: string) {
    await ask(this, (account) =>
      account.addRole(roleNamed(role), askerOf(this), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is its being given a role",
  function (this: SpecWorld) {
    assertFirstRecorded(this, RoleAdded);
  },
);

Then(
  "its being given a role says the role {string}",
  function (this: SpecWorld, role: string) {
    assert.equal(assertFirstRecorded(this, RoleAdded).role, roleNamed(role));
  },
);
