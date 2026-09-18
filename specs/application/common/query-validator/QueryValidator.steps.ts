import { Given } from "@cucumber/cucumber";

import { ExampleQueryValidator } from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

Given(
  "a validator that validates the example query",
  function (this: SpecWorld) {
    this.unregisteredValidator = new ExampleQueryValidator();
  },
);
