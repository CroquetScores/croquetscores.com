// What came back from the service a reader signed in with, kept for the steps
// that both Google's and Facebook's features say the same way: the reader's
// email address, and what the reader is called. The rest of what came back is
// said differently by each (a subject and whether the address is verified, or
// an id), and is for its own steps.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";

export interface WhoCameBack {
  readonly emailAddress: string | undefined;
  readonly name: string | undefined;
}

const cameBack = new WeakMap<SpecWorld, WhoCameBack | undefined>();

/** Keeps what came back, or nothing where nobody did. */
export const rememberWhoCameBack = (
  world: SpecWorld,
  who: WhoCameBack | undefined,
): void => {
  cameBack.set(world, who);
};

const whoCameBackOf = (world: SpecWorld): WhoCameBack => {
  const who = cameBack.get(world);
  assert.ok(who !== undefined, `Nobody came back: ${String(world.failure)}`);
  return who;
};

Then(
  "the reader's email address is {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(whoCameBackOf(this).emailAddress, address);
  },
);

Then("the reader is called {string}", function (this: SpecWorld, name: string) {
  assert.equal(whoCameBackOf(this).name, name);
});
