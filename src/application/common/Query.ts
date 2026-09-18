/**
 * Something the application is asked to tell. A query changes nothing, so it
 * carries no time: nothing it does is recorded.
 *
 * It is a class for what that makes of it rather than for anything it holds.
 * A query can then be told from a command where it matters: at registration, a
 * handler naming anything but a query is refused rather than let in by the
 * query's door; and at compile time, a command asked as though it were a query
 * does not compile, as a query sent as though it were a command already did
 * not.
 *
 * `_result` is never set. It carries the type of what asking the query answers.
 */
export abstract class Query<TResult> {
  declare readonly _result?: TResult;

  // Nothing reads this, and nothing sets it: it is declared, and is never there
  // to be read. It is here because a class with no private member is compared
  // by its shape, and a query's shape — one optional member — is one that
  // almost anything has, commands included. A private member is compared by
  // where it was declared, so only a query has this one.
  declare private readonly _query: true;
}
