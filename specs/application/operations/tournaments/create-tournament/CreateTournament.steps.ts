import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { CreatedTournament } from "../../../../../src/application/operations/tournaments/CreateTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  everyCreated,
  heldAccount,
  inHandOf,
  load,
  scenarioOf,
} from "../aRequest.js";
import { create } from "../requests.js";

const answerOf = (world: SpecWorld): CreatedTournament => {
  assert.ok(
    world.answer !== undefined,
    `It was not answered: ${String(world.failure)}`,
  );
  return world.answer as CreatedTournament;
};

// The first event of the tournament the request created.
const creationOf = async (world: SpecWorld) => {
  const [first] = await inHandOf(world).eventsOf(answerOf(world).id);
  assert.ok(first !== undefined, "The tournament recorded nothing.");
  return first;
};

Given(
  "the request came to {string}",
  function (this: SpecWorld, website: string) {
    scenarioOf(this).website = website;
  },
);

When(
  "the reader signed in to the account for {string} creates the tournament",
  async function (this: SpecWorld, address: string) {
    await create(this, (await accountFor(this, address)).value);
  },
);

When(
  "the reader signed in to that account creates the tournament",
  async function (this: SpecWorld) {
    await create(this, heldAccount(this));
  },
);

Then(
  "it is answered with the address {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(answerOf(this).address.toString(), address);
  },
);

Then(
  "the tournament it answered with is kept, called {string}",
  async function (this: SpecWorld, name: string) {
    const kept = await load(this, answerOf(this).id);
    assert.equal(kept.name.toString(), name);
  },
);

Then(
  "the tournament's creation was caused by the account for {string}",
  async function (this: SpecWorld, address: string) {
    const creation = await creationOf(this);
    assert.ok(creation.createdBy.equals(await accountFor(this, address)));
  },
);

Then(
  "the tournament's creation happened at {string}",
  async function (this: SpecWorld, moment: string) {
    assert.equal((await creationOf(this)).occurredAt.toISOString(), moment);
  },
);

Then("the two tournaments have different ids", function (this: SpecWorld) {
  const [first, second] = everyCreated(this);
  assert.ok(
    first !== undefined && second !== undefined,
    "Two were not created.",
  );
  assert.ok(!first.equals(second));
});

Then("no tournament is kept", async function (this: SpecWorld) {
  assert.equal(await inHandOf(this).kept(), 0);
});
