// Where one thing on a page is drawn against another: on one line, beside it
// or on a row beneath it. Here rather than in any one page's steps, because
// every view that shows a player is held to the same rules. A pixel either way
// is a rounding, not a place.
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

const boxOf = async (found: Locator, what: string) => {
  const box = await found.first().boundingBox();
  assert.ok(box !== null, `${what} is not on the page.`);
  return box;
};

/** Asserts that `found` is drawn on one line, which a thing broken in two is not. */
export const assertOnOneLine = async (
  found: Locator,
  what: string,
): Promise<void> => {
  const lines = await found
    .first()
    .evaluate(
      (element: unknown) =>
        (element as { getClientRects(): { length: number } }).getClientRects()
          .length,
    );
  assert.equal(lines, 1, `${what} is drawn on ${lines} lines.`);
};

/** Asserts that `lower` starts at or beyond where `upper` ends, down the page. */
export const assertBelow = async (
  lower: Locator,
  upper: Locator,
  what: string,
): Promise<void> => {
  const under = await boxOf(lower, what);
  const above = await boxOf(upper, "The name");
  assert.ok(
    under.y >= above.y + above.height - 1,
    `${what} starts ${under.y}, and the name ends ${above.y + above.height}.`,
  );
};

/** Asserts that `beside` starts before where `name` ends, down the page: on its row. */
export const assertBeside = async (
  beside: Locator,
  name: Locator,
  what: string,
): Promise<void> => {
  const found = await boxOf(beside, what);
  const named = await boxOf(name, "The name");
  assert.ok(
    found.y < named.y + named.height - 1,
    `${what} starts ${found.y}, and the name ends ${named.y + named.height}.`,
  );
};

/** Asserts that `first` starts higher up the page than `second`, so is read before it. */
export const assertAbove = async (
  first: Locator,
  second: Locator,
  what: string,
): Promise<void> => {
  const above = await boxOf(first, what);
  const below = await boxOf(second, "What it is above");
  assert.ok(
    above.y < below.y,
    `${what} starts ${above.y}, and what it is above starts ${below.y}.`,
  );
};
