import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";
import type { EmailsWritten, WrittenTo } from "../../services/EmailsWritten.js";

/**
 * How many emails an inbox may be filled with, per hour.
 *
 * One limit for every way an email is written to an inbox, because they fill
 * the one inbox: registering, sending a link again, asking to set a password
 * and asking to move to another address are counted together, and a limit per
 * kind would let each be used up in turn.
 */
export const EMAILS_AN_HOUR = 3;

/**
 * Whether `whom` has been written to as often as the hour up to `now` allows.
 * Counting holds whoever is counted until the transaction ends, so that two
 * askings at once are counted one after the other and not both found under
 * the limit.
 */
export const inboxIsFull = async (
  written: EmailsWritten,
  whom: WrittenTo,
  now: ReadOnlyDate,
): Promise<boolean> =>
  (await written.countSince(whom, shiftedBy(now, -AN_HOUR))) >= EMAILS_AN_HOUR;
