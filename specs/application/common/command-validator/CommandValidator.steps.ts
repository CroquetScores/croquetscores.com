import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  ExampleCommandValidator,
  validationOf,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

Given(
  "a validator that validates the example command",
  function (this: SpecWorld) {
    this.unregisteredValidator = new ExampleCommandValidator();
  },
);

// Nothing but the validator is handed over, a command's or a query's: what it
// validates, it says.
Given("the validator is registered", function (this: SpecWorld) {
  const validator = this.unregisteredValidator;
  assert.ok(validator !== undefined, "No validator has been made.");
  validationOf(this).register(validator);
});
