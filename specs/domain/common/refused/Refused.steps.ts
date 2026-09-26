import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Refused } from "../../../../src/domain/common/Refused.js";
import type { SpecWorld } from "../../../support/world.js";

// A kind of refusal that exists only to exercise what every kind shares.
class ExampleRefused extends Refused<"Example.Refused"> {}

const theStoresFailure = new Error("The store failed.");

const refusals = new WeakMap<SpecWorld, ExampleRefused>();

const refusalOf = (world: SpecWorld): ExampleRefused => {
  const refusal = refusals.get(world);
  assert.ok(refusal !== undefined, "Nothing has been refused.");
  return refusal;
};

When(
  "the example is refused with {string} and the message {string}",
  function (this: SpecWorld, code: string, message: string) {
    refusals.set(this, new ExampleRefused(code as "Example.Refused", message));
  },
);

When(
  "the example is refused with {string} because the store failed",
  function (this: SpecWorld, code: string) {
    refusals.set(
      this,
      new ExampleRefused(
        code as "Example.Refused",
        "It could not be read.",
        theStoresFailure,
      ),
    );
  },
);

Then(
  "the refusal's code is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(refusalOf(this).code, code);
  },
);

Then(
  "the refusal's message is {string}",
  function (this: SpecWorld, message: string) {
    assert.equal(refusalOf(this).message, message);
  },
);

Then("the refusal is named {string}", function (this: SpecWorld, name: string) {
  assert.equal(refusalOf(this).name, name);
});

Then("the refusal is of the example kind", function (this: SpecWorld) {
  const refusal = refusalOf(this);
  assert.ok(refusal instanceof ExampleRefused);
  assert.ok(refusal instanceof Error);
});

Then("the refusal's cause is the store's failure", function (this: SpecWorld) {
  assert.equal(refusalOf(this).cause, theStoresFailure);
});

// Not there at all, rather than there and undefined, so that the log does not
// show a cause of nothing.
Then("the refusal has no cause", function (this: SpecWorld) {
  assert.equal("cause" in refusalOf(this), false);
});
