// What Google says about the reader in a scenario, one thing to a step, and how
// Google is behaving. An application scenario sends it to signing in with
// Google as it stands; a browser scenario has the stand-in for Google say it.
// The words are the same either way, because what the scenario says Google
// says is the same either way.
//
// Plain data, and nothing from infrastructure or web, for the reason at the
// top of world.ts.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "./world.js";

export interface GoogleSays {
  subject?: string;
  emailAddress?: string;
  verified?: boolean;
  /** Nothing where Google gives no name; absent where the scenario is silent. */
  name?: string | undefined;
  /** The reader will say no to Google when asked. */
  turnedDown?: boolean;
  /** Google will not answer the site. */
  unreachable?: boolean;
}

const said = new WeakMap<SpecWorld, GoogleSays>();

export const googleSaysFor = (world: SpecWorld): GoogleSays => {
  let says = said.get(world);
  if (says === undefined) {
    says = {};
    said.set(world, says);
  }
  return says;
};

/** Who Google says the reader is, as a sign-in would carry it. */
export interface GoogleIdentityAsSaid {
  readonly subject: string;
  readonly emailAddress: string;
  readonly verified: boolean;
  readonly name: string | undefined;
}

// Each thing Google says is asked for, rather than defaulted, so that a
// scenario leaving one out fails for that rather than for what a default did.
export const identitySaidFor = (world: SpecWorld): GoogleIdentityAsSaid => {
  const says = googleSaysFor(world);
  assert.ok(says.subject !== undefined, "Google knows the reader as nobody.");
  assert.ok(says.emailAddress !== undefined, "Google gives no email address.");
  assert.ok(says.verified !== undefined, "Google says nothing of verifying.");
  assert.ok("name" in says, "Google says nothing of a name.");
  return {
    subject: says.subject,
    emailAddress: says.emailAddress,
    verified: says.verified,
    name: says.name,
  };
};

Given(
  "Google knows the reader as {string}",
  function (this: SpecWorld, subject: string) {
    googleSaysFor(this).subject = subject;
  },
);

Given(
  "Google gives the email address {string}",
  function (this: SpecWorld, address: string) {
    googleSaysFor(this).emailAddress = address;
  },
);

Given("Google has verified the email address", function (this: SpecWorld) {
  googleSaysFor(this).verified = true;
});

Given("Google has not verified the email address", function (this: SpecWorld) {
  googleSaysFor(this).verified = false;
});

Given(
  "Google calls the reader {string}",
  function (this: SpecWorld, name: string) {
    googleSaysFor(this).name = name;
  },
);

Given("Google gives no name", function (this: SpecWorld) {
  googleSaysFor(this).name = undefined;
});

Given("the reader will turn Google down", function (this: SpecWorld) {
  googleSaysFor(this).turnedDown = true;
});

Given("Google cannot be reached", function (this: SpecWorld) {
  googleSaysFor(this).unreachable = true;
});
