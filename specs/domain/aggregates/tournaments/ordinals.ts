import { strict as assert } from "node:assert";

// Where "first", "second" and so on put something in a list, counted from
// nought. A module rather than a steps file, so that the features for a
// knockout's draw and for a tournament can both say which one they mean
// without defining a step twice.
const POSITIONS: Readonly<Record<string, number>> = {
  first: 0,
  second: 1,
  third: 2,
  fourth: 3,
};

export const positionOf = (ordinal: string): number => {
  const position = POSITIONS[ordinal];
  assert.ok(position !== undefined, `There is no position called ${ordinal}.`);
  return position;
};
