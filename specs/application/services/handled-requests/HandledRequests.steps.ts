import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { HandledRequests } from "../../../../src/application/services/HandledRequests.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";

// What stands behind "a record of handled requests" is decided by the steps of
// whatever implements it (specs/infrastructure/), since this feature is
// written for any record and these steps may name none.
const recordOf = (world: SpecWorld): HandledRequests => {
  assert.ok(
    world.handledRequestsRecord !== undefined,
    "There is no record of handled requests.",
  );
  return world.handledRequestsRecord;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

// Claimed as a request being served claims: whatever a claim needs around it
// is whatever put the record there, and the steps ask for it the same way
// wherever they run.
const claim = async (world: SpecWorld, requestId: string): Promise<boolean> => {
  const claimed = await world.asARequest(() =>
    recordOf(world).claim(requestId, momentOf(world)),
  );
  world.claims.push(claimed);
  return claimed;
};

// What has happened already ------------------------------------------------------

Given(
  "the request {string} has been claimed",
  async function (this: SpecWorld, requestId: string) {
    await claim(this, requestId);
  },
);

Given(
  "the request {string} has been claimed again",
  async function (this: SpecWorld, requestId: string) {
    await claim(this, requestId);
  },
);

// Claiming -----------------------------------------------------------------------

When(
  "the request {string} is claimed",
  async function (this: SpecWorld, requestId: string) {
    await claim(this, requestId);
  },
);

// Both at once, each as its own request, so that they race rather than one
// waiting for the other to be done with.
When(
  "the request {string} is claimed twice at once",
  async function (this: SpecWorld, requestId: string) {
    await Promise.all([claim(this, requestId), claim(this, requestId)]);
  },
);

// What claiming answered -----------------------------------------------------------

// The last claim the scenario made, which is the one it is asking about.
const lastClaim = (world: SpecWorld): boolean => {
  const claimed = world.claims.at(-1);
  assert.ok(claimed !== undefined, "Nothing has been claimed.");
  return claimed;
};

Then("it is claimed", function (this: SpecWorld) {
  assert.equal(lastClaim(this), true, "It was already carried out.");
});

Then("it is not claimed", function (this: SpecWorld) {
  assert.equal(lastClaim(this), false, "Nobody had carried it out.");
});

Then("one of the two claims was refused", function (this: SpecWorld) {
  const both = this.claims.slice(-2);
  assert.equal(both.length, 2, "Two claims were not made.");
  assert.deepEqual(
    both.filter((claimed) => claimed),
    [true],
    "Both claims were answered the same.",
  );
});

// Asking, which claims nothing ------------------------------------------------------

const asked = new WeakMap<SpecWorld, boolean>();

const ask = async (world: SpecWorld, requestId: string): Promise<void> => {
  asked.set(
    world,
    await world.asARequest(() => recordOf(world).wasHandled(requestId)),
  );
};

// Given and When alike: Cucumber holds one definition for both.
When(
  "the request {string} is asked about",
  async function (this: SpecWorld, requestId: string) {
    await ask(this, requestId);
  },
);

Then("it has been handled", function (this: SpecWorld) {
  assert.equal(asked.get(this), true);
});

Then("it has not been handled", function (this: SpecWorld) {
  assert.equal(asked.get(this), false);
});
