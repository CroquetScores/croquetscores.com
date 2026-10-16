import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { isRefused } from "../../../../src/web/common/crossSite.js";
import type { SpecWorld } from "../../../support/world.js";

const judged = (world: SpecWorld): boolean => {
  assert.ok(world.provenance !== undefined, "No request has been described.");
  return isRefused(world.provenance);
};

Given(
  "a {word} request addressed to {string}",
  function (this: SpecWorld, method: string, host: string) {
    this.provenance = {
      method,
      host,
      secFetchSite: undefined,
      origin: undefined,
    };
  },
);

Given(
  "the browser says it came from {string}",
  function (this: SpecWorld, from: string) {
    this.provenance = { ...this.provenance!, secFetchSite: from };
  },
);

Given(
  "the browser does not say where it came from",
  function (this: SpecWorld) {
    this.provenance = { ...this.provenance!, secFetchSite: undefined };
  },
);

Given("its origin is {string}", function (this: SpecWorld, origin: string) {
  this.provenance = { ...this.provenance!, origin };
});

Given("it has no origin", function (this: SpecWorld) {
  this.provenance = { ...this.provenance!, origin: undefined };
});

Given("it is not addressed to anywhere", function (this: SpecWorld) {
  this.provenance = { ...this.provenance!, host: undefined };
});

Then("it is let through", function (this: SpecWorld) {
  assert.equal(judged(this), false);
});

Then("it is refused", function (this: SpecWorld) {
  assert.equal(judged(this), true);
});
