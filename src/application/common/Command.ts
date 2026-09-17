/**
 * Something the application is asked to change.
 *
 * Every command says when it was asked for. The time is decided once, at the
 * edge, and handed down: nothing below the web layer reads a clock, and every
 * event the command records is stamped with this.
 *
 * `_result` is never set. It carries the type of what handling the command
 * answers, so that sending one is typed by what comes back.
 */
export interface Command<TResult> {
  readonly requestedAt: Date;
  readonly _result?: TResult;
}
