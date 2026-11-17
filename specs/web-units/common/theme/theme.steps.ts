import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { safeReturnPath } from "../../../../src/web/common/theme.js";
import type { SpecWorld } from "../../../support/world.js";

When(
  "a return to {string} is asked for",
  function (this: SpecWorld, asked: string) {
    this.returnPath = safeReturnPath(asked);
  },
);

When("no return is asked for", function (this: SpecWorld) {
  this.returnPath = safeReturnPath(undefined);
});

Then(
  "the reader is sent to {string}",
  function (this: SpecWorld, sent: string) {
    assert.equal(this.returnPath, sent);
  },
);
