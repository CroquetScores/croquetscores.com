import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/**
 * The requests already carried out, by the id whoever asked gave them.
 *
 * A request sent twice — because its answer was lost on its way back — carries
 * the same id both times, and is to happen once. The id is kept in the same
 * transaction as whatever the request did, so that it is remembered if and
 * only if the work was kept: remembered first, a failure afterwards would
 * leave the retry told it had already happened when nothing had.
 *
 * Only commands that mint something new need this. One that changes a thing
 * already there is caught by the event store, which refuses a second append
 * expecting the version the first moved past.
 */
export interface HandledRequests {
  /**
   * Whether `requestId` is one nobody has carried out yet, and marks it
   * carried out when it is. False says the work is already done, and whoever
   * asked is to be answered as the first asking was. `at` is when the request
   * says it was asked for, so that the claim is stamped with the same moment
   * as everything else the request records.
   */
  claim(requestId: string, at: ReadOnlyDate): Promise<boolean>;

  /**
   * Whether `requestId` has been carried out, without claiming it. What asks
   * is whatever has to show a reader where they stand before anything is
   * done: asking must not be what spends the thing asked about.
   */
  wasHandled(requestId: string): Promise<boolean>;
}
