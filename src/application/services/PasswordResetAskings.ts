import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/**
 * A record of how often each IP address has asked for a way back in, kept so
 * that the forgot password page cannot be used to try address after address.
 *
 * It counts the asking, not what was sent: how often an address is written to
 * is counted with every other email (`EmailsWritten`). An asking is written
 * down as it is made, under a lock held by the address it came from, so that
 * askings sent all at once are counted one after another rather than all of
 * them finding room.
 */
export interface PasswordResetAskings {
  /**
   * Counts this asking from `ipAddress` and writes it down, or says it is held
   * — at `most` an hour — and writes nothing, since an asking nobody is going
   * to act on is not one to count.
   */
  ask(ipAddress: string, at: ReadOnlyDate, most: number): Promise<boolean>;
}
