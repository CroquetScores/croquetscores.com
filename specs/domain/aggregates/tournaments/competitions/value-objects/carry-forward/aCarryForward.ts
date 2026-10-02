import { strict as assert } from "node:assert";

import type {
  CarryForwardCount,
  CarryForwardCounts,
} from "../../../../../../../src/domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { SpecWorld } from "../../../../../../support/world.js";

// What the steps for a carry forward share, wherever one is given: each count
// by the words a scenario says it in, and the counts a scenario says the carry
// forward is to have. A module rather than a steps file, so that the
// competition's player and the competition can use it without defining a step
// twice.

const NAMED: Readonly<Record<string, CarryForwardCount>> = {
  "match wins": "matchWins",
  "match losses": "matchLosses",
  "game wins": "gameWins",
  "game losses": "gameLosses",
  "hoops for": "hoopsFor",
  "hoops against": "hoopsAgainst",
};

/** The words for any one count, for a step's pattern. */
export const COUNT = `(${Object.keys(NAMED).join("|")})`;

/** A number as a scenario writes it, a fraction or below 0 among them. */
export const NUMBER = "(-?\\d+(?:\\.\\d+)?)";

/** The count a scenario calls `words`. */
export const countCalled = (words: string): CarryForwardCount => {
  const count = NAMED[words];
  assert.ok(count !== undefined, `There is no count called ${words}.`);
  return count;
};

// Kept here rather than on the world, which has no business knowing what a
// carry forward is.
const pending = new WeakMap<SpecWorld, CarryForwardCounts>();

/** The counts the scenario says the carry forward is to have, none where it says nothing. */
export const pendingCounts = (world: SpecWorld): CarryForwardCounts =>
  pending.get(world) ?? {};

/** That the carry forward is to have `count` of `value` as well as what it has. */
export const toHave = (
  world: SpecWorld,
  count: CarryForwardCount,
  value: number,
): void => {
  pending.set(world, { ...pendingCounts(world), [count]: value });
};

/** That the carry forward is to have no counts at all. */
export const toHaveNone = (world: SpecWorld): void => {
  pending.set(world, {});
};
