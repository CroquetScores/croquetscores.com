import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { NameChanged } from "../../../../../../src/domain/aggregates/accounts/events/NameChanged.js";
import { PersonName } from "../../../../../../src/domain/aggregates/accounts/value-objects/PersonName.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { ask, assertFirstRecorded, idOf, now, streamOf } from "../anAccount.js";

Given(
  "its name was changed to {string}",
  function (this: SpecWorld, name: string) {
    streamOf(this).push(new NameChanged(name, idOf(this), now(this)));
  },
);

When(
  "the account's name is changed to {string}",
  async function (this: SpecWorld, name: string) {
    await ask(this, (account) =>
      account.changeName(PersonName.from(name), now(this)),
    );
  },
);

Then(
  "the first thing it recorded is its name being changed",
  function (this: SpecWorld) {
    assertFirstRecorded(this, NameChanged);
  },
);

Then(
  "its name being changed says the name {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(assertFirstRecorded(this, NameChanged).name, name);
  },
);
