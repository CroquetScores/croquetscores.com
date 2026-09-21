import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ResetPassword } from "../../../../../src/application/operations/accounts/ResetPassword.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../../../src/domain/common/validation/Validator.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

/** What came of one asking: the code it was refused with, or nothing. */
interface Outcome {
  readonly refusedWith: string | undefined;
}

const outcomes = new WeakMap<SpecWorld, Outcome[]>();

const answersTo = (world: SpecWorld): Outcome[] => {
  let found = outcomes.get(world);
  if (found === undefined) {
    found = [];
    outcomes.set(world, found);
  }
  return found;
};

let minted = 0;

// The id the scenario last asked under, so that asking again with the same one
// is what "again" means.
const ids = new WeakMap<SpecWorld, string>();

// Whatever came of it is kept for the scenario rather than thrown: several of
// these scenarios are about how it is refused.
const ask = async (
  world: SpecWorld,
  address: string,
  again = false,
): Promise<void> => {
  const had = ids.get(world);
  let requestId: string;
  if (again && had !== undefined) {
    requestId = had;
  } else {
    minted += 1;
    requestId = `an-asking-${minted}`;
    ids.set(world, requestId);
  }

  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    await registeringOf(world).resetPassword(
      new ResetPassword(requestId, address, "en", momentOf(world)),
    );
    answersTo(world).push({ refusedWith: undefined });
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { code?: unknown; broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
    answersTo(world).push({
      refusedWith:
        typeof refused.code === "string" ? refused.code : "something",
    });
  }
};

When(
  "a way back in is asked for {string}",
  async function (this: SpecWorld, address: string) {
    this.addressInHand = address;
    await ask(this, address);
  },
);

// The same asking, carrying the id it carried the first time: a retry, not a
// second asking.
When("the same asking is sent again", async function (this: SpecWorld) {
  const address = this.addressInHand;
  assert.ok(address !== undefined, "Nothing has been asked for.");
  await ask(this, address, true);
});

// What the site has already written to an address nobody has registered,
// counted by the same hash the address would be found by. Written down rather
// than sent, because what the scenario is about is the counting: an asking
// that queued them would be asking the thing under test to set itself up.
Given(
  "{string} has been written to {int} times in the last hour",
  async function (this: SpecWorld, address: string, times: number) {
    await registeringOf(this).wroteToAddress(
      address,
      "Email.RegisterInstead",
      times,
    );
  },
);

Then("the two askings answer the same", function (this: SpecWorld) {
  const had = answersTo(this);
  assert.equal(had.length, 2, `${had.length} answers came back.`);
  assert.deepEqual(had[0], had[1]);
});

Then(
  "nothing of the kind {string} is queued",
  async function (this: SpecWorld, kind: string) {
    const queued = await registeringOf(this).queued();
    assert.deepEqual(
      queued.filter((email) => email.kind === kind),
      [],
      `${kind} was queued.`,
    );
  },
);
