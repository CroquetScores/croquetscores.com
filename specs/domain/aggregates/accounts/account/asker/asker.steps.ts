import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import { Administrator } from "../../../../../../src/domain/aggregates/accounts/Administrator.js";
import { WorldRankingOfficer } from "../../../../../../src/domain/aggregates/accounts/WorldRankingOfficer.js";
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

Then("the account asks as a world ranking officer", function (this: SpecWorld) {
  assert.ok(accountOf(this).asker instanceof WorldRankingOfficer);
});

Then(
  "the account does not ask as a world ranking officer",
  function (this: SpecWorld) {
    assert.ok(!(accountOf(this).asker instanceof WorldRankingOfficer));
  },
);

Then(
  "the account asks as a world ranking officer for {string}",
  function (this: SpecWorld, sport: string) {
    const asker = accountOf(this).asker;
    assert.ok(asker instanceof WorldRankingOfficer);
    assert.ok(asker.looksAfter(sport));
  },
);

Then(
  "the account does not ask as a world ranking officer for {string}",
  function (this: SpecWorld, sport: string) {
    const asker = accountOf(this).asker;
    assert.ok(
      !(asker instanceof WorldRankingOfficer) || !asker.looksAfter(sport),
    );
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
