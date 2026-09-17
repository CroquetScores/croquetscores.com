import type { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

/**
 * Something the application is asked to change.
 *
 * Every command says when it was asked for. The time is decided once, at the
 * edge, and handed down: nothing below the web layer reads a clock, and every
 * event the command records is stamped with this.
 *
 * It is a read-only date rather than the language's own, which anything
 * holding the command could move. A behaviour that did, between the command
 * being checked and its events being stamped, would leave one request
 * recorded at two times. Making one is also where a time that cannot be read
 * is refused, so by the time a command exists its time can be.
 *
 * `_result` is never set. It carries the type of what handling the command
 * answers, so that sending one is typed by what comes back.
 */
export interface Command<TResult> {
  readonly requestedAt: ReadOnlyDate;
  readonly _result?: TResult;
}
