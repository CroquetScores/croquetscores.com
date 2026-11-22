import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { handicapShown } from "../../../../src/web/common/handicapShown.js";
import type { SpecWorld } from "../../../support/world.js";

// Kept by the scenario it is for, as the other steps here keep what they
// were given, without a field of its own on the world for one function.
const handicaps = new WeakMap<SpecWorld, { written: string; shown?: string }>();

Given("the handicap {string}", function (this: SpecWorld, written: string) {
  handicaps.set(this, { written });
});

When("the handicap is shown", function (this: SpecWorld) {
  const handicap = handicaps.get(this);
  assert.ok(handicap);
  handicap.shown = handicapShown(handicap.written);
});

Then(
  "the handicap shown is {string}",
  function (this: SpecWorld, shown: string) {
    assert.equal(handicaps.get(this)?.shown, shown);
  },
);
