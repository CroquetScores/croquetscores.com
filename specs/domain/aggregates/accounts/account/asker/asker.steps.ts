import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import { Administrator } from "../../../../../../src/domain/aggregates/accounts/Administrator.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { accountOf } from "../anAccount.js";

Then("the account asks as an administrator", function (this: SpecWorld) {
  assert.ok(accountOf(this).asker instanceof Administrator);
});

Then(
  "the account does not ask as an administrator",
  function (this: SpecWorld) {
    assert.ok(!(accountOf(this).asker instanceof Administrator));
  },
);

Then(
  "the account asks as {string}",
  function (this: SpecWorld, account: string) {
    assert.ok(
      accountOf(this).asker.equals(AccountId.from(account)),
      `It asks as ${accountOf(this).asker.value}.`,
    );
  },
);
