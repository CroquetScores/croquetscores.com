import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  Website,
  type Site as ServedSite,
} from "../../../../src/domain/common/Website.js";
import type { Site } from "../../../support/sites.js";
import type { SpecWorld } from "../../../support/world.js";

// The feature names a site as a reader would, and the domain by which of the
// two it is, so this is where the one is turned into the other.
const siteNamed: Readonly<Record<ServedSite, Site>> = {
  croquetScores: "Croquet Scores",
  gateballScores: "Gateball Scores",
};

const websiteOfWorld = (world: SpecWorld): Website => {
  assert.ok(
    world.website !== undefined,
    `No website has been made: ${inspect(world.failure)}`,
  );
  return world.website;
};

Given("the website {string}", function (this: SpecWorld, host: string) {
  this.website = Website.from(host);
});

// Making a website may be refused, and the scenario says which it expects.
When("the website {string} is made", function (this: SpecWorld, host: string) {
  try {
    this.website = Website.from(host);
  } catch (failure) {
    this.failure = failure;
  }
});

When(
  "it is compared with the website {string}",
  function (this: SpecWorld, host: string) {
    this.sameWebsite = websiteOfWorld(this).equals(Website.from(host));
  },
);

Then("it serves the site {string}", function (this: SpecWorld, site: string) {
  assert.equal(siteNamed[websiteOfWorld(this).site], site);
});

Then("it is a try website", function (this: SpecWorld) {
  assert.equal(websiteOfWorld(this).isTry, true);
});

Then("it is not a try website", function (this: SpecWorld) {
  assert.equal(websiteOfWorld(this).isTry, false);
});

Then("they are the same website", function (this: SpecWorld) {
  assert.equal(this.sameWebsite, true);
});

Then("they are different websites", function (this: SpecWorld) {
  assert.equal(this.sameWebsite, false);
});
