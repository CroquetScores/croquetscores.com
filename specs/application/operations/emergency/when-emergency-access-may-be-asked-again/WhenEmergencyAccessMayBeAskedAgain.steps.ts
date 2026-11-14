import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../support/world.js";
import { whenMayAskAgainFor } from "../ask-for-emergency-access/AskForEmergencyAccess.steps.js";

// What the last asking was answered with, kept for the scenario.
const answers = new WeakMap<SpecWorld, string | undefined>();

When(
  "{string} is asked when they may ask again",
  async function (this: SpecWorld, name: string) {
    answers.set(this, await whenMayAskAgainFor(this, name));
  },
);

Then("they may ask now", function (this: SpecWorld) {
  assert.equal(answers.get(this), undefined);
});

Then(
  "they may ask again at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(answers.get(this), new Date(moment).toISOString());
  },
);
