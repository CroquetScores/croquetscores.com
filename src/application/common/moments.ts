import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

export const AN_HOUR = 60 * 60 * 1000;

/**
 * The moment `milliseconds` after `moment`, or before it where they are
 * negative. Made here rather than on {@link ReadOnlyDate}, which is the
 * domain's and has never needed to move a moment: only the application counts
 * back from a request to ask what was done lately, or forward to say when a
 * link stops working.
 */
export const shiftedBy = (
  moment: ReadOnlyDate,
  milliseconds: number,
): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(moment.toDate().getTime() + milliseconds));
