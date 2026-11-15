import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { addressToLog } from "../../../../src/web/common/addressToLog.js";
import type { SpecWorld } from "../../../support/world.js";

const requested = new WeakMap<SpecWorld, string>();
const logged = new WeakMap<SpecWorld, string>();

Given(
  "the requested address {string}",
  function (this: SpecWorld, address: string) {
    requested.set(this, address);
  },
);

When("the address is written for the log", function (this: SpecWorld) {
  const address = requested.get(this);
  assert.ok(address !== undefined, "No address was requested.");
  logged.set(this, addressToLog(address));
});

Then(
  "the address is logged as {string}",
  function (this: SpecWorld, expected: string) {
    assert.equal(logged.get(this), expected);
  },
);
