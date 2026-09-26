import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { charactersIn } from "../../../../src/domain/common/charactersIn.js";
import type { SpecWorld } from "../../../support/world.js";

const counts = new WeakMap<SpecWorld, number>();

When(
  "the characters in {string} are counted",
  function (this: SpecWorld, text: string) {
    counts.set(this, charactersIn(text));
  },
);

// NFD writes every accented letter as the letter and then its accent, which is
// how some keyboards type it.
When(
  "the characters in {string} with its accent typed after the letter are counted",
  function (this: SpecWorld, text: string) {
    const typed = text.normalize("NFD");
    assert.notEqual(typed, text, `"${text}" has no accent to type after.`);
    counts.set(this, charactersIn(typed));
  },
);

Then("there are {int} characters", function (this: SpecWorld, count: number) {
  const counted = counts.get(this);
  assert.ok(counted !== undefined, "Nothing has been counted.");
  assert.equal(counted, count);
});
