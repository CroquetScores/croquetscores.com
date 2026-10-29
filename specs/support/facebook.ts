// What Facebook says about the reader in a scenario, one thing to a step, and
// how Facebook is behaving. An application scenario sends it to signing in with
// Facebook as it stands; a browser scenario has the stand-in for Facebook say
// it. The words are the same either way, because what the scenario says
// Facebook says is the same either way (`google.ts` does the same for Google).
//
// Plain data, and nothing from infrastructure or web, for the reason at the
// top of world.ts.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "./world.js";

export interface FacebookSays {
  facebookId?: string;
  /** Nothing where Facebook gives none; absent where the scenario is silent. */
  emailAddress?: string | undefined;
  name?: string;
  /** The reader will say no to Facebook when asked. */
  turnedDown?: boolean;
  /** Facebook will not answer the site. */
  unreachable?: boolean;
}

const said = new WeakMap<SpecWorld, FacebookSays>();

export const facebookSaysFor = (world: SpecWorld): FacebookSays => {
  let says = said.get(world);
  if (says === undefined) {
    says = {};
    said.set(world, says);
  }
  return says;
};

/** Who Facebook says the reader is, as a sign-in would carry it. */
export interface FacebookIdentityAsSaid {
  readonly facebookId: string;
  readonly emailAddress: string | undefined;
  readonly name: string;
}

// Each thing Facebook says is asked for, rather than defaulted, so that a
// scenario leaving one out fails for that rather than for what a default did.
export const identitySaidFor = (world: SpecWorld): FacebookIdentityAsSaid => {
  const says = facebookSaysFor(world);
  assert.ok(
    says.facebookId !== undefined,
    "Facebook knows the reader as nobody.",
  );
  assert.ok(
    "emailAddress" in says,
    "Facebook says nothing of an email address.",
  );
  assert.ok(says.name !== undefined, "Facebook says nothing of a name.");
  return {
    facebookId: says.facebookId,
    emailAddress: says.emailAddress,
    name: says.name,
  };
};

Given(
  "Facebook knows the reader as {string}",
  function (this: SpecWorld, facebookId: string) {
    facebookSaysFor(this).facebookId = facebookId;
  },
);

Given(
  "Facebook gives the email address {string}",
  function (this: SpecWorld, address: string) {
    facebookSaysFor(this).emailAddress = address;
  },
);

Given("Facebook gives no email address", function (this: SpecWorld) {
  facebookSaysFor(this).emailAddress = undefined;
});

Given(
  "Facebook calls the reader {string}",
  function (this: SpecWorld, name: string) {
    facebookSaysFor(this).name = name;
  },
);

Given("the reader will turn Facebook down", function (this: SpecWorld) {
  facebookSaysFor(this).turnedDown = true;
});

Given("Facebook cannot be reached", function (this: SpecWorld) {
  facebookSaysFor(this).unreachable = true;
});
