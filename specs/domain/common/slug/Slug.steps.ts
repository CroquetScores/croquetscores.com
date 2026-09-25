import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Slug } from "../../../../src/domain/common/Slug.js";
import type { SpecWorld } from "../../../support/world.js";

// Making or reading a slug may be refused, and the scenario says which it
// expects.
const tryTo = (world: SpecWorld, make: () => Slug): void => {
  try {
    world.slug = make();
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "a slug is made from the name {string}",
  function (this: SpecWorld, name: string) {
    tryTo(this, () => Slug.fromName(name));
  },
);

When(
  "a slug is read from {string}",
  function (this: SpecWorld, written: string) {
    tryTo(this, () => Slug.from(written));
  },
);

Then("the slug is written {string}", function (this: SpecWorld, slug: string) {
  assert.ok(
    this.slug !== undefined,
    `No slug has been made: ${inspect(this.failure)}`,
  );
  assert.equal(String(this.slug), slug);
});
