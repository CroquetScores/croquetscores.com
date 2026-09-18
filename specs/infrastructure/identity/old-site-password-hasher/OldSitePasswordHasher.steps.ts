import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { OldSitePasswordHasher } from "../../../../src/infrastructure/identity/OldSitePasswordHasher.js";
import {
  asLetterThenAccent,
  asOneCharacter,
  checked,
} from "../../../application/services/password-hasher/PasswordHasher.steps.js";
import type { SpecWorld } from "../../../support/world.js";

const oldSites = new WeakMap<SpecWorld, OldSitePasswordHasher>();

const oldSiteOf = (world: SpecWorld): OldSitePasswordHasher => {
  const found = oldSites.get(world);
  assert.ok(found !== undefined, "There is no old site's hasher.");
  return found;
};

Given(
  "the old site's hasher, with the site-wide salt {string}",
  function (this: SpecWorld, salt: string) {
    oldSites.set(this, new OldSitePasswordHasher(salt));
  },
);

// What the old site's hasher answers is a yes or a no: it has no opinion on
// making a hash again, which is the importer's to say.
const checkedOld = (world: SpecWorld, password: string, kept: string) =>
  checked(world, () =>
    Promise.resolve({
      matches: oldSiteOf(world).check(password, kept),
      remake: false,
    }),
  );

When(
  "{string} is checked against the old hash {string}",
  async function (this: SpecWorld, password: string, kept: string) {
    await checkedOld(this, password, kept);
  },
);

When(
  "{string} with its accent typed as part of the letter is checked against the old hash {string}",
  async function (this: SpecWorld, password: string, kept: string) {
    await checkedOld(this, asOneCharacter(password), kept);
  },
);

When(
  "{string} with its accent typed after the letter is checked against the old hash {string}",
  async function (this: SpecWorld, password: string, kept: string) {
    await checkedOld(this, asLetterThenAccent(password), kept);
  },
);

When(
  "the old site's hasher is made with no site-wide salt",
  function (this: SpecWorld) {
    try {
      new OldSitePasswordHasher(undefined);
    } catch (failure) {
      this.failure = failure;
    }
  },
);

When("the old hash {string} is read", function (this: SpecWorld, kept: string) {
  const oldSite = oldSiteOf(this);
  try {
    oldSite.read(kept);
  } catch (failure) {
    this.failure = failure;
  }
});
