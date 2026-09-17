/**
 * Something the application is asked to tell. A query changes nothing, so it
 * carries no time: nothing it does is recorded.
 *
 * `_result` is never set. It carries the type of what asking the query answers.
 */
export interface Query<TResult> {
  readonly _result?: TResult;
}
