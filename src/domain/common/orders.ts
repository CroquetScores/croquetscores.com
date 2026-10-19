import { Validator } from "./validation/Validator.js";

/**
 * How far apart things are put in a list ordered by number, so that one can
 * later be put between two others without either of them moving.
 */
export const ORDER_STEP = 10_000;

/**
 * The rules an order must keep, for something whose error codes are named
 * `<owner>.OrderNotWhole` and `<owner>.OrderTooSmall`. Every kind of thing
 * that is listed by order keeps the same two rules, so they are written here
 * and each kind says only what it calls them.
 *
 * Whole to the extent the platform holds exactly: one beyond that is not
 * reliably the number it was given, so two orders could be told apart by
 * nothing.
 */
export const orderRules = <TCode extends string>(
  notWhole: TCode,
  tooSmall: TCode,
): Validator<number, TCode> =>
  new Validator<number, TCode>({
    fields: [
      {
        field: "order",
        code: notWhole,
        isBrokenBy: (order) => !Number.isSafeInteger(order),
      },
      {
        field: "order",
        code: tooSmall,
        isBrokenBy: (order) => order < 1,
      },
    ],
  });

/**
 * ORDER_STEP more than the highest of `orders`, for something put last: one
 * added, or one archived. Every order counts, whether the thing is archived or
 * not, so that no order is ever given twice.
 */
export const orderAfter = (orders: Iterable<number>): number =>
  Math.max(0, ...orders) + ORDER_STEP;

/**
 * The order something moved past the one at `at` in `orders`, lowest first, is
 * given: just before it when moving up, just after it when moving down,
 * halfway into the room between it and whatever lies next to it, archived or
 * not. Put first, half the order of the one it comes before; put last,
 * ORDER_STEP more than the highest. Nothing, where there is no whole number
 * left in the room.
 */
export const orderPast = (
  orders: readonly number[],
  at: number,
  direction: "up" | "down",
): number | undefined => {
  const [lower, upper] =
    direction === "up"
      ? [orders[at - 1] ?? 0, orders[at]]
      : [orders[at], orders[at + 1]];
  if (lower === undefined) return undefined;
  if (upper === undefined) return lower + ORDER_STEP;
  const halfway = Math.floor((lower + upper) / 2);
  return halfway > lower && halfway < upper ? halfway : undefined;
};
