// Commands a scenario asks for at the same moment, each in a request of its
// own, and what each was answered, for the scenarios where two asked at once
// must come out as one asked after the other would. Each feature's steps say
// what is to be asked; asking and what came of it are said here, in the same
// words whichever feature it is. Imported by their step definitions rather
// than found by Cucumber, so that each step is defined once.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { startHolding, stopHolding } from "../../../support/heldAtOnce.js";
import type { SpecWorld } from "../../../support/world.js";

const queued = new WeakMap<SpecWorld, (() => Promise<unknown>)[]>();
const answered = new WeakMap<SpecWorld, PromiseSettledResult<unknown>[]>();

/** That `asking` is to be asked for with the others, when all are asked at once. */
export const toBeAsked = (
  world: SpecWorld,
  asking: () => Promise<unknown>,
): void => {
  queued.set(world, [...(queued.get(world) ?? []), asking]);
};

When("both are asked for at once", async function (this: SpecWorld) {
  const asking = queued.get(this) ?? [];
  queued.delete(this);
  assert.equal(asking.length, 2, "Two are not set up to be asked for.");
  // Each held just after it reads what it decides by, until the other has
  // read it too (heldAtOnce.ts), so that the two are at once and not one
  // done before the other begins.
  startHolding(this, asking.length);
  try {
    answered.set(this, await Promise.allSettled(asking.map((ask) => ask())));
  } finally {
    stopHolding(this);
  }
});

const answersOf = (world: SpecWorld): PromiseSettledResult<unknown>[] => {
  const found = answered.get(world);
  assert.ok(found !== undefined, "Nothing has been asked for at once.");
  return found;
};

const codeOf = (failure: unknown): unknown =>
  (failure as { code?: unknown } | null)?.code;

Then("one of them is answered", function (this: SpecWorld) {
  const answers = answersOf(this);
  assert.equal(
    answers.filter(({ status }) => status === "fulfilled").length,
    1,
    inspect(answers),
  );
});

Then("neither is refused", function (this: SpecWorld) {
  const answers = answersOf(this);
  assert.ok(
    answers.every(({ status }) => status === "fulfilled"),
    inspect(answers),
  );
});

Then(
  "one of them is refused with {string}",
  function (this: SpecWorld, code: string) {
    const answers = answersOf(this);
    const refused = answers.flatMap((answer): unknown[] =>
      answer.status === "rejected" ? [answer.reason as unknown] : [],
    );
    assert.equal(refused.length, 1, inspect(answers));
    assert.equal(codeOf(refused[0]), code, inspect(refused[0]));
  },
);
