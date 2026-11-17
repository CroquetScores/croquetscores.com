import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { pageAsked } from "../../support/publicPages.js";

const canonicalLinks = (world: WebWorld): string[] =>
  [...pageAsked(world).body.matchAll(/<link rel="canonical" href="([^"]*)"/g)]
    .map((found) => found[1]!)
    // As an address is written in markup: the ampersand of a query is not one.
    .map((href) => href.replace(/&amp;/g, "&"));

Then(
  "its canonical link is {string}",
  function (this: WebWorld, address: string) {
    assert.deepEqual(canonicalLinks(this), [address]);
  },
);

Then("it has one canonical link", function (this: WebWorld) {
  assert.equal(canonicalLinks(this).length, 1);
});

Then("it has no canonical link", function (this: WebWorld) {
  assert.deepEqual(canonicalLinks(this), []);
});
